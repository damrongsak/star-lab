import { Request, Response } from "express";
import {
  CustomerService,
  UpdateCustomerData,
} from "../services/CustomerService";
import { updateCustomerProfileSchema } from "../validation/customer";
import logger from "../utils/logger";

const customerService = new CustomerService();

export class CustomerController {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const customer = await customerService.getCustomerByUserId(userId);
      if (!customer) {
        res.status(404).json({ message: "Customer profile not found" });
        return;
      }

      res.json(customer);
    } catch (error) {
      logger.error(`Error getting customer profile: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Validate request body
      const validationResult = updateCustomerProfileSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
        return;
      }

      // Get current customer
      const currentCustomer = await customerService.getCustomerByUserId(userId);
      if (!currentCustomer) {
        res.status(404).json({ message: "Customer profile not found" });
        return;
      }

      const updateData: UpdateCustomerData = validationResult.data;
      const updatedCustomer = await customerService.updateCustomer(
        currentCustomer.id,
        updateData,
      );

      res.json({
        message: "Profile updated successfully",
        customer: updatedCustomer,
      });
    } catch (error) {
      logger.error(`Error updating customer profile: ${error}`);

      if (error instanceof Error) {
        if (error.message.includes("already exists")) {
          res.status(409).json({ message: error.message });
          return;
        }
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getStatistics(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const customer = await customerService.getCustomerByUserId(userId);
      if (!customer) {
        res.status(404).json({ message: "Customer profile not found" });
        return;
      }

      const statistics = await customerService.getCustomerStatistics(
        customer.id,
      );
      res.json(statistics);
    } catch (error) {
      logger.error(`Error getting customer statistics: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Admin endpoints
  async getAllCustomers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await customerService.getAllCustomers(page, limit);
      res.json(result);
    } catch (error) {
      logger.error(`Error getting all customers: ${error}`);
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

      const customer = await customerService.getCustomerById(id);
      if (!customer) {
        res.status(404).json({ message: "Customer not found" });
        return;
      }

      res.json(customer);
    } catch (error) {
      logger.error(`Error getting customer by ID: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async searchCustomers(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const customers = await customerService.searchCustomers(q);
      res.json(customers);
    } catch (error) {
      logger.error(`Error searching customers: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteCustomer(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Customer ID is required" });
        return;
      }

      const success = await customerService.deleteCustomer(id);

      if (success) {
        res.json({ message: "Customer deleted successfully" });
      }
    } catch (error) {
      logger.error(`Error deleting customer: ${error}`);

      if (error instanceof Error) {
        if (error.message.includes("active test requests")) {
          res.status(409).json({ message: error.message });
          return;
        }
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }
}
