// Mock all dependencies first, before any imports
const mockPrismaUser = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findMany: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: mockPrismaUser,
  })),
  UserRole: {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    MANAGER: "MANAGER",
    EMPLOYEE: "EMPLOYEE",
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Now import after all mocks are set up
import { UserService } from "../services/UserService";
import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

describe("UserService", () => {
  let userService: UserService;

  const sampleUser = {
    id: "user-123",
    email: "test@example.com",
    passwordHash: "hashed-password",
    role: UserRole.CUSTOMER,
    verificationToken: "verification-token",
    isEmailConfirmed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe("createUser", () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
      role: UserRole.CUSTOMER,
    };

    it("should create a user successfully", async () => {
      // Setup mocks
      mockPrismaUser.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
      (uuidv4 as jest.Mock).mockReturnValue("verification-token");
      mockPrismaUser.create.mockResolvedValue(sampleUser);

      // Execute
      const result = await userService.createUser(userData);

      // Verify
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          passwordHash: "hashed-password",
          role: userData.role,
          verificationToken: "verification-token",
          isEmailConfirmed: false,
        },
      });

      // Check result doesn't include password
      expect(result).not.toHaveProperty("passwordHash");
      expect(result.email).toBe(userData.email);
      expect(logger.info).toHaveBeenCalledWith(
        "User created: test@example.com",
      );
    });

    it("should throw error if user already exists", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(sampleUser);

      await expect(userService.createUser(userData)).rejects.toThrow(
        "User with this email already exists",
      );

      expect(mockPrismaUser.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return user without password hash", async () => {
      const userWithRelations = {
        ...sampleUser,
        customer: null,
        projects: [],
      };
      mockPrismaUser.findUnique.mockResolvedValue(userWithRelations);

      const result = await userService.getUserById("user-123");

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: "user-123" },
        include: {
          customer: true,
          projects: true,
        },
      });

      expect(result).not.toHaveProperty("passwordHash");
      expect(result?.id).toBe("user-123");
    });

    it("should return null if user not found", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await userService.getUserById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("deleteUser", () => {
    it("should delete user successfully", async () => {
      mockPrismaUser.delete.mockResolvedValue(sampleUser);

      const result = await userService.deleteUser("user-123");

      expect(mockPrismaUser.delete).toHaveBeenCalledWith({
        where: { id: "user-123" },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith("User deleted: user-123");
    });

    it("should handle delete errors", async () => {
      const error = new Error("User not found");
      mockPrismaUser.delete.mockRejectedValue(error);

      await expect(userService.deleteUser("nonexistent")).rejects.toThrow(
        "User not found",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("authenticateUser", () => {
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    it("should authenticate user successfully", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(sampleUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

      const result = await userService.authenticateUser(loginData);

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        sampleUser.passwordHash,
      );
      expect(jwt.sign).toHaveBeenCalled();
      expect(result.token).toBe("jwt-token");
      expect(result.user).not.toHaveProperty("passwordHash");
    });

    it("should throw error for invalid credentials", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(userService.authenticateUser(loginData)).rejects.toThrow(
        "Invalid credentials",
      );
    });
  });
});
