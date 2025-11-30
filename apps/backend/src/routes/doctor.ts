import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = Router();
const doctorController = new DoctorController();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * Doctor management routes (Admin/Lab Admin only)
 */

// Create new doctor
router.post(
  "/",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.createDoctor,
);

// Get all doctors with pagination
router.get(
  "/",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  doctorController.getDoctors,
);

// Search doctors
router.get(
  "/search",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  doctorController.searchDoctors,
);

// Assign test request to doctor
router.post(
  "/assign-test-request",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  doctorController.assignTestRequest,
);

/**
 * Doctor profile routes (Doctor's own profile)
 */

// Get current doctor's profile
router.get(
  "/profile",
  requireRole([UserRole.DOCTOR]),
  doctorController.getProfile,
);

// Update current doctor's profile
router.put(
  "/profile",
  requireRole([UserRole.DOCTOR]),
  doctorController.updateProfile,
);

// Get current doctor's workload
router.get(
  "/profile/workload",
  requireRole([UserRole.DOCTOR]),
  doctorController.getMyWorkload,
);

// Get current doctor's test requests
router.get(
  "/profile/test-requests",
  requireRole([UserRole.DOCTOR]),
  doctorController.getMyTestRequests,
);

/**
 * Doctor Approval Workflow Routes
 */

// Get pending approvals for current doctor
router.get(
  "/pending-approvals",
  requireRole([UserRole.DOCTOR]),
  doctorController.getPendingApprovals,
);

// Get approved requests for current doctor
router.get(
  "/approved-requests",
  requireRole([UserRole.DOCTOR]),
  doctorController.getApprovedRequests,
);

// Get specific test request details for approval
router.get(
  "/requests/:id",
  requireRole([UserRole.DOCTOR]),
  doctorController.getRequestDetail,
);

// Approve test request
router.post(
  "/requests/:id/approve",
  requireRole([UserRole.DOCTOR]),
  doctorController.approveRequest,
);

// Reject test request
router.post(
  "/requests/:id/reject",
  requireRole([UserRole.DOCTOR]),
  doctorController.rejectRequest,
);

// Generate PDF report
router.get(
  "/requests/:id/report",
  requireRole([UserRole.DOCTOR]),
  doctorController.generateReport,
);

/**
 * Specific doctor routes (Admin/Lab Admin only)
 */

// Get doctor by ID
router.get(
  "/:doctorId",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.getDoctor,
);

// Update doctor by ID
router.put(
  "/:doctorId",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.updateDoctor,
);

// Delete/Deactivate doctor
router.delete(
  "/:doctorId",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.deleteDoctor,
);

// Get doctor's workload
router.get(
  "/:doctorId/workload",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.getDoctorWorkload,
);

// Get doctor's test requests
router.get(
  "/:doctorId/test-requests",
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.getDoctorTestRequests,
);

export { router as doctorRoutes };
