import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import logger from "../utils/logger";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// Type augmentation: add `user` to Express Request
declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string; // mirrors userId for convenience across controllers
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

function extractBearerToken(req: Request): string | null {
  const header = req.header("Authorization") || req.header("authorization");
  if (!header) return null;
  const parts = header.split(" ");
  if (parts.length === 2 && /^Bearer$/i.test(parts[0])) {
    return parts[1].trim();
  }
  // Allow raw token (non-Bearer) as a fallback
  return header.trim();
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      res.status(401).json({ message: "Unauthorized - missing token" });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
      role: string;
      iat?: number;
      exp?: number;
    };

    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role as UserRole,
    };

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      logger.warn("JWT token expired", { error: err.message });
      res.status(401).json({ message: "Unauthorized - token expired" });
      return;
    }
    if (err instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid JWT token", { error: err.message });
      res.status(401).json({ message: "Unauthorized - invalid token" });
      return;
    }
    logger.error("Authentication error", { error: err });
    res.status(500).json({ message: "Authentication failed" });
  }
}

export default authMiddleware;
