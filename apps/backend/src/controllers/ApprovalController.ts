import { Response } from "express";
import { AuthenticatedRequest } from "../types";
import logger from "../utils/logger";
import { prisma } from "../utils/db";
import { InvoicePaymentStatus } from "@prisma/client";

export class ApprovalController {
  /**
   * Get approval dashboard statistics
   */
  getDashboard = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      // Get statistics
      const [pendingReviews, approvedThisMonth, rejectedThisMonth, totalPaid] =
        await Promise.all([
          // Pending reviews (PAID status awaiting approval)
          prisma.invoice.count({
            where: {
              paymentStatus: InvoicePaymentStatus.PAID,
              paymentSlipAttachmentUrl: { not: null },
            },
          }),
          // Approved this month (status changed from PAID to something else)
          // For now, we'll count total PAID invoices this month
          prisma.invoice.count({
            where: {
              paymentStatus: InvoicePaymentStatus.PAID,
              updatedAt: { gte: startOfMonth },
            },
          }),
          // Rejected this month (reverted to PENDING)
          prisma.invoice.count({
            where: {
              paymentStatus: InvoicePaymentStatus.PENDING,
              updatedAt: { gte: startOfMonth },
              paymentSlipAttachmentUrl: null,
            },
          }),
          // Total paid invoices
          prisma.invoice.count({
            where: { paymentStatus: InvoicePaymentStatus.PAID },
          }),
        ]);

      res.json({
        success: true,
        data: {
          pendingReviews,
          approvedThisMonth,
          rejectedThisMonth,
          totalPaid,
        },
      });
    } catch (error) {
      logger.error("Error fetching approval dashboard", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get pending payment approvals
   */
  getPendingPayments = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { page = "1", limit = "10", search } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);
      const skip = (pageNumber - 1) * pageSize;

      const whereClause: any = {
        paymentStatus: InvoicePaymentStatus.PAID,
        paymentSlipAttachmentUrl: { not: null },
      };

      // Add search filter
      if (search && typeof search === "string") {
        whereClause.OR = [
          { invoiceNo: { contains: search, mode: "insensitive" } },
          {
            customer: {
              companyNameEn: { contains: search, mode: "insensitive" },
            },
          },
        ];
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where: whereClause,
          include: {
            customer: {
              select: {
                id: true,
                companyNameEn: true,
                companyNameTh: true,
                operatorFirstName: true,
                operatorLastName: true,
              },
            },
            testRequest: {
              select: {
                id: true,
                requestNo: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.invoice.count({ where: whereClause }),
      ]);

      res.json({
        success: true,
        data: invoices,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      logger.error("Error fetching pending payments", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch pending payments",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get all invoices (for approval history)
   */
  getInvoices = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { page = "1", limit = "10", status, search } = req.query;
      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);
      const skip = (pageNumber - 1) * pageSize;

      const whereClause: any = {};

      // Filter by status if provided
      if (status && typeof status === "string") {
        whereClause.paymentStatus = status as InvoicePaymentStatus;
      }

      // Add search filter
      if (search && typeof search === "string") {
        whereClause.OR = [
          { invoiceNo: { contains: search, mode: "insensitive" } },
          {
            customer: {
              companyNameEn: { contains: search, mode: "insensitive" },
            },
          },
        ];
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where: whereClause,
          include: {
            customer: {
              select: {
                id: true,
                companyNameEn: true,
                companyNameTh: true,
                operatorFirstName: true,
                operatorLastName: true,
              },
            },
            testRequest: {
              select: {
                id: true,
                requestNo: true,
              },
            },
          },
          orderBy: { updatedAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.invoice.count({ where: whereClause }),
      ]);

      res.json({
        success: true,
        data: invoices,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      });
    } catch (error) {
      logger.error("Error fetching invoices", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch invoices",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Approve a payment
   */
  approvePayment = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user!.userId;

      const invoice = await prisma.invoice.findUnique({
        where: { id },
      });

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      if (invoice.paymentStatus !== InvoicePaymentStatus.PAID) {
        res.status(400).json({
          success: false,
          message: "Invoice is not in PAID status",
        });
        return;
      }

      // Update invoice with approval (keep as PAID, just log approval)
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          // Keep status as PAID
          // Store approver info in issuedById
          issuedById: userId,
          updatedAt: new Date(),
        },
        include: {
          customer: {
            select: {
              companyNameEn: true,
              operatorFirstName: true,
              operatorLastName: true,
            },
          },
        },
      });

      logger.info("Payment approved", {
        invoiceId: id,
        invoiceNo: invoice.invoiceNo,
        approvedBy: userId,
      });

      res.json({
        success: true,
        message: "Payment approved successfully",
        data: updatedInvoice,
      });
    } catch (error) {
      logger.error("Error approving payment", {
        error,
        invoiceId: req.params.id,
      });
      res.status(500).json({
        success: false,
        message: "Failed to approve payment",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Reject a payment
   */
  rejectPayment = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const userId = req.user!.userId;

      if (!reason || typeof reason !== "string") {
        res.status(400).json({
          success: false,
          message: "Rejection reason is required",
        });
        return;
      }

      const invoice = await prisma.invoice.findUnique({
        where: { id },
      });

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      if (invoice.paymentStatus !== InvoicePaymentStatus.PAID) {
        res.status(400).json({
          success: false,
          message: "Invoice is not in PAID status",
        });
        return;
      }

      // Revert to PENDING and clear payment slip
      const updatedInvoice = await prisma.invoice.update({
        where: { id },
        data: {
          paymentStatus: InvoicePaymentStatus.PENDING,
          paymentSlipAttachmentUrl: null,
          updatedAt: new Date(),
        },
        include: {
          customer: {
            select: {
              companyNameEn: true,
              operatorFirstName: true,
              operatorLastName: true,
            },
          },
        },
      });

      logger.info("Payment rejected", {
        invoiceId: id,
        invoiceNo: invoice.invoiceNo,
        rejectedBy: userId,
        reason,
      });

      res.json({
        success: true,
        message: "Payment rejected successfully",
        data: updatedInvoice,
      });
    } catch (error) {
      logger.error("Error rejecting payment", {
        error,
        invoiceId: req.params.id,
      });
      res.status(500).json({
        success: false,
        message: "Failed to reject payment",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
