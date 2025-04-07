import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes";
import logger from "./utils/logger";
import process from "process";
// import { connectRedis } from "./utils/redisClient"; // Import connectRedis
import swaggerUi from "swagger-ui-express"; // Import swagger-ui-express
import swaggerDocs from "./swagger";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = process.env.PORT || 5002; // Default port for customer-service

// Initialize Redis connection
// connectRedis(); // Call connectRedis to establish Redis connection

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes - Mount customer routes under /customers prefix
app.use("/customer-profile", customerRoutes);

app.get("/", (req, res) => {
  res.send("Customer Service is running!");
});

// Basic error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    logger.error("Customer Service Error:", err);
    res.status(500).json({
      error: "Internal Server Error in Customer Service",
      details: err.message,
    });
  },
);

app.listen(port, () => {
  logger.info(`Customer Service listening on port ${port}`);
  console.log(`Customer Service listening on port ${port}`);
});

export default app;
