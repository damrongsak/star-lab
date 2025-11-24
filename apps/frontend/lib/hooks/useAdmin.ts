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
}

// User Form Data Type for Create/Update
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  status: "Active" | "Inactive";
}

export const useAdminStats = () => {
  return useQuery<AdminStats, Error>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const response = await apiClient.get<AdminStats>("/admin/statistics");
      return response.data;
    },
  });
};

export const useUsers = (filters?: { role?: string; search?: string }) => {
  return useQuery<User[], Error>({
    queryKey: ["users", filters],
    queryFn: async () => {
      const response = await apiClient.get<User[]>("/admin/users", { params: filters });
      return response.data;
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
