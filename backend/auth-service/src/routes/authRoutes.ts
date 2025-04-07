import express from "express";
import AuthController from "../controllers/authController";
// Get profile controller
import { getUserProfile } from "../controllers/profile";
import ForgetPasswordController from "../controllers/forgetPassword";
// Middleware
import { authenticateToken } from "../middlewares/authMiddleware";
import { helpCheck } from "../controllers/helpcheck";

const router = express.Router();

router.get("/helpcheck", helpCheck);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/logout", AuthController.logout);
//get user profile
router.get("/profile", authenticateToken, getUserProfile);
// Forget password
router.post("/forget-password", ForgetPasswordController.forgetPassword);
router.post(
  "/reset-password",
  authenticateToken,
  ForgetPasswordController.resetPassword,
);

export default router;
