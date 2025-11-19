import request from "supertest";
import express, { Router } from "express";
import { invoiceRoutes } from "../routes/invoice";
import customerRoutes from "../routes/customers";
import { UserRole } from "@prisma/client";

// Mock Authentication Middleware
const mockAuthMiddleware = (role: UserRole) => (req: any, res: any, next: any) => {
  req.user = {
    userId: "test-user-id",
    email: "test@example.com",
    role: role,
  };
  next();
};

// Mock Dependencies
jest.mock("../controllers/InvoiceController", () => ({
  InvoiceController: jest.fn().mockImplementation(() => ({
    createInvoice: jest.fn((req, res) => res.status(201).json({ success: true })),
    getInvoices: jest.fn((req, res) => res.status(200).json({ success: true })),
    getStatistics: jest.fn((req, res) => res.status(200).json({ success: true })),
    searchInvoices: jest.fn((req, res) => res.status(200).json({ success: true })),
    getInvoiceByNumber: jest.fn((req, res) => res.status(200).json({ success: true })),
    getInvoice: jest.fn((req, res) => res.status(200).json({ success: true })),
    updateInvoice: jest.fn((req, res) => res.status(200).json({ success: true })),
    markAsPaid: jest.fn((req, res) => res.status(200).json({ success: true })),
  })),
}));

jest.mock("../controllers/CustomerController", () => ({
  CustomerController: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn((req, res) => res.status(200).json({ success: true })),
    updateProfile: jest.fn((req, res) => res.status(200).json({ success: true })),
    getStatistics: jest.fn((req, res) => res.status(200).json({ success: true })),
    getAllCustomers: jest.fn((req, res) => res.status(200).json({ success: true })),
    searchCustomers: jest.fn((req, res) => res.status(200).json({ success: true })),
    getCustomerById: jest.fn((req, res) => res.status(200).json({ success: true })),
    deleteCustomer: jest.fn((req, res) => res.status(200).json({ success: true })),
  })),
}));

// We need to override the actual routes to inject our mocked auth middleware
// Since we can't easily inject middleware into imported routers, we'll manually construct the app
// and use the `requireRole` logic which we want to test.
// However, unit testing `rbacMiddleware` directly is cleaner. 
// BUT, the prompt asked for integration tests of the *route protection*.
// So we will verify if the routes behave as expected when `req.user.role` is set.

describe("Security Integration - Route Protection", () => {
  // We'll create a simple express app and mount the routes.
  // We need to mock the `authMiddleware` used INSIDE the route files.
  // Since mocking nested imports is tricky, we'll focus on the logic we know:
  // The route files import `authMiddleware` and `requireRole`.
  
  // Strategy: We will mock `../middleware/authMiddleware` to pass through,
  // and we rely on the actual `requireRole` implementation which is imported by the routes.
  // We will effectively test if the routes *have* the middleware attached.
  
  // Actually, since we already modified the code, we can just scan the files or 
  // trust the manual verification. But a programmatic test is better.
  
  // Let's assume we have a helper to setup the app with specific user roles
});

// Alternative Strategy: Unit test the route configuration?
// Or better, test the `rbacMiddleware` again? We already have `rbacMiddleware.test.ts`.
// What's missing is confirming `invoiceRoutes` actually USES it.

// Let's try to mock the middlewares and see if they are called.
jest.mock("../middleware/authMiddleware", () => ({
  authMiddleware: (req: any, res: any, next: any) => {
    req.user = req.user || { userId: "default", role: UserRole.CUSTOMER }; // Default to CUSTOMER
    next();
  }
}));

// We need to reset modules to ensure fresh imports of routes
beforeEach(() => {
  jest.resetModules();
});

describe("Route Protection Rules", () => {
  let app: express.Application;

  const setupApp = (role: UserRole) => {
    const app = express();
    app.use(express.json());
    
    // Middleware to inject user role
    app.use((req, res, next) => {
      (req as any).user = { userId: "123", role };
      next();
    });

    // Re-require routes to pick up mocks
    const { invoiceRoutes } = require("../routes/invoice");
    const customerRoutes = require("../routes/customers").default;

    app.use("/api/v1/invoices", invoiceRoutes);
    app.use("/api/v1/customers", customerRoutes);
    
    return app;
  };

  describe("Invoice Routes", () => {
    it("GET /statistics should be forbidden for CUSTOMER", async () => {
      app = setupApp(UserRole.CUSTOMER);
      const res = await request(app).get("/api/v1/invoices/statistics");
      expect(res.status).toBe(403);
    });

    it("GET /statistics should be allowed for ADMIN", async () => {
      app = setupApp(UserRole.ADMIN);
      const res = await request(app).get("/api/v1/invoices/statistics");
      expect(res.status).not.toBe(403);
      expect(res.status).toBe(200); // Mock controller returns 200
    });

    it("GET /search should be forbidden for CUSTOMER", async () => {
      app = setupApp(UserRole.CUSTOMER);
      const res = await request(app).get("/api/v1/invoices/search?q=test");
      expect(res.status).toBe(403);
    });

    it("GET /search should be allowed for ADMIN", async () => {
      app = setupApp(UserRole.ADMIN);
      const res = await request(app).get("/api/v1/invoices/search?q=test");
      expect(res.status).not.toBe(403);
    });
  });

  describe("Customer Routes", () => {
    it("GET /statistics should be forbidden for CUSTOMER", async () => {
      app = setupApp(UserRole.CUSTOMER);
      const res = await request(app).get("/api/v1/customers/statistics");
      expect(res.status).toBe(403);
    });

     it("GET / should be forbidden for CUSTOMER", async () => {
      app = setupApp(UserRole.CUSTOMER);
      const res = await request(app).get("/api/v1/customers");
      expect(res.status).toBe(403);
    });

    it("GET /profile should be allowed for CUSTOMER", async () => {
      app = setupApp(UserRole.CUSTOMER);
      const res = await request(app).get("/api/v1/customers/profile");
      // Should be allowed by RBAC, controller mock returns 200
      expect(res.status).toBe(200); 
    });
  });
});
