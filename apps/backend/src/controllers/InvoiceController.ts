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
   * @swagger
   * /api/v1/invoices/test-request/{testRequestId}:
   *   post:
   *     summary: Create invoice from test request
   *     description: Generate a new invoice based on a completed test request. Only accessible by admin and lab admin users.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: testRequestId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Test request ID to create invoice from
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       201:
   *         description: Invoice created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Invoice created successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Invoice'
   *             examples:
   *               created_invoice:
   *                 summary: Created Invoice Example
   *                 value:
   *                   success: true
   *                   message: "Invoice created successfully"
   *                   data:
   *                     id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                     invoiceNo: "INV-2025-001234"
   *                     testRequestId: "123e4567-e89b-12d3-a456-426614174000"
   *                     customerId: "cust-123e4567-e89b-12d3-a456-426614174000"
   *                     invoiceDate: "2025-06-28"
   *                     subTotal: 1000.0
   *                     taxRate: 0.07
   *                     taxAmount: 70.0
   *                     netTotal: 1070.0
   *                     paymentStatus: "PENDING"
   *       400:
   *         description: Invalid test request or invoice cannot be created
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Test request not found or already invoiced"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices/{invoiceId}:
   *   get:
   *     summary: Get invoice by ID
   *     description: Retrieve detailed information about a specific invoice. Customers can only access their own invoices, while admins can access any invoice.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Invoice's unique identifier
   *         example: "inv-550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Invoice retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Invoice'
   *             examples:
   *               invoice_details:
   *                 summary: Invoice Details Example
   *                 value:
   *                   success: true
   *                   data:
   *                     id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                     invoiceNo: "INV-2025-001234"
   *                     testRequestId: "123e4567-e89b-12d3-a456-426614174000"
   *                     customerId: "cust-123e4567-e89b-12d3-a456-426614174000"
   *                     invoiceDate: "2025-06-28"
   *                     dueDate: "2025-07-28"
   *                     subTotal: 1000.0
   *                     taxRate: 0.07
   *                     taxAmount: 70.0
   *                     netTotal: 1070.0
   *                     paymentStatus: "PENDING"
   *                     customer:
   *                       companyNameEn: "StarLab Company Ltd."
   *                       operatorFirstName: "John"
   *                       operatorLastName: "Doe"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         description: Access denied - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Access denied"
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invoice not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices:
   *   get:
   *     summary: Get invoices with pagination
   *     description: Retrieve a paginated list of invoices. Customers see only their own invoices, while admins can see all invoices with optional status filtering.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of invoices per page
   *         example: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, PAID, OVERDUE, CANCELLED, REFUNDED]
   *         description: Filter by payment status
   *         example: "PENDING"
   *     responses:
   *       200:
   *         description: Invoices retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Invoice'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 10
   *                     total:
   *                       type: integer
   *                       example: 45
   *                     totalPages:
   *                       type: integer
   *                       example: 5
   *             examples:
   *               invoices_list:
   *                 summary: Invoices List Example
   *                 value:
   *                   success: true
   *                   data:
   *                     - id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                       invoiceNo: "INV-2025-001234"
   *                       invoiceDate: "2025-06-28"
   *                       netTotal: 1070.0
   *                       paymentStatus: "PENDING"
   *                       customer:
   *                         companyNameEn: "StarLab Company Ltd."
   *                     - id: "inv-660f9511-f30c-52e5-b827-557766551111"
   *                       invoiceNo: "INV-2025-001235"
   *                       invoiceDate: "2025-06-27"
   *                       netTotal: 856.0
   *                       paymentStatus: "PAID"
   *                       customer:
   *                         companyNameEn: "TechLab Solutions Inc."
   *                   pagination:
   *                     page: 1
   *                     limit: 10
   *                     total: 45
   *                     totalPages: 5
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices/{invoiceId}/mark-paid:
   *   put:
   *     summary: Mark invoice as paid
   *     description: Update an invoice's payment status to paid and optionally attach payment slip URL. Accessible by admin, lab admin, and customers (for their own invoices).
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Invoice's unique identifier
   *         example: "inv-550e8400-e29b-41d4-a716-446655440000"
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MarkAsPaidRequest'
   *           examples:
   *             mark_paid:
   *               summary: Mark as Paid Example
   *               value:
   *                 paymentSlipUrl: "https://storage.example.com/payment-slips/payment-123.pdf"
   *     responses:
   *       200:
   *         description: Invoice marked as paid successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Invoice marked as paid successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Invoice'
   *             examples:
   *               paid_invoice:
   *                 summary: Paid Invoice Example
   *                 value:
   *                   success: true
   *                   message: "Invoice marked as paid successfully"
   *                   data:
   *                     id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                     invoiceNo: "INV-2025-001234"
   *                     paymentStatus: "PAID"
   *                     paymentDate: "2025-06-28T14:30:00Z"
   *                     paymentSlipUrl: "https://storage.example.com/payment-slips/payment-123.pdf"
   *       400:
   *         description: Invalid request or invoice cannot be marked as paid
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invoice is already paid or cancelled"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invoice not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices/{invoiceId}:
   *   put:
   *     summary: Update invoice details
   *     description: Update invoice information such as due date, notes, or payment status. Only accessible by admin and lab admin users.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invoiceId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Invoice's unique identifier
   *         example: "inv-550e8400-e29b-41d4-a716-446655440000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateInvoiceRequest'
   *           examples:
   *             update_invoice:
   *               summary: Update Invoice Example
   *               value:
   *                 dueDate: "2025-07-28"
   *                 notes: "Extended payment terms approved"
   *                 paymentStatus: "PENDING"
   *     responses:
   *       200:
   *         description: Invoice updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Invoice updated successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Invoice'
   *             examples:
   *               updated_invoice:
   *                 summary: Updated Invoice Example
   *                 value:
   *                   success: true
   *                   message: "Invoice updated successfully"
   *                   data:
   *                     id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                     invoiceNo: "INV-2025-001234"
   *                     dueDate: "2025-07-28"
   *                     notes: "Extended payment terms approved"
   *                     paymentStatus: "PENDING"
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid update data"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invoice not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices/statistics:
   *   get:
   *     summary: Get invoice statistics
   *     description: Retrieve comprehensive invoice statistics including revenue, payment status breakdown, and monthly trends. Only accessible by admin and lab admin users.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Invoice statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/InvoiceStatistics'
   *             examples:
   *               invoice_stats:
   *                 summary: Invoice Statistics Example
   *                 value:
   *                   success: true
   *                   data:
   *                     totalInvoices: 150
   *                     totalRevenue: 125000.5
   *                     paidInvoices: 120
   *                     pendingInvoices: 25
   *                     overdueInvoices: 5
   *                     averageInvoiceValue: 833.33
   *                     monthlyRevenue:
   *                       - month: "2025-06"
   *                         revenue: 15000.0
   *                         count: 18
   *                       - month: "2025-05"
   *                         revenue: 12500.0
   *                         count: 15
   *                       - month: "2025-04"
   *                         revenue: 14200.0
   *                         count: 17
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices/search:
   *   get:
   *     summary: Search invoices
   *     description: Search invoices by invoice number, customer name, or company name. Accessible by admin, lab admin, and technician users.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *           minLength: 1
   *         description: Search query (invoice number, customer name, or company name)
   *         example: "INV-2025"
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Invoice'
   *             examples:
   *               search_results:
   *                 summary: Search Results Example
   *                 value:
   *                   success: true
   *                   data:
   *                     - id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                       invoiceNo: "INV-2025-001234"
   *                       invoiceDate: "2025-06-28"
   *                       netTotal: 1070.0
   *                       paymentStatus: "PENDING"
   *                       customer:
   *                         companyNameEn: "StarLab Company Ltd."
   *                         operatorFirstName: "John"
   *                         operatorLastName: "Doe"
   *                     - id: "inv-660f9511-f30c-52e5-b827-557766551111"
   *                       invoiceNo: "INV-2025-001235"
   *                       invoiceDate: "2025-06-27"
   *                       netTotal: 856.0
   *                       paymentStatus: "PAID"
   *                       customer:
   *                         companyNameEn: "TechLab Solutions Inc."
   *                         operatorFirstName: "Jane"
   *                         operatorLastName: "Smith"
   *       400:
   *         description: Invalid search query
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Search query is required"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
   * @swagger
   * /api/v1/invoices/by-number/{invoiceNo}:
   *   get:
   *     summary: Get invoice by invoice number
   *     description: Retrieve invoice details using the invoice number instead of ID. Customers can only access their own invoices, while admins can access any invoice.
   *     tags: [Invoices]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: invoiceNo
   *         required: true
   *         schema:
   *           type: string
   *         description: Invoice number
   *         example: "INV-2025-001234"
   *     responses:
   *       200:
   *         description: Invoice retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Invoice'
   *             examples:
   *               invoice_by_number:
   *                 summary: Invoice by Number Example
   *                 value:
   *                   success: true
   *                   data:
   *                     id: "inv-550e8400-e29b-41d4-a716-446655440000"
   *                     invoiceNo: "INV-2025-001234"
   *                     testRequestId: "123e4567-e89b-12d3-a456-426614174000"
   *                     customerId: "cust-123e4567-e89b-12d3-a456-426614174000"
   *                     invoiceDate: "2025-06-28"
   *                     subTotal: 1000.0
   *                     taxRate: 0.07
   *                     taxAmount: 70.0
   *                     netTotal: 1070.0
   *                     paymentStatus: "PENDING"
   *                     customer:
   *                       companyNameEn: "StarLab Company Ltd."
   *                       operatorFirstName: "John"
   *                       operatorLastName: "Doe"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         description: Access denied - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Access denied"
   *       404:
   *         description: Invoice not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invoice not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
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
