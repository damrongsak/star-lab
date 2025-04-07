// Get user profile
import { Request, Response } from "express";

export const getUserProfile = (req: Request, res: Response): any => {
  // Assuming you have user data in the request (e.g., from a middleware)
  const user = req.user; // Example: user data from authentication middleware

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Return the user profile
  res.json({ user });
};
