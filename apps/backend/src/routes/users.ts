import express from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const userController = new UserController();

/**
 * GET /api/v1/users/profile
 * Get current user's profile (works for all roles)
 * Returns user data with user_profile and role-specific information
 */
router.get(
    '/profile',
    authMiddleware,
    userController.getProfile.bind(userController)
);

/**
 * PUT /api/v1/users/profile
 * Update current user's profile
 */
router.put(
    '/profile',
    authMiddleware,
    userController.updateProfile.bind(userController)
);

export default router;
