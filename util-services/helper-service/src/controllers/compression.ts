import { Request, Response } from "express";
import {
  compressString,
  decompressString,
  encodeBase64,
  decodeBase64,
} from "../utils/compression";
import logger from "../utils/logger";

export const zipJson = (req: Request, res: Response): any => {
  try {
    const rawJson = req.body; // body-parser middleware already parses JSON
    if (!rawJson || typeof rawJson !== "object") {
      return res
        .status(400)
        .json({ error: "Missing or invalid JSON object in the request body" });
    }

    const jsonString = JSON.stringify(rawJson); // Convert the JSON object to a string
    const compressedData = compressString(jsonString); // Compress the JSON string
    const base64Zip = encodeBase64(compressedData); // Encode the compressed data to Base64
    res.json({ compressedPayload: base64Zip });
  } catch (error) {
    logger.error("Error processing JSON or during compression:", error);
    res.status(500).json({ error: "Failed to process and compress data" });
  }
};

export const unzipJson = (req: Request, res: Response): any => {
  try {
    const compressedPayload = req.body.compressedPayload;
    if (!compressedPayload || typeof compressedPayload !== "string") {
      return res
        .status(400)
        .json({ error: "Missing or invalid zippedBase64 in the request body" });
    }

    const compressedData = decodeBase64(compressedPayload); // Decode the Base64 string to a Uint8Array
    const decompressedData = decompressString(compressedData); // Decompress the Uint8Array to a string
    const jsonData = JSON.parse(decompressedData);
    res.json(jsonData);
  } catch (error) {
    logger.error("Error processing JSON or during decompression:", error);
    res.status(500).json({ error: "Failed to process and decompress data" });
  }
};
