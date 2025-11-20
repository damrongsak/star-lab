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

export function useMyTests() {
  return useQuery({
    queryKey: ["lab", "my-tests"],
    queryFn: async () => {
      const response = await api.get<any>("/lab/my-tests");
      return response.data.labTests || [];
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
      testId: string;
      result: any;
      notes?: string;
      status?: "IN_PROGRESS" | "COMPLETED";
    }) => {
      // If it's a new result, use POST, otherwise PUT
      // For simplicity, we'll assume the backend handles upsert or we use a specific endpoint
      // Based on routes, we have POST /lab/results and PUT /lab/results/:id
      // We might need to adjust based on actual backend implementation
      // Let's assume we are completing the test
      if (data.status === "COMPLETED") {
        return await api.post(`/lab/tests/${data.testId}/complete`, {
          result: data.result,
          notes: data.notes
        });
      }

      // Otherwise just updating
      return await api.put(`/lab/results/${data.testId}`, {
        result: data.result,
        notes: data.notes
      });
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
