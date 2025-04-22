import { decompressString, decodeBase64 } from "../utils/compression";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

/**
 * Middleware to decompress base64 encoded request bodies
 *
 * Expected structure of req.body:
 * {
 *   compressedPayload: string; // Base64 encoded and zipped string
 * }
 *
 * @param req - Express Request object
 * @param res - Express Response object
 * @param next - Express NextFunction
 */
export const decompressBase64 = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Check if compression header is present and true
  const isCompressed = req.headers["x-payload-compressed"] === "true";
  if (!isCompressed) {
    return next(); // If 'x-payload-compressed' is not present or false, move to the next middleware
  }

  // Ensure we have a payload to decompress
  const base64String = req.body?.compressedPayload;

  if (!base64String) {
    res.status(400).json({
      error: "Compression header indicated, but no payload found",
    });
    return;
  }

  if (!base64String) {
    return next(); // If 'zippedBase64' is not present, move to the next middleware
  }

  try {
    const decodeBase64ToUint8Array = await decodeBase64(base64String);
    logger.info(base64String);
    const decompressedData = await decompressString(decodeBase64ToUint8Array);
    logger.info(decompressedData);
    req.body = JSON.parse(decompressedData);
  } catch (error) {
    logger.error("Error handling base64 decompression:", error);

    if (error instanceof SyntaxError) {
      res.status(400).json({ error: "Decompressed data is not valid JSON" });
    } else {
      res
        .status(500)
        .json({ error: "Internal server error during decompression" });
    }
    return;
  }

  next(); // Move to the next middleware
};
