import { Request, Response } from "express";
import {
  PrismaClient,
  UserRole,
  TestRequestDocumentStatus,
} from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export class AdminController {
  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalUsers,
        totalCustomers,
        totalTestRequests,
        pendingApprovals,
        activeTechnicians,
        totalInvoices,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.customer.count(),
        prisma.testRequest.count(),
        prisma.testRequest.count({
          where: { documentStatus: TestRequestDocumentStatus.RESULT_READY },
        }),
        prisma.user.count({ where: { role: UserRole.TECHNICIAN } }),
        prisma.invoice.count(),
      ]);

      res.json({
        totalUsers,
        totalCustomers,
        totalTestRequests,
        pendingApprovals,
        activeTechnicians,
        totalInvoices,
      });
    } catch (error) {
      logger.error(`Error getting admin stats: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
