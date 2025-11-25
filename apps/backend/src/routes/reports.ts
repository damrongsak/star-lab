import express from "express";
import { ReportsController } from "../controllers/ReportsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const reportsController = new ReportsController();

// Chart data endpoints
router.get(
    "/chart/request-volume",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    reportsController.getRequestVolumeData.bind(reportsController),
);

router.get(
    "/chart/revenue",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    reportsController.getRevenueData.bind(reportsController),
);

// Report generation endpoints
router.get(
    "/generate/financial",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    reportsController.generateFinancialReport.bind(reportsController),
);

router.get(
    "/generate/customer",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    reportsController.generateCustomerReport.bind(reportsController),
);

router.get(
    "/generate/lab",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    reportsController.generateLabReport.bind(reportsController),
);

router.get(
    "/generate/technician",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    reportsController.generateTechnicianReport.bind(reportsController),
);

export default router;
