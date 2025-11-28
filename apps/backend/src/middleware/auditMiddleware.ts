import { Request, Response, NextFunction } from "express";
import { AuditService } from "../services/AuditService";
import logger from "../utils/logger";

const auditService = new AuditService();

export const auditMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Only audit state-changing methods
  if (!["POST", "PUT", "DELETE", "PATCH"].includes(req.method)) {
    next();
    return;
  }

  // Capture start time
  const startTime = Date.now();

  // Listen for response finish
  res.on("finish", () => {
    try {
      // Only log successful operations or specific failures
      // We'll log 2xx and 4xx (client errors)
      // 5xx are usually logged by error handler
      if (res.statusCode >= 500) return;

      const user = req.user;

      // Extract entity type from URL
      // Format: /api/v1/:entityType/:entityId?...
      const parts = req.originalUrl.split("/").filter((p) => p);
      let entityType = "UNKNOWN";
      let entityId: string | undefined = undefined;

      // Assuming /api/v1/ prefix
      if (parts.length >= 3 && parts[0] === "api" && parts[1] === "v1") {
        entityType = parts[2]; // e.g., "customers", "test-requests"

        // Try to find UUID in URL for entityId
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (parts.length >= 4 && uuidRegex.test(parts[3])) {
          entityId = parts[3];
        }
      }

      // Prepare details
      const details = {
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode,
        duration: Date.now() - startTime,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      };

      // Log asynchronously
      auditService
        .logAction({
          userId: user?.userId,
          action: `${req.method} ${entityType.toUpperCase()}`,
          entityType: entityType,
          entityId: entityId,
          details: details,
        })
        .catch((err) => {
          logger.error("Failed to create audit log", { error: err });
        });
    } catch (error) {
      logger.error("Error in audit middleware", { error });
    }
  });

  next();
};
