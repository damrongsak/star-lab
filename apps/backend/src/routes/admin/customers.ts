import express from "express";
import { AdminCustomerController } from "../../controllers/AdminCustomerController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { requireRole } from "../../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const controller = new AdminCustomerController();

// All routes require admin or lab admin access
router.get(
    "/",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    controller.listCustomers.bind(controller),
);

router.get(
    "/:id",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    controller.getCustomerById.bind(controller),
);

router.patch(
    "/:id/status",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    controller.updateCustomerStatus.bind(controller),
);

router.put(
    "/:id",
    authMiddleware,
    requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
    controller.updateCustomer.bind(controller),
);

export default router;
