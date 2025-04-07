"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const authService_1 = __importDefault(
  require("../../src/services/authService"),
);
const globals_1 = require("@jest/globals");
const userModel_1 = __importDefault(require("../../src/models/userModel"));
// Removed unused import
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwtUtils_1 = __importDefault(require("../../src/utils/jwtUtils"));
globals_1.jest.mock("../../src/models/userModel"); // Mock UserModel for unit tests
globals_1.jest.mock("bcrypt"); // Mock bcrypt
globals_1.jest.mock("../../src/utils/jwtUtils"); // Mock jwtUtils
(0, globals_1.describe)("AuthService", () => {
  (0, globals_1.beforeEach)(() => {
    globals_1.jest.clearAllMocks(); // Clear mock calls before each test
  });
  (0, globals_1.describe)("registerUser", () => {
    (0, globals_1.it)("should register a new user successfully", async () => {
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
      userModel_1.default.createUser.mockResolvedValue(mockCreatedUser); // Mock successful user creation
      bcrypt_1.default.hash.mockResolvedValue(hashedPassword); // Mock bcrypt.hash
      const newUser = await authService_1.default.registerUser(
        userData.username,
        userData.email,
        userData.password,
      );
      (0, globals_1.expect)(
        userModel_1.default.createUser,
      ).toHaveBeenCalledWith(userData.username, userData.email, hashedPassword);
      (0, globals_1.expect)(newUser).toEqual(mockCreatedUser);
    });
    (0, globals_1.it)(
      "should throw an error if username or email already exists",
      async () => {
        const userData = {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        };
        class CustomError extends Error {
          code;
          constructor(message, code) {
            super(message);
            this.code = code;
          }
        }
        const mockError = new CustomError(
          "Username or email already exists.",
          "23505",
        ); // Simulate unique violation error code from PostgreSQL
        userModel_1.default.createUser.mockRejectedValue(mockError); // Mock UserModel to reject with duplicate error
        await (0, globals_1.expect)(
          authService_1.default.registerUser(
            userData.username,
            userData.email,
            userData.password,
          ),
        ).rejects.toThrow("Username or email already exists.");
      },
    );
    (0, globals_1.it)(
      "should throw an error if password is too short",
      async () => {
        const userData = {
          username: "testuser",
          email: "test@example.com",
          password: "short",
        }; // Short password
        await (0, globals_1.expect)(
          authService_1.default.registerUser(
            userData.username,
            userData.email,
            userData.password,
          ),
        ).rejects.toThrow("Password must be at least 6 characters long.");
      },
    );
  });
  (0, globals_1.describe)("loginUser", () => {
    (0, globals_1.it)(
      "should log in an existing user successfully and return token",
      async () => {
        const userData = { email: "test@example.com", password: "password123" };
        const mockUser = {
          id: 1,
          username: "testuser",
          email: userData.email,
          password: "hashedPassword",
        }; // Password is hashed in DB
        const mockToken = "mock.jwt.token";
        userModel_1.default.findUserByEmail.mockResolvedValue(mockUser); // Mock finding user by email
        bcrypt_1.default.compare.mockResolvedValue(true); // Mock password comparison success
        jwtUtils_1.default.generateToken.mockReturnValue(mockToken); // Mock token generation
        const loginResult = await authService_1.default.loginUser(
          userData.email,
          userData.password,
        );
        (0, globals_1.expect)(
          userModel_1.default.findUserByEmail,
        ).toHaveBeenCalledWith(userData.email);
        (0, globals_1.expect)(bcrypt_1.default.compare).toHaveBeenCalledWith(
          userData.password,
          mockUser.password,
        );
        (0, globals_1.expect)(
          jwtUtils_1.default.generateToken,
        ).toHaveBeenCalled();
        (0, globals_1.expect)(loginResult).toEqual({
          token: mockToken,
          user: { id: 1, username: "testuser", email: userData.email },
        });
      },
    );
    (0, globals_1.it)("should throw an error if user not found", async () => {
      const userData = {
        email: "nonexistent@example.com",
        password: "password123",
      };
      userModel_1.default.findUserByEmail.mockResolvedValue(undefined); // Mock user not found
      await (0, globals_1.expect)(
        authService_1.default.loginUser(userData.email, userData.password),
      ).rejects.toThrow("Invalid credentials.");
    });
    (0, globals_1.it)(
      "should throw an error if password does not match",
      async () => {
        const userData = {
          email: "test@example.com",
          password: "wrongPassword",
        };
        const mockUser = {
          id: 1,
          username: "testuser",
          email: userData.email,
          password: "hashedPassword",
        };
        userModel_1.default.findUserByEmail.mockResolvedValue(mockUser); // Mock finding user
        bcrypt_1.default.compare.mockResolvedValue(false); // Mock password comparison failure
        await (0, globals_1.expect)(
          authService_1.default.loginUser(userData.email, userData.password),
        ).rejects.toThrow("Invalid credentials.");
      },
    );
  });
  // Add more unit tests for other AuthService methods if you have them
});
//# sourceMappingURL=authService.test.js.map
