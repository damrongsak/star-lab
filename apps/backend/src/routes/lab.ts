import express from "express";
import { LabController } from "../controllers/LabController";
import { TestRequestController } from "../controllers/TestRequestController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const labController = new LabController();
const testRequestController = new TestRequestController();

// Lab Test Request Routes (Shared with Lab Admin/Technician)
router.get(
  "/test-requests",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  testRequestController.getAllTestRequests.bind(testRequestController),
);

router.get(
  "/test-requests/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  testRequestController.getTestRequestById.bind(testRequestController),
);

// Sample Routes
router.get(
  "/samples",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.getAllSamples.bind(labController),
);

// Lab Test Routes

// For technicians to view their assigned tests
router.get(
  "/my-tests",
  authMiddleware,
  requireRole([UserRole.TECHNICIAN]),
  labController.getMyLabTests.bind(labController),
);

// For admins and lab admins to view all tests
router.get(
  "/tests",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.getAllLabTests.bind(labController),
);

// Create new lab test (lab admin/admin only)
router.post(
  "/tests",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.createLabTest.bind(labController),
);

// Get specific lab test by ID
router.get(
  "/tests/:id",
  authMiddleware,
  requireRole([
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
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.updateLabTest.bind(labController),
);

// Complete lab test (technician/admin)
router.post(
  "/tests/:id/complete",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.completeLabTest.bind(labController),
);

// Lab Result Routes

// Create lab result (technician/admin)
router.post(
  "/results",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.createLabResult.bind(labController),
);

// Update lab result (technician/admin)
router.put(
  "/results/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.updateLabResult.bind(labController),
);

// Delete lab result (admin only)
router.delete(
  "/results/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.deleteLabResult.bind(labController),
);

// Statistics and Search Routes

// Get lab statistics (admin/lab admin)
router.get(
  "/statistics",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.getLabStatistics.bind(labController),
);

// Search lab tests
router.get(
  "/search",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.searchLabTests.bind(labController),
);

// Get available technicians (admin/lab admin)
router.get(
  "/technicians",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  labController.getAvailableTechnicians.bind(labController),
);

// Acknowledge samples (lab admin/technician)
router.post(
  "/acknowledge/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  labController.acknowledgeRequest.bind(labController),
);

export default router;
