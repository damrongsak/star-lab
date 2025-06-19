import { Request, Response } from "express";
import dotenv from "dotenv";
import logger from "../utils/logger";
import pool from "../config/database";

dotenv.config();

export const helpCheck = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect(); // Acquire a client from the pool
    await client.query("SELECT 1"); // Simple query to check database connection
    client.release(); // Release the client back to the pool
    res.json({
      message: "Helper service is running and database is connected",
    });
  } catch (error) {
    logger.error("Database connection error:", error);
    res.status(500).json({
      message: "Helper service is running, but database connection failed",
    });
  }
};
