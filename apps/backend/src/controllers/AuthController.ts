import { Request, Response } from "express";
import {
  UserService,
  CreateUserData,
  UserLoginData,
} from "../services/UserService";
import {
  CustomerService,
  CreateCustomerData,
} from "../services/CustomerService";
import { registerCustomerSchema, loginSchema } from "../validation/auth";
import logger from "../utils/logger";
import { UserRole } from "@prisma/client";

const userService = new UserService();
const customerService = new CustomerService();

export class AuthController {
  /**
   * @swagger
   * /api/v1/auth/register:
   *   post:
   *     summary: Register a new customer user
   *     description: Register a new customer account with complete company and operator information. This creates both a user account and associated customer profile.
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterRequest'
   *           examples:
   *             customer_registration:
   *               summary: Customer Registration Example
   *               value:
   *                 email: "john.doe@starlab.com"
   *                 password: "SecurePassword123!"
   *                 companyNameEn: "StarLab Company Ltd."
   *                 companyNameTh: "บริษัท สตาร์แล็บ จำกัด"
   *                 legalEntityId: "0123456789012"
   *                 companyDescription: "Leading laboratory testing services"
   *                 companyAddressLine1: "123 Main Street"
   *                 companyProvince: "Bangkok"
   *                 companyDistrict: "Chatuchak"
   *                 companySubDistrict: "Chatuchak"
   *                 companyZipCode: "10900"
   *                 companyPhone: "+66-2-123-4567"
   *                 companyFax: "+66-2-123-4568"
   *                 operatorIdCard: "1234567890123"
   *                 operatorPrefix: "Mr."
   *                 operatorFirstName: "John"
   *                 operatorLastName: "Doe"
   *                 operatorMobilePhone: "+66-81-234-5678"
   *                 operatorPhone: "+66-2-123-4569"
   *                 receiptAddressBuildingFloorNumber: "456 Business Center, 5th Floor"
   *                 receiptProvince: "Bangkok"
   *                 receiptDistrict: "Watthana"
   *                 receiptSubDistrict: "Khlong Toei Nuea"
   *                 receiptZipCode: "10110"
   *                 receiptPhone: "+66-2-234-5678"
   *                 receiptFax: "+66-2-234-5679"
   *     responses:
   *       201:
   *         description: User registered successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *             examples:
   *               registration_success:
   *                 summary: Registration Success
   *                 value:
   *                   success: true
   *                   message: "User registered successfully"
   *                   user:
   *                     id: "123e4567-e89b-12d3-a456-426614174000"
   *                     email: "john.doe@starlab.com"
   *                     role: "CUSTOMER"
   *                     isEmailConfirmed: false
   *                   customer:
   *                     id: "cust-123e4567-e89b-12d3-a456-426614174000"
   *                     companyNameEn: "StarLab Company Ltd."
   *                     operatorFirstName: "John"
   *                     operatorLastName: "Doe"
   *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       409:
   *         description: Email already exists
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Email already exists"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = registerCustomerSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
        return;
      }

      const data = validationResult.data;

      // Create user first
      const userData: CreateUserData = {
        email: data.email,
        password: data.password,
        role: UserRole.CUSTOMER,
      };

      const user = await userService.createUser(userData);

      // Create customer profile
      const customerData: CreateCustomerData = {
        userId: user.id,
        companyNameEn: data.companyNameEn,
        companyNameTh: data.companyNameTh,
        legalEntityId: data.legalEntityId,
        companyDescription: data.companyDescription,
        companyAddressLine1: data.companyAddressLine1,
        companyProvince: data.companyProvince,
        companyDistrict: data.companyDistrict,
        companySubDistrict: data.companySubDistrict,
        companyZipCode: data.companyZipCode,
        companyPhone: data.companyPhone,
        companyFax: data.companyFax,
        operatorIdCard: data.operatorIdCard,
        operatorPrefix: data.operatorPrefix,
        operatorFirstName: data.operatorFirstName,
        operatorLastName: data.operatorLastName,
        operatorMobilePhone: data.operatorMobilePhone,
        operatorPhone: data.operatorPhone,
        receiptAddressBuildingFloorNumber:
          data.receiptAddressBuildingFloorNumber,
        receiptProvince: data.receiptProvince,
        receiptDistrict: data.receiptDistrict,
        receiptSubDistrict: data.receiptSubDistrict,
        receiptZipCode: data.receiptZipCode,
        receiptPhone: data.receiptPhone,
        receiptFax: data.receiptFax,
      };

      const customer = await customerService.createCustomer(customerData);

      res.status(201).json({
        message: "Registration successful",
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          isEmailConfirmed: user.isEmailConfirmed,
        },
        customer: {
          id: customer.id,
          companyNameEn: customer.companyNameEn,
          companyNameTh: customer.companyNameTh,
        },
      });
    } catch (error) {
      logger.error(`Registration error: ${error}`);

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
   * /api/v1/auth/login:
   *   post:
   *     summary: Authenticate user login
   *     description: Authenticate a user with email and password, returning a JWT token for accessing protected endpoints.
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginRequest'
   *           examples:
   *             customer_login:
   *               summary: Customer Login Example
   *               value:
   *                 email: "john.doe@starlab.com"
   *                 password: "SecurePassword123!"
   *             admin_login:
   *               summary: Admin Login Example
   *               value:
   *                 email: "admin@starlab.com"
   *                 password: "AdminPassword456!"
   *     responses:
   *       200:
   *         description: Login successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *             examples:
   *               customer_login_success:
   *                 summary: Customer Login Success
   *                 value:
   *                   success: true
   *                   message: "Login successful"
   *                   user:
   *                     id: "123e4567-e89b-12d3-a456-426614174000"
   *                     email: "john.doe@starlab.com"
   *                     role: "CUSTOMER"
   *                     isEmailConfirmed: true
   *                   customer:
   *                     id: "cust-123e4567-e89b-12d3-a456-426614174000"
   *                     companyNameEn: "StarLab Company Ltd."
   *                     operatorFirstName: "John"
   *                     operatorLastName: "Doe"
   *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *               admin_login_success:
   *                 summary: Admin Login Success
   *                 value:
   *                   success: true
   *                   message: "Login successful"
   *                   user:
   *                     id: "admin-123e4567-e89b-12d3-a456-426614174000"
   *                     email: "admin@starlab.com"
   *                     role: "ADMIN"
   *                     isEmailConfirmed: true
   *                   token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *       400:
   *         $ref: '#/components/responses/ValidationError'
   *       401:
   *         description: Invalid credentials
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid email or password"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      // Validate request body
      const validationResult = loginSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          message: "Validation failed",
          errors: validationResult.error.errors,
        });
        return;
      }

      const loginData: UserLoginData = validationResult.data;
      const result = await userService.authenticateUser(loginData);

      res.json({
        message: "Login successful",
        user: result.user,
        token: result.token,
      });
    } catch (error) {
      logger.error(`Login error: ${error}`);

      if (error instanceof Error && error.message === "Invalid credentials") {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /api/v1/auth/profile:
   *   get:
   *     summary: Get authenticated user profile
   *     description: Retrieve the profile information of the currently authenticated user. For customer users, includes associated customer data.
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserProfile'
   *             examples:
   *               customer_profile:
   *                 summary: Customer Profile Example
   *                 value:
   *                   success: true
   *                   user:
   *                     id: "123e4567-e89b-12d3-a456-426614174000"
   *                     email: "john.doe@starlab.com"
   *                     role: "CUSTOMER"
   *                     isEmailConfirmed: true
   *                     createdAt: "2024-01-15T10:30:00Z"
   *                     updatedAt: "2024-06-27T14:20:00Z"
   *                   customer:
   *                     id: "cust-123e4567-e89b-12d3-a456-426614174000"
   *                     companyNameEn: "StarLab Company Ltd."
   *                     companyNameTh: "บริษัท สตาร์แล็บ จำกัด"
   *                     operatorFirstName: "John"
   *                     operatorLastName: "Doe"
   *                     operatorMobilePhone: "+66-81-234-5678"
   *                     isActive: true
   *               admin_profile:
   *                 summary: Admin Profile Example
   *                 value:
   *                   success: true
   *                   user:
   *                     id: "admin-123e4567-e89b-12d3-a456-426614174000"
   *                     email: "admin@starlab.com"
   *                     role: "ADMIN"
   *                     isEmailConfirmed: true
   *                     createdAt: "2024-01-01T00:00:00Z"
   *                     updatedAt: "2024-06-27T14:20:00Z"
   *                   customer: null
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       404:
   *         description: User not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "User not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async profile(req: Request, res: Response): Promise<void> {
    try {
      // The user ID comes from the auth middleware
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const user = await userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      // If user is a customer, include customer data
      let customer = null;
      if (user.role === UserRole.CUSTOMER) {
        customer = await customerService.getCustomerByUserId(userId);
      }

      res.json({
        user,
        customer,
      });
    } catch (error) {
      logger.error(`Profile error: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /api/v1/auth/verify-email/{token}:
   *   get:
   *     summary: Verify user email address
   *     description: Verify a user's email address using the verification token sent during registration.
   *     tags: [Authentication]
   *     parameters:
   *       - in: path
   *         name: token
   *         required: true
   *         schema:
   *           type: string
   *         description: Email verification token
   *         example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.verification.token"
   *     responses:
   *       200:
   *         description: Email verified successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Email verified successfully"
   *             examples:
   *               verification_success:
   *                 summary: Email Verification Success
   *                 value:
   *                   success: true
   *                   message: "Email verified successfully"
   *       400:
   *         description: Invalid or expired verification token
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid or expired verification token"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { token } = req.params;

      if (!token) {
        res.status(400).json({ message: "Verification token is required" });
        return;
      }

      const success = await userService.verifyEmail(token);

      if (success) {
        res.json({ message: "Email verified successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
      }
    } catch (error) {
      logger.error(`Email verification error: ${error}`);

      if (
        error instanceof Error &&
        error.message === "Invalid verification token"
      ) {
        res
          .status(400)
          .json({ message: "Invalid or expired verification token" });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /api/v1/auth/change-password:
   *   post:
   *     summary: Change user password
   *     description: Change the password for the currently authenticated user. Requires the current password for verification.
   *     tags: [Authentication]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePasswordRequest'
   *           examples:
   *             password_change:
   *               summary: Password Change Example
   *               value:
   *                 currentPassword: "OldPassword123!"
   *                 newPassword: "NewSecurePassword456!"
   *     responses:
   *       200:
   *         description: Password changed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Password changed successfully"
   *             examples:
   *               password_change_success:
   *                 summary: Password Change Success
   *                 value:
   *                   success: true
   *                   message: "Password changed successfully"
   *       400:
   *         description: Bad request - validation error or incorrect current password
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *               examples:
   *                 incorrect_password:
   *                   summary: Incorrect Current Password
   *                   value:
   *                     success: false
   *                     message: "Current password is incorrect"
   *                 validation_error:
   *                   summary: Validation Error
   *                   value:
   *                     success: false
   *                     message: "New password must be at least 8 characters long"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      if (!currentPassword || !newPassword) {
        res
          .status(400)
          .json({ message: "Current password and new password are required" });
        return;
      }

      if (newPassword.length < 8) {
        res
          .status(400)
          .json({ message: "New password must be at least 8 characters long" });
        return;
      }

      const success = await userService.changePassword(
        userId,
        currentPassword,
        newPassword,
      );

      if (success) {
        res.json({ message: "Password changed successfully" });
      }
    } catch (error) {
      logger.error(`Change password error: ${error}`);

      if (
        error instanceof Error &&
        error.message === "Current password is incorrect"
      ) {
        res.status(400).json({ message: "Current password is incorrect" });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }
}
