import express from "express";
import { FileService } from "../services/FileService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();
const fileService = new FileService();
const upload = fileService.getMulterConfig();

// Upload a file
router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
      }

      const { entityType, entityId } = req.body;

      if (!entityType || !entityId) {
        res.status(400).json({ message: "Entity type and ID are required" });
        return;
      }

      const attachment = await fileService.processUploadedFile(
        req.file,
        entityType,
        entityId,
        req.user?.userId,
      );

      res.status(201).json(attachment);
    } catch (error) {
      next(error);
    }
  },
);

// Get attachments for an entity
router.get("/:entityType/:entityId", authMiddleware, async (req, res, next) => {
  try {
    const { entityType, entityId } = req.params;
    const attachments = await fileService.getDocumentAttachmentsByEntity(
      entityType,
      entityId,
    );
    res.json(attachments);
  } catch (error) {
    next(error);
  }
});

// Delete an attachment
router.delete("/:id", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    await fileService.deleteDocumentAttachment(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Download a file
router.get("/:id/download", authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stream, documentAttachment } = await fileService.getFileStream(id);

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${documentAttachment.fileName}"`,
    );
    res.setHeader(
      "Content-Type",
      documentAttachment.mimeType || "application/octet-stream",
    );

    stream.pipe(res);
  } catch (error) {
    next(error);
  }
});

export default router;
