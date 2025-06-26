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
