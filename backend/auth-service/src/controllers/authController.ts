import AuthService from "../services/authService";
import logger from "../utils/logger";
import { Request, Response } from "express"; // Import Request and Response types from Express

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    // Explicit types for req, res, and return Promise<void>
    try {
      const { username, email, password } = req.body; // Types are inferred from req.body (assuming body-parser middleware)
      const newUser = await AuthService.registerUser(username, email, password);
      logger.info(`User registered: ${newUser.username} (ID: ${newUser.id})`);
      res
        .status(201)
        .json({ message: "User registered successfully", user: newUser });
    } catch (error: any) {
      // Type for error (you can create a more specific error type if needed)
      logger.error("Registration error:", error);
      if (
        error.message === "Username or email already exists." ||
        error.message === "All fields are required for registration." ||
        error.message === "Password must be at least 6 characters long."
      ) {
        res.status(400).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Registration failed", details: error.message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`Login attempt for user: ${req.body.email}`);
      const { email, password, stayLoggedIn } = req.body;
      const { token, user } = await AuthService.loginUser(
        email,
        password,
        stayLoggedIn,
      );
      logger.info(`User logged in: ${user.username} (ID: ${user.id})`);
      res
        .status(200)
        .json({ message: "Login successful", token: token, user: user });
    } catch (error: any) {
      logger.error("Login error:", error);
      if (
        error.message === "Email and password are required for login." ||
        error.message === "Invalid credentials."
      ) {
        res.status(401).json({ error: error.message });
      }
      res.status(500).json({ error: "Login failed", details: error.message });
    }
  }

  // Logout
  static async logout(req: Request, res: Response): Promise<void> {
    try {
      // Perform any logout actions (e.g., token blacklist)
      logger.info("User logged out");
      res.status(200).json({ message: "Logout successful" });
    } catch (error: any) {
      logger.error("Logout error:", error);
      res.status(500).json({ error: "Logout failed", details: error.message });
    }
  }
}

export default AuthController;
