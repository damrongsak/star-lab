import express from "express";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();
const authController = new AuthController();

// Public routes
router.post("/register", authController.register.bind(authController));
router.post("/login", authController.login.bind(authController));
router.get(
  "/verify-email/:token",
  authController.verifyEmail.bind(authController),
);

// Protected routes
router.get(
  "/profile",
  authMiddleware,
  authController.profile.bind(authController),
);
router.post(
  "/change-password",
  authMiddleware,
  authController.changePassword.bind(authController),
);

export default router;
