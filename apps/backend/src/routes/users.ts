import express from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireOwnerOrAdmin } from "../middleware/rbacMiddleware";

const router = express.Router();
const userController = new UserController();

/**
 * GET /api/v1/users/profile
 * Get current user's profile (works for all roles)
 * Returns user data with user_profile and role-specific information
 */
router.get(
  "/profile",
  authMiddleware,
  userController.getProfile.bind(userController),
);

/**
 * PUT /api/v1/users/profile
 * Update current user's profile
 */
router.put(
  "/profile",
  authMiddleware,
  userController.updateProfile.bind(userController),
);

/**
 * GET /api/v1/users/:id
 * Get user by ID (protected: owner or admin only)
 */
router.get(
  "/:id",
  authMiddleware,
  requireOwnerOrAdmin("id"),
  userController.getUserById.bind(userController),
);

/**
 * PUT /api/v1/users/:id
 * Update user by ID (protected: owner or admin only)
 */
router.put(
  "/:id",
  authMiddleware,
  requireOwnerOrAdmin("id"),
  userController.updateUserById.bind(userController),
);

export default router;
