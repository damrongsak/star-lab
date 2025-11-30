import express from "express";
import userRoutes from "./users";
import customerRoutes from "./customers";
import settingsRoutes from "../settings";
import { AdminController } from "../../controllers/AdminController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { requireRole } from "../../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const adminController = new AdminController();

// Mount users routes at /users
router.use("/users", userRoutes);

// Mount customers routes at /customers
router.use("/customers", customerRoutes);

// Mount settings routes at /settings
router.use("/settings", settingsRoutes);

// Statistics route
router.get(
  "/statistics",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  adminController.getStatistics.bind(adminController),
);

export default router;
