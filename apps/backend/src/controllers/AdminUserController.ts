import { Request, Response } from "express";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { UserService } from "../services/UserService";
import logger from "../utils/logger";

const userService = new UserService();

// Internal roles exclude CUSTOMER
const InternalUserRoleEnum = z.nativeEnum(UserRole).refine((role) => role !== UserRole.CUSTOMER, {
  message: "Invalid role for internal user",
});

const createInternalUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: InternalUserRoleEnum,
});

const updateInternalUserSchema = z.object({
  email: z.string().email().optional(),
  role: InternalUserRoleEnum.optional(),
  isEmailConfirmed: z.boolean().optional(),
});

const listQuerySchema = z.object({
  role: InternalUserRoleEnum.optional(),
});

export class AdminUserController {
  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const parsed = listQuerySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({ message: "Invalid query parameters", errors: parsed.error.errors });
        return;
      }

      const role = parsed.data.role;
      const users = await userService.getAllUsers(role);
      // Ensure customers are excluded even if service returns all
      const internalUsers = users.filter((u) => u.role !== UserRole.CUSTOMER);
      res.json({ users: internalUsers });
    } catch (error) {
      logger.error(`Error listing users: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const user = await userService.getUserById(id);
      if (!user || user.role === UserRole.CUSTOMER) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({ user });
    } catch (error) {
      logger.error(`Error getting user by id: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const parsed = createInternalUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
        return;
      }
      const data = parsed.data;
      const user = await userService.createUser({
        email: data.email,
        password: data.password,
        role: data.role,
      });
      res.status(201).json({ user });
    } catch (error) {
      if (error instanceof Error && error.message.includes("already exists")) {
        res.status(409).json({ message: error.message });
        return;
      }
      logger.error(`Error creating user: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      // Validate update payload
      const parsed = updateInternalUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ message: "Validation failed", errors: parsed.error.errors });
        return;
      }
      const updateData = parsed.data;

      // Prevent changing an internal user to CUSTOMER explicitly (schema guards but double-check)
      if ((updateData as any).role === UserRole.CUSTOMER) {
        res.status(400).json({ message: "Role CUSTOMER is not allowed for internal users" });
        return;
      }

      const existing = await userService.getUserById(id);
      if (!existing || existing.role === UserRole.CUSTOMER) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const updated = await userService.updateUser(id, updateData);
      res.json({ user: updated });
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
      }
      const existing = await userService.getUserById(id);
      if (!existing || existing.role === UserRole.CUSTOMER) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      await userService.deleteUser(id);
      res.status(204).send();
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

