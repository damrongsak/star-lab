import express from "express";
import { AdminUserController } from "../../controllers/AdminUserController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { requireRole } from "../../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const controller = new AdminUserController();

// All routes under this router require admin or lab admin access
router.get(
  "/",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.listUsers.bind(controller),
);

router.get(
  "/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.getUserById.bind(controller),
);

router.post(
  "/",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.createUser.bind(controller),
);

router.put(
  "/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.updateUser.bind(controller),
);

router.delete(
  "/:id",
  authMiddleware,
  requireRole([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.deleteUser.bind(controller),
);

export default router;
