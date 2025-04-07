import express, { Express, Request, Response } from "express";
import helperRoutes from "./routes/helperRoutes";
import bodyParser from "body-parser";
import process from "process";
import logger from "./utils/logger";

import { decompressBase64 } from "./middlewares/decompressBodyBase64";

import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5003;

// Middleware to parse request body as JSON
app.use(bodyParser.json());

// Middleware to decompress base64 encoded request bodies
app.use(decompressBase64);

// Use the defined routes
app.use("/", helperRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Helper Service API is running!");
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
