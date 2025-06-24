import request from "supertest";
import express from "express";
import authRoutes from "../../routes/authRoutes";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

jest.mock("@prisma/client");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
app.use("/auth", authRoutes);

describe("POST /auth/login", () => {
  it("should return 400 if email or password is missing", async () => {
    const response = await request(app).post("/auth/login").send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Missing email or password");
  });

  it("should return 401 if user does not exist", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 401 if password is incorrect", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      email: "admin@starlab.com",
      passwordHash: "hashedpassword",
    });
    bcrypt.compare = jest.fn().mockResolvedValue(false);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "wrongpassword" });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid credentials");
  });

  it("should return 200 and a token if login is successful", async () => {
    prisma.user.findUnique = jest.fn().mockResolvedValue({
      id: "3e8120f7-6b56-44b3-9874-f091ee3e6ad4",
      email: "customer@starlab.com",
      role: "CUSTOMER",
      passwordHash:
        "$2b$10$dOkZab6/YfA30471UpRwfuAsQSmOiFzpJvLdg7T86sXnMKTVlZx8y",
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);
    jwt.sign = jest.fn().mockReturnValue("mockedToken");

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "customer@starlab.com", password: "mock-password" });

    expect(response.status).toBe(200);
    expect(response.body.token).toBe("mockedToken");
    expect(response.body.user).toEqual({
      id: "3e8120f7-6b56-44b3-9874-f091ee3e6ad4",
      email: "customer@starlab.com",
      role: "CUSTOMER",
    });
  });

  it("should return 500 if an error occurs", async () => {
    prisma.user.findUnique = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(response.status).toBe(500);
    expect(response.body.message).toBe("Login failed");
  });
});
