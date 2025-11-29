import { PrismaClient, Project, Prisma } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateProjectData {
    customerId: string;
    projectCode: string;
    name: string;
    description?: string;
    createdById?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    isActive?: boolean;
}

export class CustomerProjectService {
    /**
     * Create a new project for a customer
     */
    async createProject(data: CreateProjectData): Promise<Project> {
        try {
            // Check if project code already exists for this customer
            const existingProject = await prisma.project.findUnique({
                where: {
                    customerId_projectCode: {
                        customerId: data.customerId,
                        projectCode: data.projectCode,
                    },
                },
            });

            if (existingProject) {
                throw new Error(`Project code '${data.projectCode}' already exists for this customer`);
            }

            const project = await prisma.project.create({
                data: {
                    customerId: data.customerId,
                    projectCode: data.projectCode,
                    name: data.name,
                    description: data.description,
                    createdById: data.createdById,
                    isActive: true,
                },
            });

            logger.info(`Created project ${project.projectCode} for customer ${data.customerId}`);
            return project;
        } catch (error) {
            logger.error("Error creating project:", error);
            throw error;
        }
    }

    /**
     * Get all projects for a customer with pagination
     */
    async getProjectsByCustomer(
        customerId: string,
        params: {
            page?: number;
            limit?: number;
            search?: string;
            includeInactive?: boolean;
        }
    ): Promise<{
        data: Project[];
        total: number;
        totalPages: number;
        currentPage: number;
        limit: number;
    }> {
        try {
            const page = Number(params.page) || 1;
            const limit = Number(params.limit) || 10;
            const skip = (page - 1) * limit;
            const search = params.search?.trim();

            const where: any = {
                customerId,
            };

            if (!params.includeInactive) {
                where.isActive = true;
            }

            if (search) {
                where.OR = [
                    { projectCode: { contains: search, mode: "insensitive" } },
                    { name: { contains: search, mode: "insensitive" } },
                    { description: { contains: search, mode: "insensitive" } },
                ];
            }

            const [total, projects] = await Promise.all([
                prisma.project.count({ where }),
                prisma.project.findMany({
                    where,
                    skip,
                    take: limit,
                    orderBy: {
                        updatedAt: "desc",
                    },
                }),
            ]);

            return {
                data: projects,
                total,
                totalPages: Math.ceil(total / limit),
                currentPage: page,
                limit,
            };
        } catch (error) {
            logger.error(`Error fetching projects for customer ${customerId}:`, error);
            throw error;
        }
    }

    /**
     * Get project by ID
     */
    async getProjectById(projectId: string): Promise<Project | null> {
        try {
            const project = await prisma.project.findUnique({
                where: { id: projectId },
            });
            return project;
        } catch (error) {
            logger.error(`Error fetching project ${projectId}:`, error);
            throw error;
        }
    }

    /**
     * Update a project
     */
    async updateProject(projectId: string, data: UpdateProjectData): Promise<Project> {
        try {
            const project = await prisma.project.update({
                where: { id: projectId },
                data,
            });

            logger.info(`Updated project ${projectId}`);
            return project;
        } catch (error) {
            logger.error(`Error updating project ${projectId}:`, error);
            throw error;
        }
    }

    /**
     * Soft delete a project (set isActive = false)
     */
    async deleteProject(projectId: string): Promise<Project> {
        try {
            const project = await prisma.project.update({
                where: { id: projectId },
                data: { isActive: false },
            });

            logger.info(`Soft deleted project ${projectId}`);
            return project;
        } catch (error) {
            logger.error(`Error deleting project ${projectId}:`, error);
            throw error;
        }
    }

    /**
     * Get project statistics (request count, total amount)
     */
    async getProjectStats(projectId: string) {
        try {
            const [requestCount, invoices] = await Promise.all([
                prisma.testRequest.count({
                    where: { projectId },
                }),
                prisma.invoice.findMany({
                    where: {
                        testRequest: {
                            projectId,
                        },
                        paymentStatus: {
                            not: "CANCELLED",
                        },
                    },
                    select: {
                        netTotal: true,
                    },
                }),
            ]);

            const toNumber = (value: Prisma.Decimal | number | null | undefined): number => {
                if (value === null || value === undefined) {
                    return 0;
                }
                return typeof value === "number" ? value : value.toNumber();
            };

            const totalAmount = invoices.reduce((sum, invoice) => sum + toNumber(invoice.netTotal), 0);

            return {
                requestCount,
                totalAmount,
            };
        } catch (error) {
            logger.error(`Error fetching stats for project ${projectId}:`, error);
            throw error;
        }
    }
}

export const customerProjectService = new CustomerProjectService();
