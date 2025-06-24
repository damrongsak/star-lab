import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();
const authRoutes = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use env var in production

// Register
authRoutes.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      res.status(400).json({ message: "Invalid email format" });
      return;
    }

    if (password.length < 8) {
      res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
      return;
    }

    if (!Object.values(UserRole).includes(role)) {
      res.status(400).json({ message: "Invalid role specified" });
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: "Email already registered" });
      return;
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role,
      },
    });
    res.status(201).json({
      message: "User registered",
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    logger.error("Registration failed:", err);
    res.status(500).json({ message: "Registration failed" });
    return;
  }
});

// Login
authRoutes.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // show data in body
    logger.info("Login attempt", { email, password });
    if (!email || !password) {
      res.status(400).json({ message: "Missing email or password" });
      return;
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (err) {
    logger.error("Login failed:", err);
    res.status(500).json({ message: "Login failed" });
    return;
  }
});

// Logout (stateless, just a placeholder)
authRoutes.post("/logout", (req: Request, res: Response) => {
  res.json({ message: "Logged out (client should delete token)" });
});

export default authRoutes;
