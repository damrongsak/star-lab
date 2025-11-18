import { useQuery, useMutation } from "@tanstack/react-query";
import type { TestRequest } from "@star-lab/shared";
import { apiClient } from "../api/client";

// Transform snake_case API response to camelCase
function transformTestRequest(data: any): TestRequest {
  return {
    ...data,
    requestNo: data.request_no || data.requestNo,
    customerId: data.customer_id || data.customerId,
    requesterName: data.requester_name || data.requesterName,
    requestDate: data.request_date || data.requestDate,
    documentStatus: data.document_status || data.documentStatus,
    labInternalStatus: data.lab_internal_status || data.labInternalStatus,
    projectId: data.project_id || data.projectId,
    doctorId: data.doctor_id || data.doctorId,
    approvedAt: data.approved_at || data.approvedAt,
    approvedById: data.approved_by_id || data.approvedById,
    rejectedAt: data.rejected_at || data.rejectedAt,
    rejectionReason: data.rejection_reason || data.rejectionReason,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt,
    testRequestSamples: data.testRequestSamples || data.test_request_samples || [],
    customer: data.customer ? {
      ...data.customer,
      companyNameEn: data.customer.companyNameEn || data.customer.company_name_en,
      companyNameTh: data.customer.companyNameTh || data.customer.company_name_th,
      operatorFirstName: data.customer.operatorFirstName || data.customer.operator_first_name || data.customer.operatorFirstName,
      operatorLastName: data.customer.operatorLastName || data.customer.operator_last_name || data.customer.operatorLastName,
    } : data.customer,
  };
}

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
      const response = await apiClient.get<{ success: boolean; data: any[] }>("/doctors/pending-approvals", {
        params: { search: searchQuery },
      });
      return response.data.data.map(transformTestRequest);
    },
  });

  return {
    data,
    isLoading,
    error,
    refetch: () => refetch().then((result) => result.data),
  };
}

export interface UseApprovedRequestsResult {
  data: TestRequest[] | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<TestRequest[] | undefined>;
}

export function useApprovedRequests(searchQuery?: string): UseApprovedRequestsResult {
  const { data, isLoading, error, refetch } = useQuery<TestRequest[]>({
    queryKey: ["doctor", "approved-requests", searchQuery],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any[] }>("/doctors/approved-requests", {
        params: { search: searchQuery },
      });
      return response.data.data.map(transformTestRequest);
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
      const response = await apiClient.get<{ success: boolean; data: any }>(`/doctors/requests/${id}`);
      return transformTestRequest(response.data.data);
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
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiClient.post(`/doctors/requests/${id}/approve`);
      return response.data;
    },
  });

  return {
    approveRequest: mutateAsync,
    isLoading: isPending,
  };
}

export function useRejectRequest(): UseRejectRequestResult {
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async ({ id, reason }: RejectRequestInput) => {
      const response = await apiClient.post(`/doctors/requests/${id}/reject`, { reason });
      return response.data;
    },
  });

  return {
    rejectRequest: mutateAsync,
    isLoading: isPending,
  };
}

export interface WorkloadStats {
  pendingReviews: number;
  approvedThisWeek: number;
  approvedThisMonth: number;
  rejectedThisWeek: number;
  rejectedThisMonth: number;
  totalAssigned: number;
  averageTurnaroundHours: number;
  completedThisMonth: number;
}

export interface UseWorkloadResult {
  data: WorkloadStats | undefined;
  isLoading: boolean;
  error: unknown;
}

export function useWorkload(): UseWorkloadResult {
  const { data, isLoading, error } = useQuery<WorkloadStats>({
    queryKey: ["doctor", "workload"],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: WorkloadStats }>("/doctors/profile/workload");
      return response.data.data;
    },
  });

  return {
    data,
    isLoading,
    error,
  };
}
