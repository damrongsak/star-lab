import express, { Request, Response } from "express";
import process from "process";
import cors from "cors";
import { json } from "body-parser";
import path from "path";
import { prisma } from "./utils/db";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customers";
import labRoutes from "./routes/lab";
import testRequestRoutes from "./routes/testRequest";
import { invoiceRoutes } from "./routes/invoice";
import { doctorRoutes } from "./routes/doctor";
import userRoutes from "./routes/users";
import { setupSwagger } from "./config/swagger";
import adminRoutes from "./routes/admin/index";
import uploadRoutes from "./routes/upload";
import auditRoutes from "./routes/audit";
import reportsRoutes from "./routes/reports";
import errorHandler from "./utils/errorHandler";
import winston from "winston";
import { auditMiddleware } from "./middleware/auditMiddleware";

const app = express();
// Enable trust proxy to correctly handle client IPs when behind a reverse proxy like Nginx.
app.set("trust proxy", true);
// Set the port from environment variable or default to 5002
const port =
  process.env.PORT !== undefined && process.env.PORT !== null
    ? process.env.PORT
    : 5001;

app.use(cors());
app.use(json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Setup Swagger documentation
setupSwagger(app);

// say hi
app.get("/", (req, res) => {
  res.json({ message: "Hello, Star Lab API!" });
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/lab", labRoutes);
app.use("/api/v1/test-requests", testRequestRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/doctors", doctorRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/uploads", uploadRoutes);
app.use("/api/v1/audit", auditRoutes);
app.use("/api/v1/reports", reportsRoutes);

// Audit middleware for all routes
app.use(auditMiddleware);

app.use(errorHandler);

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "server.log" }),
  ],
});

prisma
  .$connect()
  .then(() => {
    app.listen(port, () => {
      logger.info(`Server running on http://localhost:${port}`);
    });
  })
  .catch((error: unknown) => {
    logger.error("Database connection failed", { error });
    process.exit(1);
  });
