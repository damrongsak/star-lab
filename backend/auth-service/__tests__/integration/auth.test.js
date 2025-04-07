"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const globals_1 = require("@jest/globals");
const app_1 = __importDefault(require("../../src/app")); // Import your Express app
const database_1 = __importDefault(require("../../src/config/database")); // Import database pool
const userModel_1 = __importDefault(require("../../src/models/userModel")); // Import UserModel
(0, globals_1.describe)("Auth API Integration Tests", () => {
  (0, globals_1.beforeAll)(async () => {
    // Before all tests, maybe run database migrations or seed data if needed
    // For this example, we'll just ensure the database is connected (implicitly via pool import)
  });
  (0, globals_1.afterEach)(async () => {
    // Clean up database after each test - TRUNCATE or DELETE test data (be careful in production!)
    await database_1.default.query(
      "TRUNCATE TABLE users RESTART IDENTITY CASCADE;",
    ); // Clear user data after each test
  });
  (0, globals_1.afterAll)(async () => {
    // After all tests, close database connection pool
    await database_1.default.end();
  });
  (0, globals_1.describe)("/auth/register", () => {
    (0, globals_1.it)("should register a new user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      const response = await (0, supertest_1.default)(app_1.default)
        .post("/auth/register")
        .send(userData)
        .expect(201); // Expect 201 Created status
      (0, globals_1.expect)(response.body.message).toBe(
        "User registered successfully",
      );
      (0, globals_1.expect)(response.body.user).toHaveProperty("id");
      (0, globals_1.expect)(response.body.user.username).toBe(
        userData.username,
      );
      (0, globals_1.expect)(response.body.user.email).toBe(userData.email);
      // Verify user exists in the database
      const userInDb = await userModel_1.default.findUserByEmail({
        email: userData.email,
      });
      (0, globals_1.expect)(userInDb).toBeDefined();
      (0, globals_1.expect)(userInDb).toBeDefined();
      if (userInDb) {
        (0, globals_1.expect)(userInDb.username).toBe(userData.username);
      }
      if (userInDb) {
        (0, globals_1.expect)(userInDb.email).toBe(userData.email);
      }
      // Don't check password in integration tests - focus on registration flow
    });
    (0, globals_1.it)(
      "should return 400 if registration data is invalid (missing fields)",
      async () => {
        const invalidUserData = { username: "testuser" }; // Missing email and password
        const response = await (0, supertest_1.default)(app_1.default)
          .post("/auth/register")
          .send(invalidUserData)
          .expect(400); // Expect 400 Bad Request
        (0, globals_1.expect)(response.body.error).toBe(
          "All fields are required for registration.",
        );
      },
    );
    (0, globals_1.it)(
      "should return 400 if username or email already exists",
      async () => {
        // First, register a user to cause a conflict
        const userData = {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        };
        await (0, supertest_1.default)(app_1.default)
          .post("/auth/register")
          .send(userData)
          .expect(201);
        // Attempt to register the same user again
        const conflictResponse = await (0, supertest_1.default)(app_1.default)
          .post("/auth/register")
          .send(userData)
          .expect(400); // Expect 400 Bad Request
        (0, globals_1.expect)(conflictResponse.body.error).toBe(
          "Username or email already exists.",
        );
      },
    );
  });
  (0, globals_1.describe)("/auth/login", () => {
    (0, globals_1.it)(
      "should login an existing user successfully and return token",
      async () => {
        // First, register a user for login testing
        const userData = {
          username: "testuser",
          email: "test@example.com",
          password: "password123",
        };
        await (0, supertest_1.default)(app_1.default)
          .post("/auth/register")
          .send(userData)
          .expect(201);
        const loginData = {
          email: userData.email,
          password: userData.password,
        };
        const loginResponse = await (0, supertest_1.default)(app_1.default)
          .post("/auth/login")
          .send(loginData)
          .expect(200); // Expect 200 OK for successful login
        (0, globals_1.expect)(loginResponse.body.message).toBe(
          "Login successful",
        );
        (0, globals_1.expect)(loginResponse.body).toHaveProperty("token");
        (0, globals_1.expect)(loginResponse.body.user).toHaveProperty("id");
        (0, globals_1.expect)(loginResponse.body.user.username).toBe(
          userData.username,
        );
        (0, globals_1.expect)(loginResponse.body.user.email).toBe(
          userData.email,
        );
      },
    );
    (0, globals_1.it)(
      "should return 401 for invalid login credentials",
      async () => {
        const loginDataInvalid = {
          email: "test@example.com",
          password: "wrongPassword",
        }; // Incorrect password
        const loginResponseInvalid = await (0, supertest_1.default)(
          app_1.default,
        )
          .post("/auth/login")
          .send(loginDataInvalid)
          .expect(401); // Expect 401 Unauthorized for invalid credentials
        (0, globals_1.expect)(loginResponseInvalid.body.error).toBe(
          "Invalid credentials.",
        );
      },
    );
  });
});
//# sourceMappingURL=auth.test.js.map
