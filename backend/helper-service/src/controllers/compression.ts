import { Request, Response } from "express";
import dotenv from "dotenv";
import process from "process";
import { zip, unzip } from "../utils/compression";
import logger from "../utils/logger";

dotenv.config();

const ZIP_PASSWORD = process.env.ZIP_PASSWORD;

export const zipJson = (req: Request, res: Response): any => {
  try {
    const rawJson = req.body; // body-parser middleware already parses JSON
    if (!rawJson || typeof rawJson !== "object") {
      return res
        .status(400)
        .json({ error: "Missing or invalid JSON object in the request body" });
    }

    if (!ZIP_PASSWORD) {
      return res.status(500).json({
        error: "ZIP_PASSWORD is not set in the environment variables",
      });
    }

    const jsonString = JSON.stringify(rawJson); // Convert the JSON object to a string
    const base64Zip = zip(jsonString, ZIP_PASSWORD);
    res.json({ zippedBase64: base64Zip });
  } catch (error) {
    logger.error("Error processing JSON or during compression:", error);
    res.status(500).json({ error: "Failed to process and compress data" });
  }
};

export const unzipJson = (req: Request, res: Response): any => {
  try {
    const base64Zip = req.body.zippedBase64;
    if (!base64Zip || typeof base64Zip !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid zippedBase64 in the request body" });
    }

    if (!ZIP_PASSWORD) {
      return res.status(500).json({
        error: "ZIP_PASSWORD is not set in the environment variables",
      });
    }

    // const encryptedBuffer = Buffer.from(base64Zip, "base64").toString("utf-8");
    const jsonString = unzip(base64Zip, ZIP_PASSWORD);
    const jsonData = JSON.parse(jsonString);
    res.json(jsonData);
  } catch (error) {
    logger.error("Error processing JSON or during decompression:", error);
    res.status(500).json({ error: "Failed to process and decompress data" });
  }
};
