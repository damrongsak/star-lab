
/**
 * @fileoverview Defines user-related routes, such as fetching the user profile.
 */

import { Router } from 'express';
import { userController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/profile', authMiddleware, userController.getProfile);

export default router;
