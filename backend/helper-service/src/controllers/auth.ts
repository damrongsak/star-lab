import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "process";
import logger from "../utils/logger";
import UserModel from "../models/userModel";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "3600"; // Default to 3600 seconds (1 hour)

export const generateToken = (req: Request, res: Response): any => {
  try {
    // In a real application, you would typically authenticate a user here
    const payload = {
      userId: "99", // Example payload
      username: "customer99",
      email: "customer99@example.com",
      role: "customer",
      // Add other relevant information
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: parseInt(JWT_EXPIRES_IN, 10),
    }); // Token expires in 1 hour

    res.json({ token });
  } catch (error) {
    logger.error("Error generating token:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
};

/**
 * Update password by email
 */
export const updatePasswordByEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // In a real application, you would typically authenticate a user here
    const { email, password } = req.body;

    // Update password logic here
    const isUpdated = await UserModel.updatePasswordByEmailWithTransaction(
      email,
      password
    );
    if (isUpdated) {
      res.json({ message: "Password updated successfully" });
    } else {
      logger.info(JSON.stringify(req.body));
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    logger.error("Error updating password:", error);
    res.status(500).json({ error: "Failed to update password" });
  }
};
