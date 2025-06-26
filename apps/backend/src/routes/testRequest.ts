import express from "express";
import { TestRequestController } from "../controllers/TestRequestController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const testRequestController = new TestRequestController();

// Customer Routes
router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.CUSTOMER]),
  testRequestController.createTestRequest.bind(testRequestController),
);

router.get(
  "/my-requests",
  authMiddleware,
  roleMiddleware([UserRole.CUSTOMER]),
  testRequestController.getMyTestRequests.bind(testRequestController),
);

// Admin/Lab Admin Routes
router.get(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.getAllTestRequests.bind(testRequestController),
);

router.get(
  "/search",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.searchTestRequests.bind(testRequestController),
);

router.get(
  "/statistics",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.getTestRequestStatistics.bind(testRequestController),
);

// Shared Routes (Customer can view their own, admins can view all)
router.get(
  "/:id",
  authMiddleware,
  testRequestController.getTestRequestById.bind(testRequestController),
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.updateTestRequest.bind(testRequestController),
);

// Sample Management Routes
router.put(
  "/samples/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN, UserRole.TECHNICIAN]),
  testRequestController.updateTestRequestSample.bind(testRequestController),
);

router.post(
  "/samples/:id/assign-technician",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  testRequestController.assignTechnicianToSample.bind(testRequestController),
);

export default router;
