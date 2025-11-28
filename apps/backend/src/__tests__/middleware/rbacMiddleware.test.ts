import { Request, Response, NextFunction } from "express";
import { requireOwnerOrAdmin, requireRole } from "../../middleware/rbacMiddleware";

// Mock objects
const mockRequest = (user?: any, params?: any) => ({
  user,
  params,
} as unknown as Request);

const mockResponse = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as Response;
};

const mockNext = jest.fn() as NextFunction;

describe("RBAC Middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("requireRole", () => {
    it("should call next if user has allowed role", () => {
      const req = mockRequest({ role: "ADMIN" });
      const res = mockResponse();
      const next = mockNext;

      requireRole(["ADMIN"])(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", () => {
      const req = mockRequest(undefined);
      const res = mockResponse();
      const next = mockNext;

      requireRole(["ADMIN"])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Authentication required." });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 403 if user does not have allowed role", () => {
      const req = mockRequest({ role: "CUSTOMER" });
      const res = mockResponse();
      const next = mockNext;

      requireRole(["ADMIN"])(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("requireOwnerOrAdmin", () => {
    it("should allow access if user accesses their own profile", () => {
      const userId = "user-123";
      const req = mockRequest(
        { userId, role: "CUSTOMER" },
        { id: userId }
      );
      const res = mockResponse();
      const next = mockNext;

      requireOwnerOrAdmin("id")(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should allow access if user is ADMIN regardless of target ID", () => {
      const req = mockRequest(
        { userId: "admin-1", role: "ADMIN" },
        { id: "other-user-123" }
      );
      const res = mockResponse();
      const next = mockNext;

      requireOwnerOrAdmin("id")(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should allow access if user is LAB_ADMIN regardless of target ID", () => {
      const req = mockRequest(
        { userId: "lab-admin-1", role: "LAB_ADMIN" },
        { id: "other-user-123" }
      );
      const res = mockResponse();
      const next = mockNext;

      requireOwnerOrAdmin("id")(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if user accesses another user's profile", () => {
      const req = mockRequest(
        { userId: "user-1", role: "CUSTOMER" },
        { id: "user-2" }
      );
      const res = mockResponse();
      const next = mockNext;

      requireOwnerOrAdmin("id")(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied. You can only access your own profile.",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if user is not authenticated", () => {
      const req = mockRequest(undefined, { id: "user-1" });
      const res = mockResponse();
      const next = mockNext;

      requireOwnerOrAdmin("id")(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
