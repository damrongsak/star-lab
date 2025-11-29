import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import type { TestRequest, TestRequestDocumentStatus, PaginatedResponse } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * Filters for requests list
 */
export interface RequestFilters {
  search?: string;
  status?: TestRequestDocumentStatus | "all";
  projectId?: string;
  page?: number;
  limit?: number;
}

/**
 * Fetch all test requests for the authenticated customer with optional filters
 */
async function fetchRequests(filters: RequestFilters = {}): Promise<PaginatedResponse<TestRequest>> {
  try {
    const params = new URLSearchParams();

    const search = filters.search?.trim();
    if (search) {
      params.set("search", search);
    }

    if (filters.status && filters.status !== "all") {
      params.set("status", filters.status);
    }

    if (filters.projectId && filters.projectId !== "all") {
      params.set("projectId", filters.projectId);
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

    const response = await apiClient.get<PaginatedResponse<TestRequest>>(endpoint);

    // The API returns { data: [], total, totalPages, currentPage, limit }
    if (!response.data || !response.data.data) {
      console.error("Invalid API response format:", response.data);
      return {
        data: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
        limit: filters.limit || 10,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching requests:", error);
    // Return empty response instead of throwing
    return {
      data: [],
      total: 0,
      totalPages: 0,
      currentPage: 1,
      limit: filters.limit || 10,
    };
  }
}

/**
 * Hook to fetch requests list
 */
export function useRequests(filters: RequestFilters = {}) {
  return useQuery<PaginatedResponse<TestRequest>>({
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
