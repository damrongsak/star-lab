import { Request, Response, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";
import winston from "winston";

const logger = winston.createLogger({
  level: "error",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "error.log" }),
  ],
});

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction, // <-- Add this parameter
) => {
  if (err instanceof CustomError) {
    return res
      .status((err as CustomError).statusCode)
      .send({ errors: (err as CustomError).serializeErrors() });
  }

  logger.error(err.message, { stack: err.stack });
  res.status(400).send({
    errors: [
      {
        message: "Something went wrong",
      },
    ],
  });
};
