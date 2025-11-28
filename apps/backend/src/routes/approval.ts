import { Router } from "express";
import { ApprovalController } from "../controllers/ApprovalController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();
const approvalController = new ApprovalController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Approval workflow routes
 * Accessible by APPROVAL and ADMIN roles
 */

// Get approval dashboard statistics
router.get(
  "/dashboard",
  requireRole([UserRole.APPROVAL, UserRole.ADMIN]),
  approvalController.getDashboard,
);

// Get pending payment approvals
router.get(
  "/pending-payment",
  requireRole([UserRole.APPROVAL, UserRole.ADMIN]),
  approvalController.getPendingPayments,
);

// Get all invoices (for approval history)
router.get(
  "/invoices",
  requireRole([UserRole.APPROVAL, UserRole.ADMIN]),
  approvalController.getInvoices,
);

// Approve a payment
router.post(
  "/invoices/:id/approve",
  requireRole([UserRole.APPROVAL, UserRole.ADMIN]),
  approvalController.approvePayment,
);

// Reject a payment
router.post(
  "/invoices/:id/reject",
  requireRole([UserRole.APPROVAL, UserRole.ADMIN]),
  approvalController.rejectPayment,
);

export { router as approvalRoutes };
