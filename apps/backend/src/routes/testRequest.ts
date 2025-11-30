import express from "express";
import { TestRequestController } from "../controllers/TestRequestController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const testRequestController = new TestRequestController();

// Customer Routes
router.post(
  "/",
  authMiddleware,
  requireRole([UserRole.CUSTOMER]),
  testRequestController.createTestRequest.bind(testRequestController),
);

router.get(
  "/my-requests",
  authMiddleware,
  requireRole([UserRole.CUSTOMER]),
  testRequestController.getMyTestRequests.bind(testRequestController),
);

router.get(
  "/my-requests/search",
  authMiddleware,
  requireRole([UserRole.CUSTOMER]),
  testRequestController.searchMyTestRequests.bind(testRequestController),
);

// Admin/Lab Admin Routes
router.get(
  "/",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.getAllTestRequests.bind(testRequestController),
);

router.get(
  "/search",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.searchTestRequests.bind(testRequestController),
);

router.get(
  "/statistics",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.getTestRequestStatistics.bind(testRequestController),
);

// Shared Routes (Customer can view their own, admins can view all)
router.get(
  "/:id",
  authMiddleware,
  testRequestController.getTestRequestById.bind(testRequestController),
);

router.get(
  "/:id/status-history",
  authMiddleware,
  requireRole([
    UserRole.CUSTOMER,
    UserRole.ADMIN,
    UserRole.LAB_ADMIN,
    UserRole.DOCTOR,
  ]),
  testRequestController.getStatusHistory.bind(testRequestController),
);

router.put(
  "/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.updateTestRequest.bind(testRequestController),
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([UserRole.CUSTOMER]),
  testRequestController.deleteTestRequest.bind(testRequestController),
);

// Sample Management Routes
router.put(
  "/samples/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  testRequestController.updateTestRequestSample.bind(testRequestController),
);

router.post(
  "/samples/:id/assign-technician",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.assignTechnicianToSample.bind(testRequestController),
);

export default router;
