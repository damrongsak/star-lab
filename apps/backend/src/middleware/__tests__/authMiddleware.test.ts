import jwt from "jsonwebtoken";

// Set the JWT secret before importing the middleware module because
// the module reads process.env.JWT_SECRET at import time.
process.env.JWT_SECRET = "test_jwt_secret";
process.env.LOG_LEVEL = "error"; // reduce log noise during tests

// Import after setting env so the constant is initialized correctly
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { authMiddleware } = require("../authMiddleware");

function createResponse() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function createRequest(token?: string) {
  const req: any = {
    header: jest.fn((name: string) => {
      if (name.toLowerCase() === "authorization") {
        return token ? `Bearer ${token}` : undefined;
      }
      return undefined;
    }),
  };
  return req;
}

describe("authMiddleware", () => {
  const secret = process.env.JWT_SECRET as string;

  it("verifies a valid token and populates req.user", async () => {
    const payload = {
      userId: "user-123",
      email: "test@example.com",
      role: "CUSTOMER",
    };
    const token = jwt.sign(payload, secret, { expiresIn: "1h" });

    const req = createRequest(token);
    const res = createResponse();
    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual(
      expect.objectContaining({
        id: payload.userId,
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      }),
    );
  });

  it("returns 401 for invalid token", async () => {
    const payload = {
      userId: "user-456",
      email: "bad@example.com",
      role: "CUSTOMER",
    };
    // Sign with the wrong secret to force invalid signature
    const badToken = jwt.sign(payload, "wrong_secret", { expiresIn: "1h" });

    const req = createRequest(badToken);
    const res = createResponse();

    authMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized - invalid token" }),
    );
  });

  it("returns 401 for expired token", async () => {
    const payload = {
      userId: "user-789",
      email: "expired@example.com",
      role: "CUSTOMER",
      // Set explicit past expiry
      exp: Math.floor(Date.now() / 1000) - 10,
    } as const;

    const expiredToken = jwt.sign(payload, secret);

    const req = createRequest(expiredToken);
    const res = createResponse();

    authMiddleware(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Unauthorized - token expired" }),
    );
  });
});
