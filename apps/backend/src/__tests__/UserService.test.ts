// Mock all dependencies first, before any imports
const mockPrismaUser = {
  findUnique: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  findMany: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  ...jest.requireActual("@prisma/client"),
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

  describe("getAllUsers", () => {
    const mockUserProfiles = [
      {
        id: "user-1",
        email: "doctor15@example.com",
        passwordHash: "hash",
        role: "DOCTOR" as any,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: null,
        userProfile: {
          firstName: "Doctor 15",
          lastName: "User",
          phoneNumber: null,
        },
      },
      {
        id: "user-2",
        email: "tech@example.com",
        passwordHash: "hash",
        role: "TECHNICIAN" as any,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: null,
        userProfile: {
          firstName: "John",
          lastName: "Technician",
          phoneNumber: null,
        },
      },
      {
        id: "user-3",
        email: "customer@example.com",
        passwordHash: "hash",
        role: UserRole.CUSTOMER,
        isEmailConfirmed: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        customer: {},
        userProfile: {
          firstName: "Customer",
          lastName: "User",
          phoneNumber: null,
        },
      },
    ];

    beforeEach(() => {
      // Setup default successful responses
      mockPrismaUser.findMany.mockResolvedValue([]);
      (mockPrismaUser as any).count = jest.fn().mockResolvedValue(0);
    });

    it("should search by multi-word name successfully", async () => {
      const searchResults = [mockUserProfiles[0]];
      mockPrismaUser.findMany.mockResolvedValue(searchResults);
      (mockPrismaUser as any).count.mockResolvedValue(1);

      const result = await userService.getAllUsers(
        { search: "Doctor 15 User" },
        1,
        10,
      );

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaUser.findMany.mock.calls[0][0];
      
      // Verify search conditions include word-based search
      expect(callArgs.where.OR).toBeDefined();
      expect(callArgs.where.OR.length).toBeGreaterThan(3); // email + words for firstName/lastName
      
      expect(result.users).toHaveLength(1);
      expect(result.users[0].id).toBe("user-1");
      expect(result.total).toBe(1);
    });

    it("should search by single word in firstName", async () => {
      const searchResults = [mockUserProfiles[0]];
      mockPrismaUser.findMany.mockResolvedValue(searchResults);
      (mockPrismaUser as any).count.mockResolvedValue(1);

      const result = await userService.getAllUsers({ search: "Doctor" }, 1, 10);

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaUser.findMany.mock.calls[0][0];
      
      // Should create OR conditions for email and userProfile.firstName/lastName
      expect(callArgs.where.OR).toBeDefined();
      expect(result.users).toHaveLength(1);
    });

    it("should exclude customers when excludeRole is CUSTOMER", async () => {
      const nonCustomers = [mockUserProfiles[0], mockUserProfiles[1]];
      mockPrismaUser.findMany.mockResolvedValue(nonCustomers);
      (mockPrismaUser as any).count.mockResolvedValue(2);

      const result = await userService.getAllUsers(
        { excludeRole: UserRole.CUSTOMER },
        1,
        10,
      );

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaUser.findMany.mock.calls[0][0];
      
      // Verify excludeRole creates 'not' condition
      expect(callArgs.where.role).toEqual({ not: UserRole.CUSTOMER });
      expect(result.users).toHaveLength(2);
      expect(result.total).toBe(2);
    });

    it("should filter by specific role", async () => {
      const doctors = [mockUserProfiles[0]];
      mockPrismaUser.findMany.mockResolvedValue(doctors);
      (mockPrismaUser as any).count.mockResolvedValue(1);

      const result = await userService.getAllUsers({ role: "DOCTOR" }, 1, 10);

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaUser.findMany.mock.calls[0][0];
      
      // Verify role filter is applied
      expect(callArgs.where.role).toBe("DOCTOR");
      expect(result.users).toHaveLength(1);
    });

    it("should handle pagination correctly", async () => {
      const allUsers = mockUserProfiles.slice(0, 2);
      mockPrismaUser.findMany.mockResolvedValue(allUsers);
      (mockPrismaUser as any).count.mockResolvedValue(10);

      const result = await userService.getAllUsers({}, 2, 2);

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaUser.findMany.mock.calls[0][0];
      
      // Verify pagination: page 2, limit 2 = skip 2
      expect(callArgs.skip).toBe(2);
      expect(callArgs.take).toBe(2);
      expect(result.total).toBe(10);
    });

    it("should not include passwordHash in results", async () => {
      mockPrismaUser.findMany.mockResolvedValue([mockUserProfiles[0]]);
      (mockPrismaUser as any).count.mockResolvedValue(1);

      const result = await userService.getAllUsers({}, 1, 10);

      expect(result.users[0]).not.toHaveProperty("passwordHash");
      expect(result.users[0]).toHaveProperty("email");
      expect(result.users[0]).toHaveProperty("role");
    });

    it("should combine search with excludeRole filter", async () => {
      const searchResults = [mockUserProfiles[0]];
      mockPrismaUser.findMany.mockResolvedValue(searchResults);
      (mockPrismaUser as any).count.mockResolvedValue(1);

      const result = await userService.getAllUsers(
        { search: "Doctor", excludeRole: UserRole.CUSTOMER },
        1,
        10,
      );

      expect(mockPrismaUser.findMany).toHaveBeenCalled();
      const callArgs = mockPrismaUser.findMany.mock.calls[0][0];
      
      // Both search OR conditions and excludeRole should be present
      expect(callArgs.where.OR).toBeDefined();
      expect(callArgs.where.role).toEqual({ not: UserRole.CUSTOMER });
      expect(result.users).toHaveLength(1);
    });
  });
});
