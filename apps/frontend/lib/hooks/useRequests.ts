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
  testRequests: TestRequest[];
  total: number;
  totalPages: number;
  currentPage: number;
}

/**
 * Fetch all test requests for the authenticated customer
 * Note: Backend /my-requests endpoint doesn't support search/status filtering yet
 * Filters should be applied client-side
 */
async function fetchRequests(): Promise<TestRequest[]> {
  try {
    // Backend currently doesn't support search/status parameters
    // Fetching all requests and filtering will be done client-side
    const response = await apiClient.get<RequestsResponse>("/test-requests/my-requests");

    // The API returns { testRequests: [], total, totalPages, currentPage }
    if (!response.data || !response.data.testRequests) {
      console.error("Invalid API response format:", response.data);
      return [];
    }

    return response.data.testRequests;
  } catch (error) {
    console.error("Error fetching requests:", error);
    // Return empty array instead of throwing, so React Query doesn't complain about undefined
    return [];
  }
}

/**
 * Hook to fetch requests list
 * Note: Filtering is done client-side, not on the backend
 */
export function useRequests() {
  return useQuery({
    queryKey: ["requests"],
    queryFn: fetchRequests,
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
