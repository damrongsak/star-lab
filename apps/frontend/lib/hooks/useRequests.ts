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
  page?: number;
  limit?: number;
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
 * Fetch all test requests for the authenticated customer with optional filters
 */
async function fetchRequests(filters: RequestFilters = {}): Promise<RequestsResponse> {
  try {
    const params = new URLSearchParams();

    const search = filters.search?.trim();
    if (search) {
      params.set("search", search);
    }

    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    // Add pagination params
    if (filters.page) {
      params.set("page", filters.page.toString());
    }
    if (filters.limit) {
      params.set("limit", filters.limit.toString());
    }

    const endpoint = params.toString()
      ? `/test-requests/my-requests?${params.toString()}`
      : "/test-requests/my-requests";

    const response = await apiClient.get<RequestsResponse>(endpoint);

    // The API returns { testRequests: [], total, totalPages, currentPage }
    if (!response.data || !response.data.testRequests) {
      console.error("Invalid API response format:", response.data);
      return {
        testRequests: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    // Return empty response instead of throwing
    return {
      testRequests: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
    };
  }
}

/**
 * Hook to fetch requests list
 */
export function useRequests(filters: RequestFilters = {}) {
  return useQuery<RequestsResponse>({
    queryKey: ["requests", filters.search ?? "", filters.status ?? "all", filters.page ?? 1, filters.limit ?? 10],
    queryFn: () => fetchRequests(filters),
    placeholderData: (previousData) => previousData,
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
