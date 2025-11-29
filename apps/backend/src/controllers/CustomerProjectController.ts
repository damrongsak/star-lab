import { NextFunction, Request, Response } from "express";
import { customerProjectService } from "../services/CustomerProjectService";
import { CustomerService } from "../services/CustomerService";
import logger from "../utils/logger";

const customerService = new CustomerService();

export class CustomerProjectController {
    /**
     * @swagger
     * /api/v1/projects:
     *   post:
     *     tags:
     *       - Projects
     *     summary: Create a new project
     *     description: Create a new project for the authenticated customer
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - projectCode
     *               - name
     *             properties:
     *               projectCode:
     *                 type: string
     *                 example: "PROJ-001"
     *               name:
     *                 type: string
     *                 example: "Q3 Research"
     *               description:
     *                 type: string
     *                 example: "Research project for Q3 2025"
     *     responses:
     *       201:
     *         description: Project created successfully
     *       400:
     *         description: Invalid input or project code already exists
     */
    async createProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const customer = await customerService.getCustomerByUserId(userId);
            if (!customer) {
                return res.status(403).json({ message: "User is not a customer" });
            }

            const { projectCode, name, description } = req.body;

            const project = await customerProjectService.createProject({
                customerId: customer.id,
                projectCode,
                name,
                description,
                createdById: userId,
            });

            res.status(201).json(project);
        } catch (error: any) {
            logger.error("Error in createProject controller:", error);
            if (error.message.includes("already exists")) {
                return res.status(400).json({ message: error.message });
            }
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/projects:
     *   get:
     *     tags:
     *       - Projects
     *     summary: Get all projects
     *     description: Get all projects for the authenticated customer
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: includeInactive
     *         schema:
     *           type: boolean
     *         description: Include inactive projects
     *     responses:
     *       200:
     *         description: List of projects
     */
    async getProjects(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const customer = await customerService.getCustomerByUserId(userId);
            if (!customer) {
                return res.status(403).json({ message: "User is not a customer" });
            }

            const includeInactive = req.query.includeInactive === "true";
            const projects = await customerProjectService.getProjectsByCustomer(customer.id, includeInactive);

            // Fetch stats for each project
            const projectsWithStats = await Promise.all(
                projects.map(async (project) => {
                    const stats = await customerProjectService.getProjectStats(project.id);
                    return { ...project, ...stats };
                })
            );

            res.json(projectsWithStats);
        } catch (error) {
            logger.error("Error in getProjects controller:", error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/projects/{id}:
     *   get:
     *     tags:
     *       - Projects
     *     summary: Get project by ID
     *     description: Get project details
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Project details
     *       404:
     *         description: Project not found
     */
    async getProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const customer = await customerService.getCustomerByUserId(userId);
            if (!customer) {
                return res.status(403).json({ message: "User is not a customer" });
            }

            const projectId = req.params.id;
            const project = await customerProjectService.getProjectById(projectId);

            if (!project || project.customerId !== customer.id) {
                return res.status(404).json({ message: "Project not found" });
            }

            const stats = await customerProjectService.getProjectStats(projectId);

            res.json({ ...project, ...stats });
        } catch (error) {
            logger.error("Error in getProject controller:", error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/projects/{id}:
     *   put:
     *     tags:
     *       - Projects
     *     summary: Update project
     *     description: Update project details
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               name:
     *                 type: string
     *               description:
     *                 type: string
     *               isActive:
     *                 type: boolean
     *     responses:
     *       200:
     *         description: Project updated successfully
     */
    async updateProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const customer = await customerService.getCustomerByUserId(userId);
            if (!customer) {
                return res.status(403).json({ message: "User is not a customer" });
            }

            const projectId = req.params.id;
            const existingProject = await customerProjectService.getProjectById(projectId);

            if (!existingProject || existingProject.customerId !== customer.id) {
                return res.status(404).json({ message: "Project not found" });
            }

            const { name, description, isActive } = req.body;
            const project = await customerProjectService.updateProject(projectId, {
                name,
                description,
                isActive,
            });

            res.json(project);
        } catch (error) {
            logger.error("Error in updateProject controller:", error);
            next(error);
        }
    }

    /**
     * @swagger
     * /api/v1/projects/{id}:
     *   delete:
     *     tags:
     *       - Projects
     *     summary: Delete project
     *     description: Soft delete a project
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Project deleted successfully
     */
    async deleteProject(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const customer = await customerService.getCustomerByUserId(userId);
            if (!customer) {
                return res.status(403).json({ message: "User is not a customer" });
            }

            const projectId = req.params.id;
            const existingProject = await customerProjectService.getProjectById(projectId);

            if (!existingProject || existingProject.customerId !== customer.id) {
                return res.status(404).json({ message: "Project not found" });
            }

            const project = await customerProjectService.deleteProject(projectId);

            res.json(project);
        } catch (error) {
            logger.error("Error in deleteProject controller:", error);
            next(error);
        }
    }
}
