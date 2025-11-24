import express from "express";
import { AuditService } from "../services/AuditService";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireRole } from "../middleware/rbacMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();
const auditService = new AuditService();

// Get audit logs (Admin only)
router.get(
    "/",
    authMiddleware,
    requireRole([UserRole.ADMIN]),
    async (req, res, next) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const filters = {
                userId: req.query.userId as string,
                entityType: req.query.entityType as string,
                entityId: req.query.entityId as string,
                startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
            };

            const result = await auditService.getAuditLogs(filters, page, limit);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
);

export default router;
