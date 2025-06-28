import { Router } from "express";
import { DoctorController } from "../controllers/DoctorController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
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
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.createDoctor,
);

// Get all doctors with pagination
router.get(
  "/",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  doctorController.getDoctors,
);

// Search doctors
router.get(
  "/search",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  doctorController.searchDoctors,
);

// Assign test request to doctor
router.post(
  "/assign-test-request",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  doctorController.assignTestRequest,
);

/**
 * Doctor profile routes (Doctor's own profile)
 */

// Get current doctor's profile
router.get(
  "/profile",
  roleMiddleware([UserRole.DOCTOR]),
  doctorController.getProfile,
);

// Update current doctor's profile
router.put(
  "/profile",
  roleMiddleware([UserRole.DOCTOR]),
  doctorController.updateProfile,
);

// Get current doctor's workload
router.get(
  "/profile/workload",
  roleMiddleware([UserRole.DOCTOR]),
  doctorController.getMyWorkload,
);

// Get current doctor's test requests
router.get(
  "/profile/test-requests",
  roleMiddleware([UserRole.DOCTOR]),
  doctorController.getMyTestRequests,
);

/**
 * Specific doctor routes (Admin/Lab Admin only)
 */

// Get doctor by ID
router.get(
  "/:doctorId",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.getDoctor,
);

// Update doctor by ID
router.put(
  "/:doctorId",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.updateDoctor,
);

// Delete/Deactivate doctor
router.delete(
  "/:doctorId",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.deleteDoctor,
);

// Get doctor's workload
router.get(
  "/:doctorId/workload",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.getDoctorWorkload,
);

// Get doctor's test requests
router.get(
  "/:doctorId/test-requests",
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  doctorController.getDoctorTestRequests,
);

export { router as doctorRoutes };
