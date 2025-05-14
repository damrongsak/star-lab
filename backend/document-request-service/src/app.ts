import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import router from "./routes/documentRequestRoutes";
import logger from "./utils/logger";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Document Request Service is running!");
});

// Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "OK" });
});

app.use("/document-requests", router);

app.listen(port, () => {
  logger.info(`Document Request Service listening on port ${port}`);
});
