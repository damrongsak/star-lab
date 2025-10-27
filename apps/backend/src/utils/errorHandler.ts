import process from "process";
import { Request, Response, NextFunction } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import logger from "./logger";

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace?.(this, this.constructor);
  }
}

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let errorCode: string | undefined;
  let details: unknown;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorCode = "APP_ERROR";
    details = (err as AppError & { details?: unknown }).details;
  } else if (err instanceof PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002":
        statusCode = 409;
        message = "Resource already exists";
        break;
      case "P2025":
        statusCode = 404;
        message = "Resource not found";
        break;
      default:
        statusCode = 500;
        message = "Database error";
        break;
    }
    errorCode = err.code;
    details = err.meta;
  } else if (
    err instanceof TokenExpiredError ||
    err instanceof JsonWebTokenError
  ) {
    statusCode = 401;
    message = "Authentication failed";
    errorCode = err.name;
    details = err.message;
  } else if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation failed";
    errorCode = "VALIDATION_ERROR";
    details = err.errors;
  } else if (err instanceof Error) {
    message = err.message || message;
    errorCode = err.name || "ERROR";
  }

  logger.error("Unhandled error during request", {
    message,
    statusCode,
    stack: err instanceof Error ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  const responsePayload: {
    success: false;
    message: string;
    error?: { code: string; details: unknown };
    stack?: string;
  } = {
    success: false,
    message,
  };

  if (errorCode || typeof details !== "undefined") {
    responsePayload.error = {
      code: errorCode ?? "UNKNOWN_ERROR",
      details,
    };
  }

  if (
    process.env.NODE_ENV !== "production" &&
    err instanceof Error &&
    typeof err.stack === "string"
  ) {
    responsePayload.stack = err.stack;
  }

  res.status(statusCode).json(responsePayload);
};

export default errorHandler;
