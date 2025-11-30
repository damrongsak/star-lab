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
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<any>;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDoctorPendingApprovals(params?: any): UsePendingApprovalsResult {
  const { searchQuery, page = 1, limit = 10 } = params || {};
  const { data, isLoading, error, refetch } = useQuery<{ data: TestRequest[]; pagination: any }>({
    queryKey: ["doctor", "pending-approvals", searchQuery, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any[]; pagination: any }>("/doctors/pending-approvals", {
        params: { search: searchQuery, page, limit },
      });
      return {
        data: response.data.data.map(transformTestRequest),
        pagination: response.data.pagination,
      };
    },
  });

  return {
    data: data?.data,
    total: data?.pagination?.total || 0,
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: data?.pagination?.page || 1,
    isLoading,
    error,
    refetch,
  };
}

export interface UseApprovedRequestsResult {
  data: TestRequest[] | undefined;
  total: number;
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: unknown;
  refetch: () => Promise<any>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useDoctorApprovedRequests(params?: any): UseApprovedRequestsResult {
  const { searchQuery, page = 1, limit = 10 } = params || {};
  const { data, isLoading, error, refetch } = useQuery<{ data: TestRequest[]; pagination: any }>({
    queryKey: ["doctor", "approved-requests", searchQuery, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: any[]; pagination: any }>("/doctors/approved-requests", {
        params: { search: searchQuery, page, limit },
      });
      return {
        data: response.data.data.map(transformTestRequest),
        pagination: response.data.pagination,
      };
    },
  });

  return {
    data: data?.data,
    total: data?.pagination?.total || 0,
    totalPages: data?.pagination?.totalPages || 0,
    currentPage: data?.pagination?.page || 1,
    isLoading,
    error,
    refetch,
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

export const useDoctorStats = useWorkload;

export function useDownloadReport() {
  const downloadReport = async (requestId: string, requestNo: string) => {
    try {
      const response = await apiClient.get(`/doctors/requests/${requestId}/report`, {
        responseType: "blob",
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report-${requestNo}.pdf`);

      // Append to html link element page
      document.body.appendChild(link);

      // Start download
      link.click();

      // Clean up and remove the link
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error downloading report:", error);
      throw error;
    }
  };

  return { downloadReport };
}
