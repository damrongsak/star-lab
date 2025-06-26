import express from "express";
import { LabController } from "../controllers/LabController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const labController = new LabController();

// Lab Test Routes

// For technicians to view their assigned tests
router.get(
  "/my-tests",
  authMiddleware,
  roleMiddleware([UserRole.TECHNICIAN]),
  labController.getMyLabTests.bind(labController),
);

// For admins and lab admins to view all tests
router.get(
  "/tests",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.getAllLabTests.bind(labController),
);

// Create new lab test (lab admin/admin only)
router.post(
  "/tests",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.createLabTest.bind(labController),
);

// Get specific lab test by ID
router.get(
  "/tests/:id",
  authMiddleware,
  roleMiddleware([
    UserRole.ADMIN,
    UserRole.LAB_ADMIN,
    UserRole.TECHNICIAN,
    UserRole.DOCTOR,
  ]),
  labController.getLabTestById.bind(labController),
);

// Update lab test
router.put(
  "/tests/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.updateLabTest.bind(labController),
);

// Complete lab test (technician/admin)
router.post(
  "/tests/:id/complete",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.completeLabTest.bind(labController),
);

// Lab Result Routes

// Create lab result (technician/admin)
router.post(
  "/results",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.createLabResult.bind(labController),
);

// Update lab result (technician/admin)
router.put(
  "/results/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.updateLabResult.bind(labController),
);

// Delete lab result (admin only)
router.delete(
  "/results/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.deleteLabResult.bind(labController),
);

// Statistics and Search Routes

// Get lab statistics (admin/lab admin)
router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.getLabStatistics.bind(labController),
);

// Search lab tests
router.get(
  "/search",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.searchLabTests.bind(labController),
);

// Get available technicians (admin/lab admin)
router.get(
  "/technicians",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.getAvailableTechnicians.bind(labController),
);

export default router;
