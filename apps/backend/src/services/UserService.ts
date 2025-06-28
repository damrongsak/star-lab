import { PrismaClient, User, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export interface CreateUserData {
  email: string;
  password: string;
  role: UserRole;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface UpdateUserData {
  email?: string;
  role?: UserRole;
  isEmailConfirmed?: boolean;
}

export class UserService {
  async createUser(
    userData: CreateUserData,
  ): Promise<Omit<User, "passwordHash">> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(userData.password, 12);

      // Generate verification token
      const verificationToken = uuidv4();

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          passwordHash,
          role: userData.role,
          verificationToken,
          isEmailConfirmed: false,
        },
      });

      // Remove password hash from response
      const { passwordHash: _, ...userWithoutPassword } = user;

      logger.info(`User created: ${user.email}`);
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      throw error;
    }
  }

  async authenticateUser(
    loginData: UserLoginData,
  ): Promise<{ user: Omit<User, "passwordHash">; token: string }> {
    try {
      const user = await prisma.user.findUnique({
        where: { email: loginData.email },
      });

      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isPasswordValid = await bcrypt.compare(
        loginData.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new Error("Invalid credentials");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      const { passwordHash: _, ...userWithoutPassword } = user;

      logger.info(`User authenticated: ${user.email}`);
      return { user: userWithoutPassword, token };
    } catch (error) {
      logger.error(`Error authenticating user: ${error}`);
      throw error;
    }
  }

  async getUserById(id: string): Promise<Omit<User, "passwordHash"> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          customer: true,
          projects: true,
        },
      });

      if (!user) {
        return null;
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Error getting user by ID: ${error}`);
      throw error;
    }
  }

  async getUserByEmail(
    email: string,
  ): Promise<Omit<User, "passwordHash"> | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return null;
      }

      const { passwordHash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Error getting user by email: ${error}`);
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateData: UpdateUserData,
  ): Promise<Omit<User, "passwordHash">> {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      const { passwordHash: _, ...userWithoutPassword } = user;

      logger.info(`User updated: ${user.email}`);
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      throw error;
    }
  }

  async changePassword(
    id: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isCurrentPasswordValid = await bcrypt.compare(
        currentPassword,
        user.passwordHash,
      );
      if (!isCurrentPasswordValid) {
        throw new Error("Current password is incorrect");
      }

      const newPasswordHash = await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: { id },
        data: { passwordHash: newPasswordHash },
      });

      logger.info(`Password changed for user: ${user.email}`);
      return true;
    } catch (error) {
      logger.error(`Error changing password: ${error}`);
      throw error;
    }
  }

  async verifyEmail(verificationToken: string): Promise<boolean> {
    try {
      const user = await prisma.user.findUnique({
        where: { verificationToken },
      });

      if (!user) {
        throw new Error("Invalid verification token");
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          isEmailConfirmed: true,
          verificationToken: null,
        },
      });

      logger.info(`Email verified for user: ${user.email}`);
      return true;
    } catch (error) {
      logger.error(`Error verifying email: ${error}`);
      throw error;
    }
  }

  async getAllUsers(role?: UserRole): Promise<Omit<User, "passwordHash">[]> {
    try {
      const users = await prisma.user.findMany({
        where: role ? { role } : undefined,
        include: {
          customer: true,
        },
      });

      return users.map((user) => {
        const { passwordHash: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      logger.error(`Error getting all users: ${error}`);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id },
      });

      logger.info(`User deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      throw error;
    }
  }
}
