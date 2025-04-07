import { Request, Response } from "express";
import UserModel from "../models/userModel";
import logger from "../utils/logger";

class ForgetPasswordController {
  static async forgetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      // TODO: Here you would implement the logic to send a password reset email
      // This is a placeholder for that logic
      logger.info(`Password reset requested for: ${email}`);
      res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error: any) {
      logger.error("Forget password error:", error);
      res
        .status(500)
        .json({ error: "Forget password failed", details: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, oldPassword, newPassword } = req.body;

      // Validate input
      if (!email || !oldPassword || !newPassword) {
        res.status(400).json({ error: "Missing required fields" });
      }

      if (oldPassword === newPassword) {
        res.status(400).json({
          error: "New password cannot be the same as the old password",
        });
      }

      // Fetch user from database (replace with actual DB logic)
      const user = await UserModel.findByEmail(email); // Assuming UserModel is imported
      if (!user) {
        res.status(404).json({ error: "User not found" });
      }

      let hashOldPassword = await UserModel.hashPassword(oldPassword); // Hash old password
      // Verify old password (replace with actual password verification logic)
      const isPasswordValid = await UserModel.verifyPassword(
        hashOldPassword,
        user?.password || "",
      ); // Assuming verifyPassword is a method on the user model
      if (!isPasswordValid) {
        res.status(401).json({ error: "Old password is incorrect" });
      }

      // Update password in database (replace with actual DB update logic)
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      let hashedNewPassword = await UserModel.hashPassword(newPassword);
      await UserModel.changePassword(user.id, hashedNewPassword);

      logger.info(`Password successfully updated for user: ${user.id}`);
      res.status(200).json({ message: "Password change successful" });
    } catch (error: any) {
      logger.error("Change password error:", error);
      res
        .status(500)
        .json({ error: "Change password failed", details: error.message });
    }
  }
}

export default ForgetPasswordController;
