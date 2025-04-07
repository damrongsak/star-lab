/* eslint-disable no-undef */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import logger from "./utils/logger";
import { decompressBase64 } from "./middlewares/decompressBodyBase64";
import swaggerUi from "swagger-ui-express"; // Import swagger-ui-express
import swaggerDocs from "./swagger";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5001; // Default port if PORT env var is not set

// Middleware
app.use(cors()); // Enable CORS for all origins (adjust in production)

// Use body-parser for handling other types of request bodies (if needed)
app.use(bodyParser.json());

// Middleware to decompress base64 encoded request bodies
app.use(decompressBase64);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/", authRoutes); // Mount auth routes under /auth prefix

app.get("/", (req, res) => {
  res.send("Auth Service is running!");
});

// Basic error handling middleware (more robust error handling can be added)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Unhandled error:", err);
    console.log("Type of res in error handler:", typeof res); // ADD THIS LINE
    console.log("Value of res in error handler:", res); // ADD THIS LINE
    res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  },
);

app.listen(port, () => {
  logger.info(`Auth Service listening on port ${port}`);
  console.log(`Auth Service listening on port ${port}`); // Keep console.log for initial quick check
});

export default app;
