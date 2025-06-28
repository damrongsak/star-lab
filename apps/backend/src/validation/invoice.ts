import { z } from "zod";

// Create invoice from test request validation
export const createInvoiceSchema = z.object({
  params: z.object({
    testRequestId: z.string().uuid("Invalid test request ID format"),
  }),
});

// Update invoice validation
export const updateInvoiceSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid("Invalid invoice ID format"),
  }),
  body: z.object({
    dueDate: z.string().datetime().optional(),
    labTaxInfo: z.any().optional(),
    subTotal: z.number().positive().optional(),
    taxRate: z.number().min(0).max(1).optional(),
    paymentStatus: z
      .enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"])
      .optional(),
    paymentSlipAttachmentUrl: z.string().url().optional(),
  }),
});

// Mark invoice as paid validation
export const markAsPaidSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid("Invalid invoice ID format"),
  }),
  body: z.object({
    paymentSlipUrl: z.string().url().optional(),
  }),
});

// Get invoice by ID validation
export const getInvoiceSchema = z.object({
  params: z.object({
    invoiceId: z.string().uuid("Invalid invoice ID format"),
  }),
});

// Get invoice by number validation
export const getInvoiceByNumberSchema = z.object({
  params: z.object({
    invoiceNo: z.string().min(1, "Invoice number is required"),
  }),
});

// Get invoices query validation
export const getInvoicesSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).optional().default("1"),
    limit: z.string().regex(/^\d+$/).optional().default("10"),
    status: z.enum(["PENDING", "PAID", "OVERDUE", "CANCELLED"]).optional(),
    customerId: z.string().uuid().optional(),
  }),
});

// Search invoices validation
export const searchInvoicesSchema = z.object({
  query: z.object({
    q: z.string().min(1, "Search query is required"),
  }),
});

// Invoice statistics validation (no body/params needed, just ensure admin access)
export const getStatisticsSchema = z.object({
  query: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    customerId: z.string().uuid().optional(),
  }),
});

// Type exports for controllers
export type CreateInvoiceRequest = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceRequest = z.infer<typeof updateInvoiceSchema>;
export type MarkAsPaidRequest = z.infer<typeof markAsPaidSchema>;
export type GetInvoiceRequest = z.infer<typeof getInvoiceSchema>;
export type GetInvoiceByNumberRequest = z.infer<
  typeof getInvoiceByNumberSchema
>;
export type GetInvoicesRequest = z.infer<typeof getInvoicesSchema>;
export type SearchInvoicesRequest = z.infer<typeof searchInvoicesSchema>;
export type GetStatisticsRequest = z.infer<typeof getStatisticsSchema>;
