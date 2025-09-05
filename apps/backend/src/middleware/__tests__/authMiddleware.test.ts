import express, { Request, Response } from "express";
import request from "supertest";
import jwt from "jsonwebtoken";

// Set the JWT secret before importing the middleware module because
// the module reads process.env.JWT_SECRET at import time.
process.env.JWT_SECRET = "test_jwt_secret";
process.env.LOG_LEVEL = "error"; // reduce log noise during tests

// Import after setting env so the constant is initialized correctly
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { authMiddleware } = require("../authMiddleware");

function createApp() {
  const app = express();
  app.get("/protected", authMiddleware, (req: Request, res: Response) => {
    return res.json({ ok: true, user: req.user });
  });
  return app;
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

    const app = createApp();
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(res.body).toEqual(
      expect.objectContaining({
        ok: true,
        user: expect.objectContaining({
          id: payload.userId,
          userId: payload.userId,
          email: payload.email,
          role: payload.role,
        }),
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

    const app = createApp();
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${badToken}`)
      .expect(401);

    expect(res.body).toEqual(
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

    const app = createApp();
    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${expiredToken}`)
      .expect(401);

    expect(res.body).toEqual(
      expect.objectContaining({ message: "Unauthorized - token expired" }),
    );
  });
});

