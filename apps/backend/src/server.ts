import express from "express";
import process from "process";
import cors from "cors";
import { json } from "body-parser";
import { prisma } from "./utils/db";
import authRoutes from "./routes/authRoutes";
import customerRoutes from "./routes/customers";
import labRoutes from "./routes/lab";
import testRequestRoutes from "./routes/testRequest";
import { invoiceRoutes } from "./routes/invoice";
import { doctorRoutes } from "./routes/doctor";
import { setupSwagger } from "./config/swagger";
import winston from "winston";

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

// Setup Swagger documentation
setupSwagger(app);

// say hi
app.get("/", (req, res) => {
  res.send("Hello, Star Lab API!");
});

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/lab", labRoutes);
app.use("/api/v1/test-requests", testRequestRoutes);
app.use("/api/v1/invoices", invoiceRoutes);
app.use("/api/v1/doctors", doctorRoutes);

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
