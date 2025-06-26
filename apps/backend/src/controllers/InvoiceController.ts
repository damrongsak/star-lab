import { Response } from "express";
import { InvoiceService } from "../services/InvoiceService";
import { AuthenticatedRequest } from "../types";
import logger from "../utils/logger";

export class InvoiceController {
  private invoiceService: InvoiceService;

  constructor() {
    this.invoiceService = new InvoiceService();
  }

  /**
   * Create invoice from test request
   */
  createInvoice = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { testRequestId } = req.params;
      const userId = req.user!.id;

      const invoice = await this.invoiceService.generateInvoiceFromTestRequest(
        testRequestId,
        userId,
      );

      logger.info("Invoice created successfully", {
        invoiceId: invoice.id,
        testRequestId,
        userId,
      });

      res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        data: invoice,
      });
    } catch (error) {
      logger.error("Error creating invoice", {
        error,
        testRequestId: req.params.testRequestId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to create invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get invoice by ID
   */
  getInvoice = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { invoiceId } = req.params;
      const userRole = req.user!.role;
      const userId = req.user!.id;

      const invoice = await this.invoiceService.getInvoiceById(invoiceId);

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      // Check if user has permission to access this invoice (basic check)
      if (userRole === "CUSTOMER" && invoice.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }

      res.json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      logger.error("Error fetching invoice", {
        error,
        invoiceId: req.params.invoiceId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get invoices for user (customer view) or all invoices (admin view)
   */
  getInvoices = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const userRole = req.user!.role;
      const { page = "1", limit = "10", status } = req.query;

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);

      let result;

      if (userRole === "CUSTOMER") {
        // Customer can only see their own invoices
        result = await this.invoiceService.getInvoicesByCustomer(
          userId,
          pageNumber,
          pageSize,
          status as any,
        );
      } else {
        // Admin/staff can see all invoices
        result = await this.invoiceService.getAllInvoices(
          pageNumber,
          pageSize,
          status as any,
        );
      }

      res.json({
        success: true,
        data: result.invoices,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total: result.total,
          totalPages: Math.ceil(result.total / pageSize),
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
   * Update invoice payment status (mark as paid)
   */
  markAsPaid = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { invoiceId } = req.params;
      const { paymentSlipUrl } = req.body;

      const invoice = await this.invoiceService.markInvoiceAsPaid(
        invoiceId,
        paymentSlipUrl,
      );

      logger.info("Invoice marked as paid", {
        invoiceId,
        userId: req.user!.id,
      });

      res.json({
        success: true,
        message: "Invoice marked as paid successfully",
        data: invoice,
      });
    } catch (error) {
      logger.error("Error marking invoice as paid", {
        error,
        invoiceId: req.params.invoiceId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to mark invoice as paid",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Update invoice details
   */
  updateInvoice = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { invoiceId } = req.params;
      const updateData = req.body;

      const invoice = await this.invoiceService.updateInvoice(
        invoiceId,
        updateData,
      );

      logger.info("Invoice updated", {
        invoiceId,
        userId: req.user!.id,
      });

      res.json({
        success: true,
        message: "Invoice updated successfully",
        data: invoice,
      });
    } catch (error) {
      logger.error("Error updating invoice", {
        error,
        invoiceId: req.params.invoiceId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to update invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get invoice statistics (admin only)
   */
  getStatistics = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const stats = await this.invoiceService.getInvoiceStatistics();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      logger.error("Error fetching invoice statistics", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch invoice statistics",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Search invoices
   */
  searchInvoices = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const invoices = await this.invoiceService.searchInvoices(q);

      res.json({
        success: true,
        data: invoices,
      });
    } catch (error) {
      logger.error("Error searching invoices", { error });
      res.status(500).json({
        success: false,
        message: "Failed to search invoices",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * Get invoice by number
   */
  getInvoiceByNumber = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { invoiceNo } = req.params;
      const userRole = req.user!.role;
      const userId = req.user!.id;

      const invoice = await this.invoiceService.getInvoiceByNumber(invoiceNo);

      if (!invoice) {
        res.status(404).json({
          success: false,
          message: "Invoice not found",
        });
        return;
      }

      // Check if user has permission to access this invoice
      if (userRole === "CUSTOMER" && invoice.customerId !== userId) {
        res.status(403).json({
          success: false,
          message: "Access denied",
        });
        return;
      }

      res.json({
        success: true,
        data: invoice,
      });
    } catch (error) {
      logger.error("Error fetching invoice by number", {
        error,
        invoiceNo: req.params.invoiceNo,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch invoice",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
