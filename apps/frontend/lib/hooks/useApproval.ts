import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "../api/client";

// Types
export interface ApprovalStats {
    pendingReviews: number;
    approvedThisMonth: number;
    rejectedThisMonth: number;
    totalPaid: number;
}

export interface PendingPayment {
    id: string;
    invoiceNo: string;
    invoiceDate: string;
    netTotal: number;
    paymentStatus: string;
    paymentSlipAttachmentUrl: string | null;
    customer: {
        companyNameEn: string;
        companyNameTh: string;
        operatorFirstName: string;
        operatorLastName: string;
    };
    testRequest: {
        id: string;
        requestNo: string;
    };
}

// Get approval dashboard stats
export function useApprovalStats() {
    return useQuery<ApprovalStats>({
        queryKey: ["approval", "dashboard"],
        queryFn: async () => {
            const response = await apiClient.get("/approval/dashboard");
            return response.data.data;
        },
    });
}

// Get pending payments
export function usePendingPayments(params?: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params || {};

    return useQuery<{
        data: PendingPayment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>({
        queryKey: ["approval", "pending-payment", page, limit, search],
        queryFn: async () => {
            const response = await apiClient.get("/approval/pending-payment", {
                params: { page, limit, search },
            });
            return {
                data: response.data.data,
                pagination: response.data.pagination,
            };
        },
    });
}

// Get all invoices
export function useApprovalInvoices(params?: { page?: number; limit?: number; status?: string; search?: string }) {
    const { page = 1, limit = 10, status, search } = params || {};

    return useQuery<{
        data: PendingPayment[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>({
        queryKey: ["approval", "invoices", page, limit, status, search],
        queryFn: async () => {
            const response = await apiClient.get("/approval/invoices", {
                params: { page, limit, status, search },
            });
            return {
                data: response.data.data,
                pagination: response.data.pagination,
            };
        },
    });
}

// Approve payment
export function useApprovePayment() {
    return useMutation({
        mutationFn: async (invoiceId: string) => {
            const response = await apiClient.post(`/approval/invoices/${invoiceId}/approve`);
            return response.data;
        },
    });
}

// Reject payment
export function useRejectPayment() {
    return useMutation({
        mutationFn: async ({ invoiceId, reason }: { invoiceId: string; reason: string }) => {
            const response = await apiClient.post(`/approval/invoices/${invoiceId}/reject`, { reason });
            return response.data;
        },
    });
}
