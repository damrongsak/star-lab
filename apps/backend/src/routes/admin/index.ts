import express from "express";
import userRoutes from "./users";
import { AdminController } from "../../controllers/AdminController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { requireRole } from "../../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const adminController = new AdminController();

// Mount users routes at /users
router.use("/users", userRoutes);

// Statistics route
router.get(
  "/statistics",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  adminController.getStatistics.bind(adminController)
);

export default router;
