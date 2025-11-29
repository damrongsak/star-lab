import type { Router } from "express";
import { invoiceRoutes } from "../routes/invoice";
import customerRoutes from "../routes/customers";

// Define UserRole locally to avoid import issues with mocks
const UserRole = {
  CUSTOMER: "CUSTOMER",
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  LAB_TECHNICIAN: "LAB_TECHNICIAN",
};

// Ensure @prisma/client exports UserRole for the actual route files
jest.mock("@prisma/client", () => {
  const actual = jest.requireActual("@prisma/client");
  return {
    ...actual,
    UserRole: {
      ADMIN: "ADMIN",
      CUSTOMER: "CUSTOMER",
      LAB_ADMIN: "LAB_ADMIN",
      TECHNICIAN: "TECHNICIAN",
      DOCTOR: "DOCTOR",
      APPROVAL: "APPROVAL",
    },
  };
});

// Mock Authentication Middleware
const mockAuthMiddleware =
  (role: string) => (req: any, res: any, next: any) => {
    req.user = {
      userId: "test-user-id",
      email: "test@example.com",
      role: role,
    };
    next();
  };

// Mock Dependencies
jest.mock("../services/FileService", () => {
  return {
    FileService: jest.fn().mockImplementation(() => ({
      getMulterConfig: jest.fn().mockReturnValue({
        single: jest
          .fn()
          .mockReturnValue((req: any, res: any, next: any) => next()),
      }),
    })),
  };
});

jest.mock("../controllers/InvoiceController", () => ({
  InvoiceController: jest.fn().mockImplementation(() => ({
    createInvoice: jest.fn((req, res) =>
      res.status(201).json({ success: true }),
    ),
    getInvoices: jest.fn((req, res) => res.status(200).json({ success: true })),
    getStatistics: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    searchInvoices: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    getInvoiceByNumber: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    getInvoice: jest.fn((req, res) => res.status(200).json({ success: true })),
    updateInvoice: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    markAsPaid: jest.fn((req, res) => res.status(200).json({ success: true })),
    verifyPayment: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
  })),
}));

jest.mock("../controllers/CustomerController", () => ({
  CustomerController: jest.fn().mockImplementation(() => ({
    getProfile: jest.fn((req, res) => res.status(200).json({ success: true })),
    updateProfile: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    getStatistics: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    getAllCustomers: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    searchCustomers: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    getCustomerById: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
    deleteCustomer: jest.fn((req, res) =>
      res.status(200).json({ success: true }),
    ),
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
  },
}));

function createMockResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
}

function findRouteLayer(router: Router, method: string, path: string) {
  const layer = router.stack.find(
    (routeLayer: any) =>
      routeLayer.route &&
      routeLayer.route.path === path &&
      routeLayer.route.methods[method],
  );
  if (!layer) {
    throw new Error(`Route ${method.toUpperCase()} ${path} not found`);
  }
  return layer.route.stack;
}

async function executeRoute(
  router: Router,
  method: string,
  path: string,
  role: string,
) {
  const stack = findRouteLayer(router, method, path);
  const req: any = {
    user: { userId: "123", role },
    params: {},
    query: {},
    body: {},
  };
  const res = createMockResponse();

  for (const layer of stack) {
    const handler = layer.handle;
    if (handler.length >= 3) {
      const shouldContinue = await new Promise<boolean>((resolve, reject) => {
        let nextCalled = false;
        const next = (err?: unknown) => {
          if (err) {
            reject(err);
            return;
          }
          nextCalled = true;
          resolve(true);
        };
        try {
          const maybePromise = handler(req, res, next);
          if (maybePromise && typeof maybePromise.then === "function") {
            maybePromise
              .then(() => {
                if (!nextCalled) {
                  resolve(false);
                }
              })
              .catch(reject);
          } else if (!nextCalled) {
            resolve(false);
          }
        } catch (error) {
          reject(error);
        }
      });
      if (!shouldContinue) {
        break;
      }
    } else {
      await Promise.resolve(handler(req, res));
      break;
    }
  }

  return res;
}

describe("Route Protection Rules", () => {
  describe("Invoice Routes", () => {
    it("GET /statistics should be forbidden for CUSTOMER", async () => {
      const res = await executeRoute(
        invoiceRoutes,
        "get",
        "/statistics",
        UserRole.CUSTOMER,
      );
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("GET /statistics should be allowed for ADMIN", async () => {
      const res = await executeRoute(
        invoiceRoutes,
        "get",
        "/statistics",
        UserRole.ADMIN,
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it("GET /search should be forbidden for CUSTOMER", async () => {
      const res = await executeRoute(
        invoiceRoutes,
        "get",
        "/search",
        UserRole.CUSTOMER,
      );
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("GET /search should be allowed for ADMIN", async () => {
      const res = await executeRoute(
        invoiceRoutes,
        "get",
        "/search",
        UserRole.ADMIN,
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("Customer Routes", () => {
    it("GET /statistics should be forbidden for CUSTOMER", async () => {
      const res = await executeRoute(
        customerRoutes,
        "get",
        "/statistics",
        UserRole.CUSTOMER,
      );
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("GET / should be forbidden for CUSTOMER", async () => {
      const res = await executeRoute(
        customerRoutes,
        "get",
        "/",
        UserRole.CUSTOMER,
      );
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("GET /profile should be allowed for CUSTOMER", async () => {
      const res = await executeRoute(
        customerRoutes,
        "get",
        "/profile",
        UserRole.CUSTOMER,
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
