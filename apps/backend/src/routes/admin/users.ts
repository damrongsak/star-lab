import express from "express";
import { AdminUserController } from "../../controllers/AdminUserController";
import { authMiddleware } from "../../middleware/authMiddleware";
import { roleMiddleware } from "../../middlewares/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const controller = new AdminUserController();

// All routes under this router require admin or lab admin access
router.get(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.listUsers.bind(controller),
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.getUserById.bind(controller),
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.createUser.bind(controller),
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.updateUser.bind(controller),
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware([UserRole.ADMIN, UserRole.LAB_ADMIN]),
  controller.deleteUser.bind(controller),
);

export default router;

