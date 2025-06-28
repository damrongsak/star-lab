import pako from "pako";
import { Buffer } from "buffer";
/**
 * Compresses a string using GZIP compression with Buffer.
 * @param {string} str - The string to compress.
 * @returns {Uint8Array} - The compressed data as a Uint8Array.
 */
export const compressString = (str: string): Uint8Array => {
  const buffer = Buffer.from(str, "utf-8"); // Encode string to Buffer (Uint8Array)
  const compressedData = pako.gzip(buffer);
  return compressedData;
};

/**
 * Decompresses a GZIP compressed Uint8Array back into a string using Buffer.
 * @param {Uint8Array} compressedData - The compressed data.
 * @returns {string} - The decompressed string.
 */
export const decompressString = (compressedData: Uint8Array): string => {
  const decompressedData = pako.ungzip(compressedData);
  return Buffer.from(decompressedData).toString("utf-8");
};

/**
 * Encodes a Uint8Array to a Base64 string (Node.js compatible).
 * @param {Uint8Array} data - The Uint8Array to encode.
 * @returns {string} - The Base64 encoded string.
 */
export const encodeBase64 = (data: Uint8Array): string => {
  const buffer = Buffer.from(data);
  return buffer.toString("base64");
};

/**
 * Decodes a Base64 string to a Uint8Array (Node.js compatible).
 * @param {string} base64String - The Base64 string to decode.
 * @returns {Uint8Array} - The decoded Uint8Array.
 */
export const decodeBase64 = (base64String: string): Uint8Array => {
  const buffer = Buffer.from(base64String, "base64");
  return new Uint8Array(buffer);
};
