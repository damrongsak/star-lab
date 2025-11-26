import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient as api } from "@/lib/api/client";
import { toast } from "sonner";

// Types
// Types
export interface LabStats {
  totalTests: number;
  pendingTests: number;
  inProgressTests: number;
  completedTests: number;
  reviewedTests: number;
  approvedTests: number;
  totalResults: number;
  abnormalResults: number;
  abnormalRate: number;
}

export interface LabTest {
  id: string;
  testRequestId: string;
  testCode: string;
  name: string;
  status: string;
  technicianId?: string;
  result?: any;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  TestRequest: {
    requestNo: string;
    Customer: {
      companyName: string;
    };
  };
}

export interface Sample {
  id: string;
  sampleId: string;
  type: string;
  status: string;
  collectionDate: string;
  testRequestId: string;
}

// Hooks
export function useLabStats() {
  return useQuery({
    queryKey: ["lab", "stats"],
    queryFn: async () => {
      const response = await api.get<LabStats>("/lab/statistics");
      return response.data;
    },
  });
}

export function useMyTests(filters?: any) {
  return useQuery({
    queryKey: ["lab", "my-tests", filters],
    queryFn: async () => {
      const response = await api.get<any>("/lab/my-tests", { params: filters });
      return response.data;
    },
  });
}

export function useLabRequests(filters?: any) {
  return useQuery({
    queryKey: ["lab", "requests", filters],
    queryFn: async () => {
      const response = await api.get("/lab/test-requests", { params: filters });
      return response.data;
    },
  });
}

export function useLabRequest(id: string) {
  return useQuery({
    queryKey: ["lab", "request", id],
    queryFn: async () => {
      const response = await api.get(`/lab/test-requests/${id}`);
      return response.data.testRequest;
    },
    enabled: !!id,
  });
}

export function useSamples(filters?: any) {
  return useQuery({
    queryKey: ["lab", "samples", filters],
    queryFn: async () => {
      const response = await api.get("/lab/samples", { params: filters });
      return response.data;
    },
  });
}

export function useAcknowledgeSample() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId }: { requestId: string }) => {
      const response = await api.post(`/lab/acknowledge/${requestId}`);
      return response.data;
    },
    onSuccess: (_, { requestId }) => {
      toast.success("Samples acknowledged successfully");
      queryClient.invalidateQueries({ queryKey: ["lab", "request", requestId] });
      queryClient.invalidateQueries({ queryKey: ["lab", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["lab", "requests"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to acknowledge samples");
    },
  });
}

export function useSubmitResult() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      labTestId: string;
      resultId?: string;
      parameter: string;
      value: string;
      notes?: string;
      status?: "IN_PROGRESS" | "COMPLETED";
    }) => {
      // 1. Save the result (Create or Update)
      let savedResult;
      if (data.resultId) {
        // Update existing result
        const response = await api.put(`/lab/results/${data.resultId}`, {
          value: data.value,
          notes: data.notes,
          parameter: data.parameter, // Ensure parameter is sent if needed, though update might not need it if not changing
        });
        savedResult = response.data;
      } else {
        // Create new result
        const response = await api.post("/lab/results", {
          labTestId: data.labTestId,
          parameter: data.parameter,
          value: data.value,
          notes: data.notes,
          recordedById: "user-id-placeholder", // Backend handles this from token
        });
        savedResult = response.data;
      }

      // 2. If status is COMPLETED, call complete endpoint
      if (data.status === "COMPLETED") {
        await api.post(`/lab/tests/${data.labTestId}/complete`);
      }

      return savedResult;
    },
    onSuccess: () => {
      toast.success("Test result saved successfully");
      queryClient.invalidateQueries({ queryKey: ["lab"] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to save result");
    },
  });
}
