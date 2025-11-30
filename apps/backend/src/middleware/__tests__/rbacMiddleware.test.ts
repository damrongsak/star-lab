import { NextFunction, Request, Response } from "express";
import {
  requireRole,
  requireAdmin,
  requireTechnician,
  requireDoctor,
  requireCustomer,
  requireLabAdmin,
  requireApproval,
} from "../rbacMiddleware";

type Role =
  | "ADMIN"
  | "LAB_ADMIN"
  | "CUSTOMER"
  | "TECHNICIAN"
  | "DOCTOR"
  | "APPROVAL";

function makeReq(role?: Role): Request {
  const req: Partial<Request> & { user?: any } = {};
  if (role) {
    req.user = {
      userId: "user-1",
      email: "user@example.com",
      role,
    };
  }
  return req as Request;
}

function makeRes() {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnThis() as any;
  res.json = jest.fn() as any;
  return res as Response;
}

function makeNext() {
  return jest.fn() as NextFunction;
}

describe("RBAC requireRole middleware", () => {
  test("allows request when user has an allowed role", () => {
    const req = makeReq("ADMIN");
    const res = makeRes();
    const next = makeNext();

    const mw = requireRole(["ADMIN", "LAB_ADMIN"]);
    mw(req as any, res as any, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status as any).not.toHaveBeenCalled();
    expect(res.json as any).not.toHaveBeenCalled();
  });

  test("blocks with 401 when user is missing (unauthenticated)", () => {
    const req = makeReq(undefined);
    const res = makeRes();
    const next = makeNext();

    const mw = requireRole(["ADMIN"]);
    mw(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Authentication required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  test("blocks with 403 when user lacks required role", () => {
    const req = makeReq("CUSTOMER");
    const res = makeRes();
    const next = makeNext();

    const mw = requireRole(["ADMIN"]);
    mw(req as any, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Access denied. Insufficient permissions.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});

describe("RBAC convenience helpers", () => {
  test("requireAdmin allows ADMIN and denies others", () => {
    // allow
    const req1 = makeReq("ADMIN");
    const res1 = makeRes();
    const next1 = makeNext();
    requireAdmin()(req1 as any, res1 as any, next1);
    expect(next1).toHaveBeenCalled();

    // deny
    const req2 = makeReq("CUSTOMER");
    const res2 = makeRes();
    const next2 = makeNext();
    requireAdmin()(req2 as any, res2 as any, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(res2.json).toHaveBeenCalledWith({
      message: "Access denied. Insufficient permissions.",
    });
    expect(next2).not.toHaveBeenCalled();
  });

  test("requireTechnician allows TECHNICIAN and denies non-tech", () => {
    const req1 = makeReq("TECHNICIAN");
    const res1 = makeRes();
    const next1 = makeNext();
    requireTechnician()(req1 as any, res1 as any, next1);
    expect(next1).toHaveBeenCalled();

    const req2 = makeReq("DOCTOR");
    const res2 = makeRes();
    const next2 = makeNext();
    requireTechnician()(req2 as any, res2 as any, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(next2).not.toHaveBeenCalled();
  });

  test("requireDoctor allows DOCTOR and denies non-doctor", () => {
    const req1 = makeReq("DOCTOR");
    const res1 = makeRes();
    const next1 = makeNext();
    requireDoctor()(req1 as any, res1 as any, next1);
    expect(next1).toHaveBeenCalled();

    const req2 = makeReq("ADMIN");
    const res2 = makeRes();
    const next2 = makeNext();
    requireDoctor()(req2 as any, res2 as any, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(next2).not.toHaveBeenCalled();
  });

  test("requireCustomer allows CUSTOMER and denies non-customer", () => {
    const req1 = makeReq("CUSTOMER");
    const res1 = makeRes();
    const next1 = makeNext();
    requireCustomer()(req1 as any, res1 as any, next1);
    expect(next1).toHaveBeenCalled();

    const req2 = makeReq("LAB_ADMIN");
    const res2 = makeRes();
    const next2 = makeNext();
    requireCustomer()(req2 as any, res2 as any, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(next2).not.toHaveBeenCalled();
  });

  test("requireLabAdmin allows LAB_ADMIN and denies others", () => {
    const req1 = makeReq("LAB_ADMIN");
    const res1 = makeRes();
    const next1 = makeNext();
    requireLabAdmin()(req1 as any, res1 as any, next1);
    expect(next1).toHaveBeenCalled();

    const req2 = makeReq("TECHNICIAN");
    const res2 = makeRes();
    const next2 = makeNext();
    requireLabAdmin()(req2 as any, res2 as any, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(next2).not.toHaveBeenCalled();
  });

  test("requireApproval allows APPROVAL and denies others", () => {
    const req1 = makeReq("APPROVAL");
    const res1 = makeRes();
    const next1 = makeNext();
    requireApproval()(req1 as any, res1 as any, next1);
    expect(next1).toHaveBeenCalled();

    const req2 = makeReq("CUSTOMER");
    const res2 = makeRes();
    const next2 = makeNext();
    requireApproval()(req2 as any, res2 as any, next2);
    expect(res2.status).toHaveBeenCalledWith(403);
    expect(next2).not.toHaveBeenCalled();
  });
});
