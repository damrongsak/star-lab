import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import logger from "../utils/logger";

const prisma = new PrismaClient();

const listQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10)),
    search: z.string().optional(),
    status: z.enum(["active", "inactive", "all"]).optional(),
});

export class AdminCustomerController {
    async listCustomers(req: Request, res: Response): Promise<void> {
        try {
            const parsed = listQuerySchema.safeParse(req.query);
            if (!parsed.success) {
                res.status(400).json({
                    message: "Invalid query parameters",
                    errors: parsed.error.errors,
                });
                return;
            }

            const { page, limit, search, status } = parsed.data;
            const skip = (page - 1) * limit;

            // Build where clause
            const where: any = {};

            // Search by company name or operator name
            if (search) {
                const searchTerm = search.trim();
                const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0);

                const searchConditions: any[] = [
                    { companyNameEn: { contains: searchTerm, mode: "insensitive" } },
                    { companyNameTh: { contains: searchTerm, mode: "insensitive" } },
                ];

                // Add conditions for each word in operator name
                searchWords.forEach(word => {
                    searchConditions.push({
                        operatorFirstName: { contains: word, mode: "insensitive" }
                    });
                    searchConditions.push({
                        operatorLastName: { contains: word, mode: "insensitive" }
                    });
                });

                where.OR = searchConditions;
            }

            // Filter by status (based on user.isEmailConfirmed)
            if (status && status !== "all") {
                where.user = {
                    isEmailConfirmed: status === "active" ? true : false,
                };
            }

            const [customers, total] = await Promise.all([
                prisma.customer.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                isEmailConfirmed: true,
                                createdAt: true,
                            },
                        },
                        _count: {
                            select: {
                                testRequests: true,
                            },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                }),
                prisma.customer.count({ where }),
            ]);

            const formattedCustomers = customers.map((customer) => ({
                id: customer.id,
                userId: customer.userId,
                companyNameEn: customer.companyNameEn,
                companyNameTh: customer.companyNameTh,
                operatorName: `${customer.operatorFirstName} ${customer.operatorLastName}`,
                email: customer.user.email,
                phone: customer.companyPhone,
                status: customer.user.isEmailConfirmed ? "Active" : "Inactive",
                registeredAt: customer.createdAt,
                totalRequests: customer._count.testRequests,
            }));

            res.json({
                customers: formattedCustomers,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
            });
        } catch (error) {
            logger.error(`Error listing customers: ${error}`);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async getCustomerById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({ message: "Customer ID is required" });
                return;
            }

            const customer = await prisma.customer.findUnique({
                where: { id },
                include: {
                    user: {
                        select: {
                            id: true,
                            email: true,
                            isEmailConfirmed: true,
                            createdAt: true,
                        },
                    },
                    _count: {
                        select: {
                            testRequests: true,
                            invoices: true,
                        },
                    },
                },
            });

            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }

            res.json({ customer });
        } catch (error) {
            logger.error(`Error getting customer by id: ${error}`);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    async updateCustomerStatus(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { isActive } = req.body;

            if (!id) {
                res.status(400).json({ message: "Customer ID is required" });
                return;
            }

            if (typeof isActive !== "boolean") {
                res.status(400).json({ message: "isActive must be a boolean" });
                return;
            }

            const customer = await prisma.customer.findUnique({
                where: { id },
                select: { userId: true },
            });

            if (!customer) {
                res.status(404).json({ message: "Customer not found" });
                return;
            }

            await prisma.user.update({
                where: { id: customer.userId },
                data: { isEmailConfirmed: isActive },
            });

            logger.info(
                `Customer ${id} status updated to ${isActive ? "active" : "inactive"}`,
            );
            res.json({ message: "Customer status updated successfully" });
        } catch (error) {
            logger.error(`Error updating customer status: ${error}`);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}
