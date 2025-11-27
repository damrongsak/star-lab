import express from "express";
import { SettingsController } from "../controllers/SettingsController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const controller = new SettingsController();

// Only Admins can manage settings
router.get(
  "/",
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  controller.getSettings.bind(controller),
);

router.put(
  "/",
  authMiddleware,
  requireRole([UserRole.ADMIN]),
  controller.updateSettings.bind(controller),
);

export default router;
