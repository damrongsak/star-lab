import express from "express";
// import class DocumentRequestController
import { DocumentRequestController } from "../controllers/documentRequestController";
const router = express.Router();
const documentRequestController: DocumentRequestController =
  new DocumentRequestController();

router.post("/", documentRequestController.createDocumentRequest);
router.get("/:id", documentRequestController.getDocumentRequestById);
router.get(
  "/company/:id",
  documentRequestController.getDocumentRequestsByCompanyId,
);
router.put("/:id", documentRequestController.updateDocumentRequest);
router.delete("/:id", documentRequestController.deleteDocumentRequest);

export default router;
