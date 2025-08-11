
/**
 * @fileoverview Defines authentication routes for user registration and login.
 */

import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
