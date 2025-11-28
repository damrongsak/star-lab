import { Request, Response } from "express";
import { z } from "zod";
import { UserRole } from "@prisma/client";
import { UserService } from "../services/UserService";
import logger from "../utils/logger";

const userService = new UserService();

// Internal roles exclude CUSTOMER
const InternalUserRoleEnum = z
  .nativeEnum(UserRole)
  .refine((role) => role !== UserRole.CUSTOMER, {
    message: "Invalid role for internal user",
  });

const createInternalUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: InternalUserRoleEnum,
  isEmailConfirmed: z.boolean().optional(),
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
      const querySchema = listQuerySchema.extend({
        page: z
          .string()
          .optional()
          .transform((val) => (val ? parseInt(val, 10) : 1)),
        limit: z
          .string()
          .optional()
          .transform((val) => (val ? parseInt(val, 10) : 10)),
        search: z.string().optional(),
      });

      const parsed = querySchema.safeParse(req.query);
      if (!parsed.success) {
        res.status(400).json({
          message: "Invalid query parameters",
          errors: parsed.error.errors,
        });
        return;
      }

      const { role, page, limit, search } = parsed.data;

      // Build filters, ensuring we exclude CUSTOMER role
      // If a specific role is requested, use that; otherwise exclude CUSTOMER
      const serviceFilters: { role?: string; search?: string; excludeRole?: string } = {
        search,
      };

      if (role) {
        // User requested a specific role filter
        serviceFilters.role = role;
      } else {
        // No specific role requested, but we want to exclude customers
        serviceFilters.excludeRole = UserRole.CUSTOMER;
      }

      const result = await userService.getAllUsers(
        serviceFilters,
        page,
        limit,
      );

      const mappedUsers = result.users.map((user) => ({
        id: user.id,
        email: user.email,
        role: user.role,
        isEmailConfirmed: user.isEmailConfirmed,
        name: user.userProfile
          ? `${user.userProfile.firstName || ""} ${user.userProfile.lastName || ""}`.trim() ||
          user.email.split("@")[0]
          : user.email.split("@")[0],
        status: user.isEmailConfirmed ? "Active" : "Inactive",
      }));

      res.json({
        users: mappedUsers,
        total: result.total,
        totalPages: Math.ceil(result.total / limit),
        currentPage: page,
      });
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
        res
          .status(400)
          .json({ message: "Validation failed", errors: parsed.error.errors });
        return;
      }
      const data = parsed.data;
      const user = await userService.createUser({
        email: data.email,
        password: data.password,
        role: data.role,
      });

      // If isEmailConfirmed is passed, update it immediately (creation defaults to false)
      if (data.isEmailConfirmed) {
        await userService.updateUser(user.id, { isEmailConfirmed: true });
        user.isEmailConfirmed = true;
      }

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
        res
          .status(400)
          .json({ message: "Validation failed", errors: parsed.error.errors });
        return;
      }
      const updateData = parsed.data;

      // Prevent changing an internal user to CUSTOMER explicitly (schema guards but double-check)
      if ((updateData as any).role === UserRole.CUSTOMER) {
        res
          .status(400)
          .json({ message: "Role CUSTOMER is not allowed for internal users" });
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
