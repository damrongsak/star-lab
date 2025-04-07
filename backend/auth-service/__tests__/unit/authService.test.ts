import AuthService from "../../src/services/authService";
import { jest, describe, it, expect, beforeEach } from "@jest/globals";
import UserModel from "../../src/models/userModel";
// Removed unused import
import bcrypt from "bcrypt";
import jwtUtils from "../../src/utils/jwtUtils";

interface CreateUserResult {
  id: number;
  username: string;
  email: string;
}

jest.mock("../../src/models/userModel"); // Mock UserModel for unit tests
jest.mock("bcrypt"); // Mock bcrypt
jest.mock("../../src/utils/jwtUtils"); // Mock jwtUtils

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mock calls before each test
  });

  describe("registerUser", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      const hashedPassword = "hashedPassword";
      const mockCreatedUser = {
        id: 1,
        username: userData.username,
        email: userData.email,
      };

      (
        UserModel.createUser as unknown as jest.MockedFunction<
          (
            username: string,
            email: string,
            password: string,
          ) => Promise<CreateUserResult>
        >
      ).mockResolvedValue(mockCreatedUser); // Mock successful user creation
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword); // Mock bcrypt.hash

      const newUser = await AuthService.registerUser(
        userData.username,
        userData.email,
        userData.password,
      );

      expect(UserModel.createUser).toHaveBeenCalledWith(
        userData.username,
        userData.email,
        hashedPassword,
      );
      expect(newUser).toEqual(mockCreatedUser);
    });

    it("should throw an error if username or email already exists", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      class CustomError extends Error {
        code: string;
        constructor(message: string, code: string) {
          super(message);
          this.code = code;
        }
      }

      const mockError = new CustomError(
        "Username or email already exists.",
        "23505",
      ); // Simulate unique violation error code from PostgreSQL

      (
        UserModel.createUser as jest.MockedFunction<typeof UserModel.createUser>
      ).mockRejectedValue(mockError); // Mock UserModel to reject with duplicate error

      await expect(
        AuthService.registerUser(
          userData.username,
          userData.email,
          userData.password,
        ),
      ).rejects.toThrow("Username or email already exists.");
    });

    it("should throw an error if password is too short", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "short",
      }; // Short password

      await expect(
        AuthService.registerUser(
          userData.username,
          userData.email,
          userData.password,
        ),
      ).rejects.toThrow("Password must be at least 6 characters long.");
    });
  });

  describe("loginUser", () => {
    it("should log in an existing user successfully and return token", async () => {
      const userData = { email: "test@example.com", password: "password123" };
      const mockUser = {
        id: 1,
        username: "testuser",
        email: userData.email,
        password: "hashedPassword",
      }; // Password is hashed in DB
      const mockToken = "mock.jwt.token";

      (
        UserModel.findUserByEmail as jest.MockedFunction<
          typeof UserModel.findUserByEmail
        >
      ).mockResolvedValue(mockUser); // Mock finding user by email
      (
        bcrypt.compare as unknown as jest.MockedFunction<
          (data: string, encrypted: string) => Promise<boolean>
        >
      ).mockResolvedValue(true); // Mock password comparison success
      (
        jwtUtils.generateToken as jest.MockedFunction<
          typeof jwtUtils.generateToken
        >
      ).mockReturnValue(mockToken); // Mock token generation

      const loginResult = await AuthService.loginUser(
        userData.email,
        userData.password,
      );

      expect(UserModel.findUserByEmail).toHaveBeenCalledWith(userData.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        userData.password,
        mockUser.password,
      );
      expect(jwtUtils.generateToken).toHaveBeenCalled();
      expect(loginResult).toEqual({
        token: mockToken,
        user: { id: 1, username: "testuser", email: userData.email },
      });
    });

    it("should throw an error if user not found", async () => {
      const userData = {
        email: "nonexistent@example.com",
        password: "password123",
      };
      (
        UserModel.findUserByEmail as jest.MockedFunction<
          typeof UserModel.findUserByEmail
        >
      ).mockResolvedValue(undefined); // Mock user not found

      await expect(
        AuthService.loginUser(userData.email, userData.password),
      ).rejects.toThrow("Invalid credentials.");
    });

    it("should throw an error if password does not match", async () => {
      const userData = { email: "test@example.com", password: "wrongPassword" };
      const mockUser = {
        id: 1,
        username: "testuser",
        email: userData.email,
        password: "hashedPassword",
      };

      (
        UserModel.findUserByEmail as jest.MockedFunction<
          typeof UserModel.findUserByEmail
        >
      ).mockResolvedValue(mockUser); // Mock finding user
      (
        bcrypt.compare as unknown as jest.MockedFunction<
          (data: string, encrypted: string) => Promise<boolean>
        >
      ).mockResolvedValue(false); // Mock password comparison failure

      await expect(
        AuthService.loginUser(userData.email, userData.password),
      ).rejects.toThrow("Invalid credentials.");
    });
  });

  // Add more unit tests for other AuthService methods if you have them
});
