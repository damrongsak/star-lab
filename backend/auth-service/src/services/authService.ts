import UserModel from "../models/userModel";
import bcrypt from "bcrypt";
import jwtUtils from "../utils/jwtUtils";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import logger from "../utils/logger";

const saltRounds = 10; // For bcrypt hashing

class AuthService {
  static async registerUser(
    username: string,
    email: string,
    password: string,
    first_name?: string,
    last_name?: string,
  ) {
    // Basic input validation (you can add more robust validation)
    if (!username || !email || !password) {
      throw new Error("All fields are required for registration.");
    }
    if (password.length < 6) {
      // Example password strength check
      throw new Error("Password must be at least 6 characters long.");
    }

    const createdUser = await UserModel.createUser(
      username,
      email,
      password,
      first_name,
      last_name,
    );
    return createdUser;
  }

  static async loginUser(
    email: string,
    password: string,
    stayLoggedIn: boolean,
  ) {
    if (!email || !password) {
      throw new Error("Email and password are required for login.");
    }

    const user = await UserModel.findByEmail(email);
    if (!user || !user.password) {
      throw new Error("Invalid credentials."); // Avoid leaking info
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials.");
    }

    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    }; // Minimal user info in JWT

    const tokenOptions: jwt.SignOptions = {
      expiresIn: stayLoggedIn ? "30d" : "1h", // Adjust expiration
    };

    const token = jwtUtils.generateToken(payload, tokenOptions);

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }; // Return token and sanitized user info
  }

  static async verifyToken(token: string) {
    // Example token verification (middleware would use this)
    try {
      const decoded = jwtUtils.verifyToken(token) as JwtPayload; // Type assertion here

      if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
        // Add checks for decoded being a valid payload
        throw new Error("Invalid token payload format.");
      }

      if (typeof decoded.userId !== "number") {
        // Ensure userId is a number as expected
        throw new Error("Invalid user ID in token.");
      }

      const userId = decoded.userId; // Now TypeScript knows decoded.userId is likely a number
      const user = await UserModel.findById(userId); // Use userId directly

      if (!user) {
        throw new Error("Invalid user associated with token.");
      }
      return user; // Return user object if token is valid and user exists
    } catch {
      // In catch block, error is already handled by jwtUtils.verifyToken or our checks
      throw new Error("Invalid token."); // Token verification failed
    }
  }
}

export default AuthService;
