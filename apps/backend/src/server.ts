import express from "express";
import process from "process";
import cors from "cors";
import { json } from "body-parser";
import { prisma } from "./utils/db";
import authRoutes from "./routes/authRoutes";
// import { projectRoutes } from "./routes/projectRoutes";
// import { taskRoutes } from "./routes/taskRoutes";
// import { userRoutes } from "./routes/userRoutes";
import winston from "winston";

const app = express();
// Enable trust proxy to correctly handle client IPs when behind a reverse proxy like Nginx.
app.set("trust proxy", true);
// Set the port from environment variable or default to 5002
const port =
  process.env.PORT !== undefined && process.env.PORT !== null
    ? process.env.PORT
    : 5002;

app.use(cors());
app.use(json());

// say hi
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/api/v1", authRoutes);
// app.use("/api/v1/projects", projectRoutes);
// app.use("/api/v1/tasks", taskRoutes);
// app.use("/api/v1/users", userRoutes);

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
