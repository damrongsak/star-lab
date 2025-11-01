import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import type { TestRequest, TestRequestDocumentStatus } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * Filters for requests list
 */
export interface RequestFilters {
  search?: string;
  status?: TestRequestDocumentStatus | "all";
}

/**
 * API response for requests list
 */
interface RequestsResponse {
  success: boolean;
  data: TestRequest[];
}

/**
 * Fetch all test requests for the authenticated customer
 */
async function fetchRequests(filters?: RequestFilters): Promise<TestRequest[]> {
  try {
    const params: Record<string, string> = {};

    if (filters?.search) {
      params.search = filters.search;
    }

    if (filters?.status && filters.status !== "all") {
      params.status = filters.status;
    }

    const response = await apiClient.get<RequestsResponse>("/test-requests/my-requests", { params });

    // Ensure we always return an array
    if (!response.data || !response.data.data) {
      console.error("Invalid API response format:", response.data);
      return [];
    }

    return response.data.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    // Return empty array instead of throwing, so React Query doesn't complain about undefined
    return [];
  }
}

/**
 * Hook to fetch requests list
 * @param filters - Optional filters for search and status
 */
export function useRequests(filters?: RequestFilters) {
  return useQuery({
    queryKey: ["requests", filters],
    queryFn: () => fetchRequests(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Delete a test request
 */
async function deleteRequest(requestId: string): Promise<void> {
  await apiClient.delete(`/test-requests/${requestId}`);
}

/**
 * Hook to delete a request
 */
export function useDeleteRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRequest,
    onSuccess: () => {
      // Invalidate requests list to refetch
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      toast.success("Request deleted successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
