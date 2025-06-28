import { Request, Response } from "express";
import {
  CustomerService,
  UpdateCustomerData,
} from "../services/CustomerService";
import { updateCustomerProfileSchema } from "../validation/customer";
import logger from "../utils/logger";

const customerService = new CustomerService();

export class CustomerController {
  /**
   * @swagger
   * /api/v1/customers/profile:
   *   get:
   *     tags:
   *       - Customers
   *     summary: Get customer profile
   *     description: Retrieve the authenticated customer's profile information
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Customer profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Customer'
   *                 - type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         email:
   *                           type: string
   *                           format: email
   *                         role:
   *                           type: string
   *                           enum: ["CUSTOMER"]
   *       401:
   *         description: Unauthorized - invalid or missing token
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Customer profile not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/customers/profile:
   *   put:
   *     tags:
   *       - Customers
   *     summary: Update customer profile
   *     description: Update the authenticated customer's profile information
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               companyNameEn:
   *                 type: string
   *                 example: "StarLab Company Ltd."
   *                 description: Company name in English
   *               companyNameTh:
   *                 type: string
   *                 example: "บริษัท สตาร์แล็บ จำกัด"
   *                 description: Company name in Thai
   *               legalEntityId:
   *                 type: string
   *                 example: "0123456789012"
   *                 description: Legal entity identification number
   *               companyDescription:
   *                 type: string
   *                 example: "Leading laboratory testing services"
   *                 description: Company description
   *               companyAddressLine1:
   *                 type: string
   *                 example: "123 Main Street, Building A"
   *                 description: Company address line 1
   *               companyProvince:
   *                 type: string
   *                 example: "Bangkok"
   *                 description: Company province
   *               companyDistrict:
   *                 type: string
   *                 example: "Chatuchak"
   *                 description: Company district
   *               companySubDistrict:
   *                 type: string
   *                 example: "Chatuchak"
   *                 description: Company sub-district
   *               companyZipCode:
   *                 type: string
   *                 example: "10900"
   *                 description: Company postal code
   *               companyPhone:
   *                 type: string
   *                 example: "+66-2-123-4567"
   *                 description: Company phone number
   *               companyFax:
   *                 type: string
   *                 example: "+66-2-123-4568"
   *                 description: Company fax number
   *               operatorIdCard:
   *                 type: string
   *                 example: "1234567890123"
   *                 description: Operator ID card number
   *               operatorPrefix:
   *                 type: string
   *                 example: "Mr."
   *                 description: Operator name prefix
   *               operatorFirstName:
   *                 type: string
   *                 example: "John"
   *                 description: Operator first name
   *               operatorLastName:
   *                 type: string
   *                 example: "Doe"
   *                 description: Operator last name
   *               operatorMobilePhone:
   *                 type: string
   *                 example: "+66-81-234-5678"
   *                 description: Operator mobile phone number
   *               operatorPhone:
   *                 type: string
   *                 example: "+66-2-123-4569"
   *                 description: Operator office phone number
   *               receiptAddressBuildingFloorNumber:
   *                 type: string
   *                 example: "456 Business Center, 5th Floor"
   *                 description: Receipt address with building and floor
   *               receiptProvince:
   *                 type: string
   *                 example: "Bangkok"
   *                 description: Receipt address province
   *               receiptDistrict:
   *                 type: string
   *                 example: "Watthana"
   *                 description: Receipt address district
   *               receiptSubDistrict:
   *                 type: string
   *                 example: "Khlong Toei Nuea"
   *                 description: Receipt address sub-district
   *               receiptZipCode:
   *                 type: string
   *                 example: "10110"
   *                 description: Receipt address postal code
   *               receiptPhone:
   *                 type: string
   *                 example: "+66-2-234-5678"
   *                 description: Receipt address phone number
   *               receiptFax:
   *                 type: string
   *                 example: "+66-2-234-5679"
   *                 description: Receipt address fax number
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Profile updated successfully"
   *                 customer:
   *                   $ref: '#/components/schemas/Customer'
   *       400:
   *         description: Validation failed
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Validation failed"
   *                 errors:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       path:
   *                         type: array
   *                         items:
   *                           type: string
   *                       message:
   *                         type: string
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Customer profile not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - data already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/customers/statistics:
   *   get:
   *     tags:
   *       - Customers
   *     summary: Get customer statistics
   *     description: Retrieve statistics for the authenticated customer including test requests count, invoices, etc.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Customer statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalTestRequests:
   *                   type: integer
   *                   example: 25
   *                   description: Total number of test requests
   *                 pendingRequests:
   *                   type: integer
   *                   example: 5
   *                   description: Number of pending test requests
   *                 completedRequests:
   *                   type: integer
   *                   example: 18
   *                   description: Number of completed test requests
   *                 totalInvoices:
   *                   type: integer
   *                   example: 20
   *                   description: Total number of invoices
   *                 paidInvoices:
   *                   type: integer
   *                   example: 15
   *                   description: Number of paid invoices
   *                 pendingInvoices:
   *                   type: integer
   *                   example: 5
   *                   description: Number of pending invoices
   *                 totalAmount:
   *                   type: number
   *                   format: decimal
   *                   example: 125000.00
   *                   description: Total amount of all invoices
   *                 paidAmount:
   *                   type: number
   *                   format: decimal
   *                   example: 95000.00
   *                   description: Total amount paid
   *                 pendingAmount:
   *                   type: number
   *                   format: decimal
   *                   example: 30000.00
   *                   description: Total amount pending
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Customer profile not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
  /**
   * @swagger
   * /api/v1/customers:
   *   get:
   *     tags:
   *       - Customers
   *     summary: Get all customers (Admin only)
   *     description: Retrieve paginated list of all customers for administrators
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *         example: 10
   *     responses:
   *       200:
   *         description: Customers retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 customers:
   *                   type: array
   *                   items:
   *                     allOf:
   *                       - $ref: '#/components/schemas/Customer'
   *                       - type: object
   *                         properties:
   *                           user:
   *                             type: object
   *                             properties:
   *                               email:
   *                                 type: string
   *                                 format: email
   *                               role:
   *                                 type: string
   *                               isEmailConfirmed:
   *                                 type: boolean
   *                 total:
   *                   type: integer
   *                   example: 150
   *                   description: Total number of customers
   *                 totalPages:
   *                   type: integer
   *                   example: 15
   *                   description: Total number of pages
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                   description: Current page number
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/customers/{id}:
   *   get:
   *     tags:
   *       - Customers
   *     summary: Get customer by ID (Admin only)
   *     description: Retrieve detailed information about a specific customer by ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Customer ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Customer details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/Customer'
   *                 - type: object
   *                   properties:
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         email:
   *                           type: string
   *                           format: email
   *                         role:
   *                           type: string
   *                         isEmailConfirmed:
   *                           type: boolean
   *                         createdAt:
   *                           type: string
   *                           format: date-time
   *                         updatedAt:
   *                           type: string
   *                           format: date-time
   *                     testRequests:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             format: uuid
   *                           requestNo:
   *                             type: string
   *                           documentStatus:
   *                             type: string
   *                           labInternalStatus:
   *                             type: string
   *                           createdAt:
   *                             type: string
   *                             format: date-time
   *       400:
   *         description: Bad request - invalid customer ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Customer not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/customers/search:
   *   get:
   *     tags:
   *       - Customers
   *     summary: Search customers (Admin only)
   *     description: Search customers by company name, email, or other criteria
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query string
   *         example: "StarLab"
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/Customer'
   *                   - type: object
   *                     properties:
   *                       user:
   *                         type: object
   *                         properties:
   *                           email:
   *                             type: string
   *                             format: email
   *                           role:
   *                             type: string
   *                           isEmailConfirmed:
   *                             type: boolean
   *       400:
   *         description: Bad request - search query is required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/customers/{id}:
   *   delete:
   *     tags:
   *       - Customers
   *     summary: Delete customer (Admin only)
   *     description: Delete a customer and their associated data. Cannot delete customers with active test requests.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Customer ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Customer deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Customer deleted successfully"
   *       400:
   *         description: Bad request - invalid customer ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       409:
   *         description: Conflict - cannot delete customer with active test requests
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cannot delete customer with active test requests"
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
