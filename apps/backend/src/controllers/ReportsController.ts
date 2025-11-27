import { Request, Response } from "express";
import { prisma } from "../utils/db";
import logger from "../utils/logger";

export class ReportsController {
  /**
   * Get request volume data for charts (last 30 days)
   */
  async getRequestVolumeData(req: Request, res: Response): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const requests = await prisma.testRequest.findMany({
        where: {
          createdAt: {
            gte: thirtyDaysAgo,
          },
        },
        select: {
          createdAt: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      // Group by date
      const dataByDate = requests.reduce(
        (acc, request) => {
          if (request.createdAt) {
            const date = request.createdAt.toISOString().split("T")[0];
            acc[date] = (acc[date] || 0) + 1;
          }
          return acc;
        },
        {} as Record<string, number>,
      );

      // Fill in missing dates with 0
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        data.push({
          date: dateStr,
          count: dataByDate[dateStr] || 0,
        });
      }

      res.json({ data });
    } catch (error) {
      logger.error(`Error getting request volume data: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Get revenue data for charts (last 30 days)
   */
  async getRevenueData(req: Request, res: Response): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const invoices = await prisma.invoice.findMany({
        where: {
          invoiceDate: {
            gte: thirtyDaysAgo,
          },
          paymentStatus: {
            in: ["PAID", "PENDING"],
          },
        },
        select: {
          invoiceDate: true,
          netTotal: true,
        },
        orderBy: {
          invoiceDate: "asc",
        },
      });

      // Group by date
      const dataByDate = invoices.reduce(
        (acc, invoice) => {
          const date = invoice.invoiceDate.toISOString().split("T")[0];
          acc[date] = (acc[date] || 0) + Number(invoice.netTotal);
          return acc;
        },
        {} as Record<string, number>,
      );

      // Fill in missing dates with 0
      const data = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        data.push({
          date: dateStr,
          revenue: dataByDate[dateStr] || 0,
        });
      }

      res.json({ data });
    } catch (error) {
      logger.error(`Error getting revenue data: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Generate financial report
   */
  async generateFinancialReport(req: Request, res: Response): Promise<void> {
    try {
      const [totalRevenue, paidInvoices, pendingInvoices, recentInvoices] =
        await Promise.all([
          prisma.invoice.aggregate({
            where: { paymentStatus: "PAID" },
            _sum: { netTotal: true },
          }),
          prisma.invoice.count({ where: { paymentStatus: "PAID" } }),
          prisma.invoice.count({ where: { paymentStatus: "PENDING" } }),
          prisma.invoice.findMany({
            take: 10,
            orderBy: { invoiceDate: "desc" },
            include: {
              customer: {
                select: { companyNameEn: true },
              },
            },
          }),
        ]);

      const report = {
        title: "Financial Report",
        generated: new Date().toISOString(),
        summary: {
          totalRevenue: Number(totalRevenue._sum.netTotal || 0),
          paidInvoices,
          pendingInvoices,
          averageInvoiceValue:
            paidInvoices > 0
              ? Number(totalRevenue._sum.netTotal || 0) / paidInvoices
              : 0,
        },
        recentInvoices: recentInvoices.map((inv) => ({
          invoiceNo: inv.invoiceNo,
          customer: inv.customer?.companyNameEn,
          date: inv.invoiceDate,
          amount: Number(inv.netTotal),
          status: inv.paymentStatus,
        })),
      };

      res.json(report);
    } catch (error) {
      logger.error(`Error generating financial report: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Generate customer activity report
   */
  async generateCustomerReport(req: Request, res: Response): Promise<void> {
    try {
      const [totalCustomers, customers] = await Promise.all([
        prisma.customer.count(),
        prisma.customer.findMany({
          include: {
            _count: {
              select: {
                testRequests: true,
                invoices: true,
              },
            },
          },
          take: 20,
          orderBy: {
            createdAt: "desc",
          },
        }),
      ]);

      const report = {
        title: "Customer Activity Report",
        generated: new Date().toISOString(),
        summary: {
          totalCustomers,
          activeCustomers: customers.filter((c) => c._count.testRequests > 0)
            .length,
        },
        customers: customers.map((customer) => ({
          companyName: customer.companyNameEn,
          totalRequests: customer._count.testRequests,
          totalInvoices: customer._count.invoices,
          joinedDate: customer.createdAt,
        })),
      };

      res.json(report);
    } catch (error) {
      logger.error(`Error generating customer report: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Generate lab performance report
   */
  async generateLabReport(req: Request, res: Response): Promise<void> {
    try {
      const [
        totalRequests,
        completedRequests,
        inProgressRequests,
        avgCompletionTime,
      ] = await Promise.all([
        prisma.testRequest.count(),
        prisma.testRequest.count({
          where: { labInternalStatus: "COMPLETED" },
        }),
        prisma.testRequest.count({
          where: {
            labInternalStatus: {
              in: ["RECEIVED_SAMPLES", "ASSIGNED_TECHNICIAN", "IN_PROGRESS"],
            },
          },
        }),
        // Placeholder - actual turnaround time calculation would need different logic
        Promise.resolve(0),
      ]);

      const report = {
        title: "Lab Performance Report",
        generated: new Date().toISOString(),
        summary: {
          totalRequests,
          completedRequests,
          inProgressRequests,
          completionRate:
            totalRequests > 0
              ? ((completedRequests / totalRequests) * 100).toFixed(2) + "%"
              : "0%",
        },
        statusBreakdown: [
          { status: "Completed", count: completedRequests },
          { status: "In Progress", count: inProgressRequests },
          {
            status: "Other",
            count: totalRequests - completedRequests - inProgressRequests,
          },
        ],
      };

      res.json(report);
    } catch (error) {
      logger.error(`Error generating lab report: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * Generate technician productivity report
   */
  async generateTechnicianReport(req: Request, res: Response): Promise<void> {
    try {
      const technicians = await prisma.user.findMany({
        where: { role: "TECHNICIAN" },
        include: {
          assignedLabTests: {
            include: {
              testRequestSample: {
                select: {
                  currentStatus: true,
                },
              },
            },
          },
          userProfile: true,
        },
      });

      const report = {
        title: "Technician Productivity Report",
        generated: new Date().toISOString(),
        summary: {
          totalTechnicians: technicians.length,
          activeTechnicians: technicians.filter(
            (t) => t.assignedLabTests.length > 0,
          ).length,
        },
        technicians: technicians.map((tech) => ({
          name: tech.userProfile
            ? `${tech.userProfile.firstName} ${tech.userProfile.lastName}`
            : tech.email,
          email: tech.email,
          assignedTests: tech.assignedLabTests.length,
          // Note: Cannot determine completed tests from TestRequestSampleStatus
          // as it doesn't have a "completed" state. Would need to check LabTest status instead.
          completedTests: 0,
        })),
      };

      res.json(report);
    } catch (error) {
      logger.error(`Error generating technician report: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
