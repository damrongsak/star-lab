import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import type { TestRequest } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * API response for single request
 */
interface RequestResponse {
  success: boolean;
  data: TestRequest;
}

/**
 * Fetch a single test request by ID
 */
async function fetchRequest(requestId: string): Promise<TestRequest> {
  const response = await apiClient.get<RequestResponse>(`/test-requests/${requestId}`);
  return response.data.data;
}

/**
 * Hook to fetch a single request
 * @param requestId - The request ID to fetch
 * @param enabled - Whether the query should execute (default: true)
 */
export function useRequest(requestId: string, enabled = true) {
  return useQuery({
    queryKey: ["request", requestId],
    queryFn: () => fetchRequest(requestId),
    enabled: enabled && !!requestId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Request data for creating a new request
 */
export interface CreateRequestData {
  requesterName: string;
  objective?: string;
  project?: string;
  notes?: string;
  samples: {
    customerSampleId: string;
    sentSampleDate?: string;
    animalType?: string;
    sampleSpecimen?: string;
    panel?: string;
    method?: string;
    requestedQty: number;
    unit?: string;
  }[];
  documentStatus: "DRAFT" | "SUBMITTED";
}

/**
 * Create a new test request
 */
async function createRequest(data: CreateRequestData): Promise<TestRequest> {
  const response = await apiClient.post<RequestResponse>("/test-requests", data);
  return response.data.data;
}

/**
 * Hook to create a new request
 */
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createRequest,
    onSuccess: (data) => {
      // Invalidate requests list to refetch
      queryClient.invalidateQueries({ queryKey: ["requests"] });

      if (data.documentStatus === "DRAFT") {
        toast.success("Request saved as draft");
      } else {
        toast.success("Request submitted successfully");
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Request data for updating a request
 */
export interface UpdateRequestData extends Partial<CreateRequestData> {
  id: string;
}

/**
 * Update an existing test request
 */
async function updateRequest(data: UpdateRequestData): Promise<TestRequest> {
  const { id, ...updateData } = data;
  const response = await apiClient.put<RequestResponse>(`/test-requests/${id}`, updateData);
  return response.data.data;
}

/**
 * Hook to update a request
 */
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateRequest,
    onSuccess: (data) => {
      // Invalidate specific request and requests list
      queryClient.invalidateQueries({ queryKey: ["request", data.id] });
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
