import express from "express";

import { generateToken, updatePasswordByEmail } from "../controllers/auth";
import { zipJson, unzipJson } from "../controllers/compression";
import { getReqBody } from "../controllers/reqBody";
import { helpCheck } from "../controllers/helpcheck";

const router = express.Router();

router.get("/helpcheck", helpCheck);
router.post("/generate-token", generateToken);
router.post("/zip-json", zipJson);
router.post("/unzip-json", unzipJson);
router.post("/req-body", getReqBody);
router.post("/update-password", updatePasswordByEmail);

export default router;
