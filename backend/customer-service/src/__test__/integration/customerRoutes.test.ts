// backend/customer-service/src/__tests__/integration/customerRoutes.test.ts
import request from "supertest";
import app from "../../app"; // Import your Express app
import { connectRedis, redisClient } from "../../utils/redisClient";
import pool from "../../config/database"; // Import your database pool

describe("Customer Routes Integration Tests", () => {
  beforeAll(async () => {
    await connectRedis(); // Connect to Redis before tests
  });

  afterAll(async () => {
    if (redisClient) {
      await redisClient.quit(); // Disconnect Redis after tests
    }
    await pool.end(); // Close database pool after tests
  });

  beforeEach(async () => {
    // Clean up database and cache before each test if needed
    await pool.query("DELETE FROM customers"); // Clear customers table
    if (redisClient) {
      await redisClient.flushDb(); // Clear Redis cache
    }
  });

  describe("POST /admin/customers", () => {
    it("should create a new customer", async () => {
      const customerData = {
        firstName: "Integration",
        lastName: "Test",
        email: "integration.test@example.com",
      };
      const response = await request(app)
        .post("/admin/customers")
        .send(customerData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "Customer created successfully",
      );
      expect(response.body).toHaveProperty("customer");
      expect(response.body.customer.firstName).toBe(customerData.firstName);
      // ... other assertions on the created customer
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/admin/customers").send({}); // Sending empty body

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /admin/customers", () => {
    it("should return a list of customers", async () => {
      // Assuming you have some customers in the database (you might need to seed data for integration tests)
      // ... setup database with test customers ...

      const response = await request(app).get("/admin/customers");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      // ... assertions on the list of customers ...
    });
  });

  describe("GET /admin/customers/:id", () => {
    it("should return a customer by ID", async () => {
      // ... create a customer in the database first ...
      const createdCustomerResponse = await request(app)
        .post("/admin/customers")
        .send({
          firstName: "Test",
          lastName: "Customer",
          email: "test.customer@example.com",
        });
      const customerId = createdCustomerResponse.body.customer.id;

      const response = await request(app).get(`/admin/customers/${customerId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", customerId);
      expect(response.body).toHaveProperty("firstName", "Test");
      // ... other assertions ...
    });

    it("should return 404 if customer not found", async () => {
      const response = await request(app).get("/admin/customers/9999"); // Non-existent ID
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Customer not found");
    });
  });

  // Add similar integration tests for PUT /admin/customers/:id and DELETE /admin/customers/:id
  // ...
});
