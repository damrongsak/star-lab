import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Access denied. No token provided." });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: UserRole;
    };

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
