import { PrismaClient, AuditTrail, Prisma } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateAuditLogData {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
}

export interface AuditLogFilters {
  userId?: string;
  entityType?: string;
  entityId?: string;
  startDate?: Date;
  endDate?: Date;
}

export class AuditService {
  /**
   * Log an action to the audit trail
   */
  async logAction(data: CreateAuditLogData): Promise<AuditTrail> {
    try {
      const auditLog = await prisma.auditTrail.create({
        data: {
          userId: data.userId,
          action: data.action,
          entityType: data.entityType,
          entityId: data.entityId,
          details: data.details
            ? (data.details as Prisma.InputJsonValue)
            : undefined,
        },
      });

      logger.info(
        `Audit log created: ${data.action} on ${data.entityType} ${data.entityId}`,
      );
      return auditLog;
    } catch (error) {
      logger.error(`Error creating audit log: ${error}`);
      // We don't want to break the main flow if audit logging fails, but we should log the error
      // Returning a dummy object or rethrowing depends on strictness requirements.
      // For now, we'll rethrow to ensure data integrity if strict audit is needed.
      throw error;
    }
  }

  /**
   * Get audit logs with filtering and pagination
   */
  async getAuditLogs(
    filters: AuditLogFilters,
    page: number = 1,
    limit: number = 20,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: Prisma.AuditTrailWhereInput = {};

      if (filters.userId) where.userId = filters.userId;
      if (filters.entityType) where.entityType = filters.entityType;
      if (filters.entityId) where.entityId = filters.entityId;

      if (filters.startDate || filters.endDate) {
        where.timestamp = {};
        if (filters.startDate) where.timestamp.gte = filters.startDate;
        if (filters.endDate) where.timestamp.lte = filters.endDate;
      }

      const [logs, total] = await Promise.all([
        prisma.auditTrail.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            timestamp: "desc",
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                role: true,
              },
            },
          },
        }),
        prisma.auditTrail.count({ where }),
      ]);

      return {
        logs,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting audit logs: ${error}`);
      throw error;
    }
  }
}
