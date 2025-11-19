import { Router } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";
import { FileService } from "../services/FileService";
import path from "path";

const router = Router();
const invoiceController = new InvoiceController();
const fileService = new FileService();

// Configure multer for payment slip uploads
const paymentSlipUpload = fileService.getMulterConfig({
  destinationPath: path.join(process.cwd(), "uploads", "payment-slips"),
  allowedMimeTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
  ],
  maxSize: 10 * 1024 * 1024, // 10MB
});

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Invoice routes
 */

// Create invoice from test request
router.post(
  "/test-request/:testRequestId",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  invoiceController.createInvoice,
);

// Get all invoices (with pagination and filtering)
router.get(
  "/",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.CUSTOMER]),
  invoiceController.getInvoices,
);

// Get invoice statistics (admin only)
router.get(
  "/statistics",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  invoiceController.getStatistics,
);

// Search invoices
router.get(
  "/search",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  invoiceController.searchInvoices,
);

// Get invoice by invoice number
router.get(
  "/number/:invoiceNo",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.CUSTOMER]),
  invoiceController.getInvoiceByNumber,
);

// Get invoice by ID
router.get(
  "/:invoiceId",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.CUSTOMER]),
  invoiceController.getInvoice,
);

// Update invoice details
router.put(
  "/:invoiceId",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  invoiceController.updateInvoice,
);

// Mark invoice as paid (with payment slip upload)
router.patch(
  "/:invoiceId/mark-paid",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.CUSTOMER]),
  paymentSlipUpload.single("paymentSlip"),
  invoiceController.markAsPaid,
);

export { router as invoiceRoutes };
