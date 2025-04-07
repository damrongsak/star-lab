import request from "supertest";
import {
  describe,
  it,
  expect,
  beforeAll,
  afterEach,
  afterAll,
} from "@jest/globals";
import app from "../../src/app"; // Import your Express app
import pool from "../../src/config/database"; // Import database pool
import UserModel from "../../src/models/userModel"; // Import UserModel

describe("Auth API Integration Tests", () => {
  beforeAll(async () => {
    // Before all tests, maybe run database migrations or seed data if needed
    // For this example, we'll just ensure the database is connected (implicitly via pool import)
  });

  afterEach(async () => {
    // Clean up database after each test - TRUNCATE or DELETE test data (be careful in production!)
    await pool.query("TRUNCATE TABLE users RESTART IDENTITY CASCADE;"); // Clear user data after each test
  });

  afterAll(async () => {
    // After all tests, close database connection pool
    await pool.end();
  });

  describe("/auth/register", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      const response = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(201); // Expect 201 Created status

      expect(response.body.message).toBe("User registered successfully");
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.username).toBe(userData.username);
      expect(response.body.user.email).toBe(userData.email);

      // Verify user exists in the database
      const userInDb = await UserModel.findUserByEmail({
        email: userData.email,
      });
      expect(userInDb).toBeDefined();
      expect(userInDb).toBeDefined();
      if (userInDb) {
        expect(userInDb.username).toBe(userData.username);
      }
      if (userInDb) {
        expect(userInDb.email).toBe(userData.email);
      }
      // Don't check password in integration tests - focus on registration flow
    });

    it("should return 400 if registration data is invalid (missing fields)", async () => {
      const invalidUserData = { username: "testuser" }; // Missing email and password
      const response = await request(app)
        .post("/auth/register")
        .send(invalidUserData)
        .expect(400); // Expect 400 Bad Request

      expect(response.body.error).toBe(
        "All fields are required for registration.",
      );
    });

    it("should return 400 if username or email already exists", async () => {
      // First, register a user to cause a conflict
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      await request(app).post("/auth/register").send(userData).expect(201);

      // Attempt to register the same user again
      const conflictResponse = await request(app)
        .post("/auth/register")
        .send(userData)
        .expect(400); // Expect 400 Bad Request

      expect(conflictResponse.body.error).toBe(
        "Username or email already exists.",
      );
    });
  });

  describe("/auth/login", () => {
    it("should login an existing user successfully and return token", async () => {
      // First, register a user for login testing
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };
      await request(app).post("/auth/register").send(userData).expect(201);

      const loginData = { email: userData.email, password: userData.password };
      const loginResponse = await request(app)
        .post("/auth/login")
        .send(loginData)
        .expect(200); // Expect 200 OK for successful login

      expect(loginResponse.body.message).toBe("Login successful");
      expect(loginResponse.body).toHaveProperty("token");
      expect(loginResponse.body.user).toHaveProperty("id");
      expect(loginResponse.body.user.username).toBe(userData.username);
      expect(loginResponse.body.user.email).toBe(userData.email);
    });

    it("should return 401 for invalid login credentials", async () => {
      const loginDataInvalid = {
        email: "test@example.com",
        password: "wrongPassword",
      }; // Incorrect password

      const loginResponseInvalid = await request(app)
        .post("/auth/login")
        .send(loginDataInvalid)
        .expect(401); // Expect 401 Unauthorized for invalid credentials

      expect(loginResponseInvalid.body.error).toBe("Invalid credentials.");
    });
  });
});
