import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import type { Customer, User } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * API response for customer profile update
 */
interface UpdateProfileResponse {
  message: string;
  customer: Customer;
}

/**
 * Combined profile data structure
 */
export interface ProfileData {
  user: User;
  customer: Customer | null;
}

/**
 * Fetch user profile (works for all roles)
 */
async function fetchProfile(): Promise<ProfileData> {
  const response = await apiClient.get<ProfileData>("/auth/profile");
  
  const { user, customer } = response.data;

  // Convert user dates
  const processedUser = {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };

  // Convert customer dates if it exists
  const processedCustomer = customer ? {
    ...customer,
    createdAt: new Date(customer.createdAt),
    updatedAt: new Date(customer.updatedAt),
  } : null;

  return {
    user: processedUser,
    customer: processedCustomer
  };
}

/**
 * Hook to fetch profile
 */
export function useProfile() {
  // Fetch profile data using React Query
  return useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Profile update data
 */
export interface UpdateProfileData {
  companyNameEn?: string;
  companyNameTh?: string;
  companyPhone?: string;
  companyFax?: string;
  companyAddressLine1?: string;
  companyProvince?: string;
  companyDistrict?: string;
  companySubDistrict?: string;
  companyZipCode?: string;
  operatorPrefix?: string;
  operatorFirstName?: string;
  operatorLastName?: string;
  operatorMobilePhone?: string;
  operatorPhone?: string;
  companyDescription?: string;
}

/**
 * Update customer profile
 */
async function updateProfile(data: UpdateProfileData): Promise<Customer> {
  const response = await apiClient.put<UpdateProfileResponse>("/customers/profile", data);

  // Convert date strings to Date objects
  const customer = response.data.customer;
  return {
    ...customer,
    createdAt: new Date(customer.createdAt),
    updatedAt: new Date(customer.updatedAt),
  };
}

/**
 * Hook to update customer profile
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      // Invalidate profile to refetch
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Change password data
 */
export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

/**
 * Change customer password
 */
async function changePassword(data: ChangePasswordData): Promise<void> {
  await apiClient.post("/auth/change-password", data);
}

/**
 * Hook to change password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
