import { useQuery, useMutation } from "@tanstack/react-query";
import type { TestRequest } from "@star-lab/shared";
import { apiClient } from "../api/client";

export interface UsePendingApprovalsResult {
  data: TestRequest[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<TestRequest[] | undefined>;
}

export interface UseRequestDetailResult {
  data: TestRequest | undefined;
  isLoading: boolean;
  error: unknown;
}

export interface UseApproveRequestResult {
  approveRequest: (id: string) => Promise<unknown>;
  isLoading: boolean;
}

export interface RejectRequestInput {
  id: string;
  reason: string;
}

export interface UseRejectRequestResult {
  rejectRequest: (input: RejectRequestInput) => Promise<unknown>;
  isLoading: boolean;
}

export function usePendingApprovals(searchQuery?: string): UsePendingApprovalsResult {
  const { data, isLoading, error, refetch } = useQuery<TestRequest[]>({
    queryKey: ["doctor", "pending-approvals", searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<TestRequest[]>("/doctors/pending-approvals", {
        params: { search: searchQuery },
      });
      return response.data;
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch: () => refetch().then((result) => result.data),
  };
}

export function useRequestDetail(id: string): UseRequestDetailResult {
  const { data, isLoading, error } = useQuery<TestRequest>({
    queryKey: ["doctor", "request", id],
    queryFn: async () => {
      const response = await apiClient.get<TestRequest>(`/doctors/requests/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });

  return {
    data,
    isLoading,
    error,
  };
}

export function useApproveRequest(): UseApproveRequestResult {
  const { mutateAsync, isLoading } = useMutation(async (id: string) => {
    const response = await apiClient.post(`/doctors/requests/${id}/approve`);
    return response.data;
  });

  return {
    approveRequest: mutateAsync,
    isLoading,
  };
}

export function useRejectRequest(): UseRejectRequestResult {
  const { mutateAsync, isLoading } = useMutation(async ({ id, reason }: RejectRequestInput) => {
    const response = await apiClient.post(`/doctors/requests/${id}/reject`, { reason });
    return response.data;
  });

  return {
    rejectRequest: mutateAsync,
    isLoading,
  };
}
