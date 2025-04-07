import CustomerService from "../services/customerService";
import logger from "../utils/logger";
import { Request, Response } from "express";

class CustomerController {
  static async createCustomer(req: Request, res: Response) {
    try {
      const { firstName, lastName, email } = req.body;
      const newCustomer = await CustomerService.createCustomer(
        firstName,
        lastName,
        email,
      );
      logger.info(
        `Customer created: ${newCustomer.firstName} ${newCustomer.lastName} (ID: ${newCustomer.id})`,
      );
      res.status(201).json({
        message: "Customer created successfully",
        customer: newCustomer,
      });
    } catch (error: any) {
      logger.error("Error creating customer:", error);
      res.status(400).json({ error: error.message }); // Bad request for validation errors
    }
  }

  static async getCustomerById(req: Request, res: Response) {
    try {
      const customerId = parseInt(req.params.id, 10); // Parse customer ID from params
      const customer = await CustomerService.getCustomerById(customerId);
      if (customer) {
        res.status(200).json(customer);
      } else {
        res.status(404).json({ message: "Customer not found" });
      }
    } catch (error: any) {
      logger.error("Error getting customer by ID:", error);
      res
        .status(500)
        .json({ error: "Failed to get customer", details: error.message });
    }
  }

  static async getAllCustomers(req: Request, res: Response) {
    try {
      const customers = await CustomerService.getAllCustomers();
      res.status(200).json(customers);
    } catch (error: any) {
      logger.error("Error getting all customers:", error);
      res
        .status(500)
        .json({ error: "Failed to get customers", details: error.message });
    }
  }

  static async updateCustomer(req: Request, res: Response) {
    try {
      const customerId = parseInt(req.params.id, 10);
      const { firstName, lastName, email } = req.body;
      const updatedCustomer = await CustomerService.updateCustomer(
        customerId,
        firstName,
        lastName,
        email,
      );
      if (updatedCustomer) {
        res.status(200).json({
          message: "Customer updated successfully",
          customer: updatedCustomer,
        });
      } else {
        res.status(404).json({ message: "Customer not found for update" });
      }
    } catch (error: any) {
      logger.error("Error updating customer:", error);
      res
        .status(500)
        .json({ error: "Failed to update customer", details: error.message });
    }
  }

  static async deleteCustomer(req: Request, res: Response) {
    try {
      const customerId = parseInt(req.params.id, 10);
      const deleted = await CustomerService.deleteCustomer(customerId);
      if (deleted) {
        res.status(200).json({
          message: "Customer deleted successfully",
          customerId: customerId,
        });
      } else {
        res.status(404).json({ message: "Customer not found for deletion" });
      }
    } catch (error: any) {
      logger.error("Error deleting customer:", error);
      res
        .status(500)
        .json({ error: "Failed to delete customer", details: error.message });
    }
  }
}

export default CustomerController;
