import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient, getErrorMessage } from "@/lib/api/client";
import type { Invoice, InvoicePaymentStatus } from "@star-lab/shared";
import { toast } from "sonner";

/**
 * Filters for invoices list
 */
export interface InvoiceFilters {
  search?: string;
  status?: InvoicePaymentStatus | "all";
}

/**
 * API response for invoices list
 */
interface InvoicesResponse {
  success: boolean;
  data: Invoice[];
}

interface InvoiceResponse {
  success: boolean;
  data: Invoice;
}

/**
 * Normalize invoice date fields returned from API
 */
function normalizeInvoice(invoice: Invoice): Invoice {
  return {
    ...invoice,
    invoiceDate: new Date(invoice.invoiceDate),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
    createdAt: new Date(invoice.createdAt),
    updatedAt: new Date(invoice.updatedAt),
    invoiceLineItems: invoice.invoiceLineItems?.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })) || [],
  };
}

/**
 * Fetch all invoices for the authenticated customer
 */
async function fetchInvoices(filters?: InvoiceFilters): Promise<Invoice[]> {
  const params: Record<string, string> = {};

  if (filters?.search) {
    params.search = filters.search;
  }

  if (filters?.status && filters.status !== "all") {
    params.status = filters.status;
  }

  const response = await apiClient.get<InvoicesResponse>("/invoices", { params });

  return response.data.data.map((invoice) => normalizeInvoice(invoice));
}

/**
 * Hook to fetch invoices list
 * @param filters - Optional filters for search and status
 */
export function useInvoices(filters?: InvoiceFilters) {
  return useQuery({
    queryKey: ["invoices", filters],
    queryFn: () => fetchInvoices(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * API response for single invoice
 */
/**
 * Fetch a single invoice by ID
 */
async function fetchInvoice(invoiceId: string): Promise<Invoice> {
  const response = await apiClient.get<InvoiceResponse>(`/invoices/${invoiceId}`);
  return normalizeInvoice(response.data.data);
}

/**
 * Hook to fetch a single invoice
 * @param invoiceId - The invoice ID to fetch
 * @param enabled - Whether the query should execute (default: true)
 */
export function useInvoice(invoiceId: string, enabled = true) {
  return useQuery({
    queryKey: ["invoice", invoiceId],
    queryFn: () => fetchInvoice(invoiceId),
    enabled: enabled && !!invoiceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

interface MarkInvoicePaidParams {
  invoiceId: string;
  formData: FormData;
}

async function markInvoicePaid({ invoiceId, formData }: MarkInvoicePaidParams): Promise<Invoice> {
  // Let axios automatically set Content-Type with boundary for multipart/form-data
  const response = await apiClient.patch<InvoiceResponse>(
    `/invoices/${invoiceId}/mark-paid`,
    formData,
  );

  return normalizeInvoice(response.data.data);
}

/**
 * Hook to upload payment slip and mark invoice as paid
 */
export function useMarkInvoicePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markInvoicePaid,
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Payment slip uploaded successfully");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

interface VerifyPaymentParams {
  invoiceId: string;
  status: "PAID" | "REJECTED";
  rejectionReason?: string;
}

async function verifyPayment({ invoiceId, status, rejectionReason }: VerifyPaymentParams): Promise<Invoice> {
  const response = await apiClient.post<InvoiceResponse>(
    `/invoices/${invoiceId}/verify`,
    { status, rejectionReason }
  );
  return normalizeInvoice(response.data.data);
}

/**
 * Hook to verify invoice payment (Admin only)
 */
export function useVerifyPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: (invoice) => {
      queryClient.invalidateQueries({ queryKey: ["invoice", invoice.id] });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success(`Payment ${invoice.paymentStatus === "PAID" ? "approved" : "rejected"} successfully`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}
