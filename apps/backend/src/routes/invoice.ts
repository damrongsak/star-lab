import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();
const invoiceController = new InvoiceController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Invoice routes
 */

// Create invoice from test request
router.post(
  "/test-request/:testRequestId",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  invoiceController.createInvoice,
);

// Get all invoices (with pagination and filtering)
router.get("/", invoiceController.getInvoices);

// Get invoice statistics (admin only)
router.get(
  "/statistics",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  invoiceController.getStatistics,
);

// Search invoices
router.get("/search", invoiceController.searchInvoices);

// Get invoice by invoice number
router.get("/number/:invoiceNo", invoiceController.getInvoiceByNumber);

// Get invoice by ID
router.get("/:invoiceId", invoiceController.getInvoice);

// Update invoice details
router.put(
  "/:invoiceId",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  invoiceController.updateInvoice,
);

// Mark invoice as paid
router.patch(
  "/:invoiceId/mark-paid",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.CUSTOMER]),
  invoiceController.markAsPaid,
);

export { router as invoiceRoutes };
