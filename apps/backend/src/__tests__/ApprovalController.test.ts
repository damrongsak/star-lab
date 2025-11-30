import { Request, Response } from "express";
import { ApprovalController } from "../controllers/ApprovalController";
import { prisma } from "../utils/db";

// Define InvoicePaymentStatus enum for testing
const InvoicePaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED",
} as const;

// Mock @prisma/client to export the enum
jest.mock("@prisma/client", () => ({
  InvoicePaymentStatus: {
    PENDING: "PENDING",
    PAID: "PAID",
    OVERDUE: "OVERDUE",
    CANCELLED: "CANCELLED",
    REFUNDED: "REFUNDED",
  },
}));

// Mock Prisma
jest.mock("../utils/db", () => ({
  prisma: {
    invoice: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock logger
jest.mock("../utils/logger", () => ({
  __esModule: true,
  default: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

describe("ApprovalController", () => {
  let approvalController: ApprovalController;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    approvalController = new ApprovalController();
    mockReq = {
      user: {
        userId: "test-user-id",
        role: "APPROVAL",
        email: "test@test.com",
      },
      params: {},
      query: {},
      body: {},
    } as any;
    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe("getDashboard", () => {
    it("should return dashboard statistics", async () => {
      // Mock Prisma counts
      (prisma.invoice.count as jest.Mock)
        .mockResolvedValueOnce(5) // pendingReviews
        .mockResolvedValueOnce(10) // approvedThisMonth
        .mockResolvedValueOnce(2) // rejectedThisMonth
        .mockResolvedValueOnce(50); // totalPaid

      await approvalController.getDashboard(mockReq as any, mockRes as any);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: {
          pendingReviews: 5,
          approvedThisMonth: 10,
          rejectedThisMonth: 2,
          totalPaid: 50,
        },
      });
    });

    it("should handle errors gracefully", async () => {
      (prisma.invoice.count as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );

      await approvalController.getDashboard(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: "Failed to fetch dashboard statistics",
        }),
      );
    });
  });

  describe("getPendingPayments", () => {
    it("should return pending payment invoices with pagination", async () => {
      const mockInvoices = [
        {
          id: "inv-1",
          invoiceNo: "INV-001",
          paymentStatus: InvoicePaymentStatus.PAID,
          customer: { companyNameEn: "Test Company" },
        },
      ];

      (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);
      (prisma.invoice.count as jest.Mock).mockResolvedValue(1);

      mockReq.query = { page: "1", limit: "10" };

      await approvalController.getPendingPayments(
        mockReq as any,
        mockRes as any,
      );

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockInvoices,
        pagination: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it("should filter by search query", async () => {
      mockReq.query = { search: "TEST" };

      (prisma.invoice.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.invoice.count as jest.Mock).mockResolvedValue(0);

      await approvalController.getPendingPayments(
        mockReq as any,
        mockRes as any,
      );

      expect(prisma.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.any(Array),
          }),
        }),
      );
    });
  });

  describe("approvePayment", () => {
    it("should approve a valid payment", async () => {
      const mockInvoice = {
        id: "inv-1",
        invoiceNo: "INV-001",
        paymentStatus: InvoicePaymentStatus.PAID,
      };

      const updatedInvoice = {
        ...mockInvoice,
        issuedById: "test-user-id",
      };

      mockReq.params = { id: "inv-1" };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(mockInvoice);
      (prisma.invoice.update as jest.Mock).mockResolvedValue(updatedInvoice);

      await approvalController.approvePayment(mockReq as any, mockRes as any);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Payment approved successfully",
        data: updatedInvoice,
      });
    });

    it("should return 404 if invoice not found", async () => {
      mockReq.params = { id: "inv-999" };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      await approvalController.approvePayment(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Invoice not found",
      });
    });

    it("should return 400 if invoice is not in PAID status", async () => {
      const mockInvoice = {
        id: "inv-1",
        paymentStatus: InvoicePaymentStatus.PENDING,
      };

      mockReq.params = { id: "inv-1" };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(mockInvoice);

      await approvalController.approvePayment(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Invoice is not in PAID status",
      });
    });
  });

  describe("rejectPayment", () => {
    it("should reject a payment with a reason", async () => {
      const mockInvoice = {
        id: "inv-1",
        invoiceNo: "INV-001",
        paymentStatus: InvoicePaymentStatus.PAID,
      };

      const updatedInvoice = {
        ...mockInvoice,
        paymentStatus: InvoicePaymentStatus.PENDING,
        paymentSlipAttachmentUrl: null,
      };

      mockReq.params = { id: "inv-1" };
      mockReq.body = { reason: "Invalid payment slip" };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(mockInvoice);
      (prisma.invoice.update as jest.Mock).mockResolvedValue(updatedInvoice);

      await approvalController.rejectPayment(mockReq as any, mockRes as any);

      expect(prisma.invoice.update).toHaveBeenCalledWith({
        where: { id: "inv-1" },
        data: expect.objectContaining({
          paymentStatus: InvoicePaymentStatus.PENDING,
          paymentSlipAttachmentUrl: null,
        }),
        include: expect.any(Object),
      });

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "Payment rejected successfully",
        data: updatedInvoice,
      });
    });

    it("should return 400 if rejection reason is missing", async () => {
      mockReq.params = { id: "inv-1" };
      mockReq.body = {};

      await approvalController.rejectPayment(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Rejection reason is required",
      });
    });

    it("should return 404 if invoice not found", async () => {
      mockReq.params = { id: "inv-999" };
      mockReq.body = { reason: "Test reason" };

      (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

      await approvalController.rejectPayment(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Invoice not found",
      });
    });
  });

  describe("getInvoices", () => {
    it("should return all invoices with pagination", async () => {
      const mockInvoices = [
        {
          id: "inv-1",
          invoiceNo: "INV-001",
          paymentStatus: InvoicePaymentStatus.PAID,
        },
        {
          id: "inv-2",
          invoiceNo: "INV-002",
          paymentStatus: InvoicePaymentStatus.PENDING,
        },
      ];

      (prisma.invoice.findMany as jest.Mock).mockResolvedValue(mockInvoices);
      (prisma.invoice.count as jest.Mock).mockResolvedValue(2);

      mockReq.query = { page: "1", limit: "10" };

      await approvalController.getInvoices(mockReq as any, mockRes as any);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockInvoices,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      });
    });

    it("should filter by status if provided", async () => {
      mockReq.query = { status: "PAID" };

      (prisma.invoice.findMany as jest.Mock).mockResolvedValue([]);
      (prisma.invoice.count as jest.Mock).mockResolvedValue(0);

      await approvalController.getInvoices(mockReq as any, mockRes as any);

      expect(prisma.invoice.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            paymentStatus: "PAID",
          }),
        }),
      );
    });
  });
});
