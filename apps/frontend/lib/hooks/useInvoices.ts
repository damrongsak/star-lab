import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import type { Invoice, InvoicePaymentStatus } from "@star-lab/shared";

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

  const response = await apiClient.get<InvoicesResponse>("/invoices/my-invoices", { params });

  // Convert date strings to Date objects
  return response.data.data.map((invoice) => ({
    ...invoice,
    invoiceDate: new Date(invoice.invoiceDate),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
    createdAt: new Date(invoice.createdAt),
    updatedAt: new Date(invoice.updatedAt),
    invoiceLineItems: invoice.invoiceLineItems.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
  }));
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
interface InvoiceResponse {
  success: boolean;
  data: Invoice;
}

/**
 * Fetch a single invoice by ID
 */
async function fetchInvoice(invoiceId: string): Promise<Invoice> {
  const response = await apiClient.get<InvoiceResponse>(`/invoices/${invoiceId}`);

  // Convert date strings to Date objects
  const invoice = response.data.data;
  return {
    ...invoice,
    invoiceDate: new Date(invoice.invoiceDate),
    dueDate: invoice.dueDate ? new Date(invoice.dueDate) : undefined,
    createdAt: new Date(invoice.createdAt),
    updatedAt: new Date(invoice.updatedAt),
    invoiceLineItems: invoice.invoiceLineItems.map((item) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    })),
  };
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
