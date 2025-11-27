import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { UserRole } from "@star-lab/shared";

// AdminStats Type
export interface AdminStats {
  totalUsers: number;
  totalCustomers: number;
  totalTestRequests: number;
  pendingApprovals: number;
  activeTechnicians: number;
  totalInvoices: number;
}

// User Type (simplified for hooks, full details in UserFormDialog)
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "Active" | "Inactive";
  isEmailConfirmed: boolean;
}

// User Form Data Type for Create/Update
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isEmailConfirmed: boolean;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  timestamp: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  user?: {
    email: string;
    role: UserRole;
  };
}

export interface AuditLogsResponse {
  logs: AuditLog[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const useAdminStats = () => {
  return useQuery<AdminStats, Error>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response = await apiClient.get<any>("/admin/stats");
      return response.data;
    },
  });
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export const useUsers = (
  filters?: { role?: string; search?: string },
  page: number = 1,
  limit: number = 10
) => {
  return useQuery<PaginatedResponse<User>, Error>({
    queryKey: ["users", filters, page, limit],
    queryFn: async () => {
      const response = await apiClient.get<{ users: User[]; total: number; totalPages: number; currentPage: number }>(
        "/admin/users",
        { params: { ...filters, page, limit } }
      );
      return {
        data: response.data.users,
        total: response.data.total,
        totalPages: response.data.totalPages,
        currentPage: response.data.currentPage,
      };
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserFormData>({
    mutationFn: async (newUser) => {
      const response = await apiClient.post<User>("/admin/users", newUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, Partial<UserFormData>>({
    mutationFn: async (updatedUser) => {
      const response = await apiClient.put<User>(`/admin/users/${id}`, updatedUser);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (userId) => {
      await apiClient.delete(`/admin/users/${userId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useAuditLogs = (page = 1, limit = 10) => {
  return useQuery<AuditLogsResponse, Error>({
    queryKey: ["audit-logs", page, limit],
    queryFn: async () => {
      const response = await apiClient.get<AuditLogsResponse>("/audit", { params: { page, limit } });
      return response.data;
    },
  });
};
