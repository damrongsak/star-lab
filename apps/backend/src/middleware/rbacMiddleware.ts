import { Request, Response, NextFunction } from "express";
import type { UserRole } from "@star-lab/shared";

// Shape of the JWT payload set on req.user by auth middleware
interface JwtUserPayload {
  userId: string;
  email: string;
  role: UserRole;
}

interface RequestWithUser extends Request {
  user?: JwtUserPayload;
}

/**
 * RBAC middleware: require that the authenticated user has one of the allowed roles.
 * Usage: router.get("/admin", authMiddleware, requireRole(["ADMIN"]), handler)
 */
export function requireRole(allowedRoles: ReadonlyArray<UserRole | string>) {
  return (req: RequestWithUser, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "Authentication required." });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res
        .status(403)
        .json({ message: "Access denied. Insufficient permissions." });
      return;
    }

    next();
  };
}

/** Convenience helpers for common roles */
export const requireAdmin = () => requireRole(["ADMIN"]);
export const requireTechnician = () => requireRole(["TECHNICIAN"]);
export const requireDoctor = () => requireRole(["DOCTOR"]);
export const requireCustomer = () => requireRole(["CUSTOMER"]);
export const requireLabAdmin = () => requireRole(["LAB_ADMIN"]);
export const requireApproval = () => requireRole(["APPROVAL"]);
