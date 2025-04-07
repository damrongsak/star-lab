import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import process from "process";
import { User as UserPayload } from "../models/userModel"; // Import the User model

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): any => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401); // No token
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      return res.sendStatus(403); // Invalid token
    }
    req.user = user as UserPayload;
    next();
  });
};
