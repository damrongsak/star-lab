import * as zlib from "zlib";
import * as crypto from "crypto";
import { Buffer } from "buffer";

// Encryption configuration
const ENCRYPTION_ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16; // Initialization vector length

/**
 * Compresses and encrypts a JSON string with a password
 * @param jsonString - The JSON string to compress and encrypt
 * @param password - The encryption password
 * @returns Base64 encoded compressed and encrypted string
 */
export function zip(jsonString: string, password: string): string {
  try {
    // Compress the JSON string
    const compressed = zlib.deflateSync(Buffer.from(jsonString, "utf8"));

    // Generate a random initialization vector
    const iv = crypto.randomBytes(IV_LENGTH);

    // Create a key from the password using SHA256
    const key = crypto.createHash("sha256").update(password).digest();

    // Create cipher
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);

    // Encrypt the compressed data
    const encrypted = Buffer.concat([
      iv,
      cipher.update(compressed),
      cipher.final(),
    ]);

    // Convert to base64
    return encrypted.toString("base64");
  } catch (error) {
    throw new Error(
      `Compression and encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Decrypts and decompresses a base64 encoded string with a password
 * @param base64String - The base64 encoded compressed and encrypted string
 * @param password - The decryption password
 * @returns Decompressed JSON string
 */
export function unzip(base64String: string, password: string): string {
  try {
    // Decode base64
    const buffer = Buffer.from(base64String, "base64");

    // Extract initialization vector (first 16 bytes)
    const iv = buffer.slice(0, IV_LENGTH);
    const encryptedData = buffer.slice(IV_LENGTH);

    // Create key from password
    const key = crypto.createHash("sha256").update(password).digest();

    // Create decipher
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, iv);

    // Decrypt the data
    const decrypted = Buffer.concat([
      decipher.update(encryptedData),
      decipher.final(),
    ]);

    // Decompress the data
    const decompressed = zlib.inflateSync(decrypted);

    // Convert to string
    return decompressed.toString("utf8");
  } catch (error) {
    throw new Error(
      `Decryption and decompression failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}
