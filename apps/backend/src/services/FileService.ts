import { PrismaClient, DocumentAttachment } from "@prisma/client";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateDocumentAttachmentData {
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  entityType: string;
  entityId: string;
  uploadedById?: string;
}

export interface FileUploadOptions {
  maxSize?: number; // in bytes
  allowedMimeTypes?: string[];
  destinationPath?: string;
}

export class FileService {
  private readonly uploadsDir: string;
  private readonly maxFileSize: number = 10 * 1024 * 1024; // 10MB default
  private readonly allowedTypes: string[] = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/plain",
    "text/csv",
  ];

  constructor() {
    this.uploadsDir = path.join(process.cwd(), "uploads");
    this.ensureUploadsDir();
  }

  private async ensureUploadsDir(): Promise<void> {
    try {
      await fs.access(this.uploadsDir);
    } catch {
      await fs.mkdir(this.uploadsDir, { recursive: true });
      logger.info(`Created uploads directory: ${this.uploadsDir}`);
    }
  }

  /**
   * Configure multer for file uploads
   */
  getMulterConfig(options?: FileUploadOptions) {
    const storage = multer.diskStorage({
      destination: async (req, file, cb) => {
        const destPath = options?.destinationPath || this.uploadsDir;
        try {
          await fs.access(destPath);
        } catch {
          await fs.mkdir(destPath, { recursive: true });
        }
        cb(null, destPath);
      },
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      },
    });

    const fileFilter = (req: any, file: any, cb: multer.FileFilterCallback) => {
      const allowedTypes = options?.allowedMimeTypes || this.allowedTypes;
      if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${file.mimetype} is not allowed`));
      }
    };

    return multer({
      storage,
      fileFilter,
      limits: {
        fileSize: options?.maxSize || this.maxFileSize,
      },
    });
  }

  /**
   * Save document attachment record to database
   */
  async createDocumentAttachment(
    data: CreateDocumentAttachmentData,
  ): Promise<DocumentAttachment> {
    try {
      const documentAttachment = await prisma.documentAttachment.create({
        data: {
          fileName: data.fileName,
          fileUrl: data.fileUrl,
          mimeType: data.mimeType,
          entityType: data.entityType,
          entityId: data.entityId,
          uploadedById: data.uploadedById,
        },
      });

      logger.info(`Document attachment created: ${documentAttachment.id}`);
      return documentAttachment;
    } catch (error) {
      logger.error(`Error creating document attachment: ${error}`);
      throw error;
    }
  }

  /**
   * Get document attachment by ID
   */
  async getDocumentAttachment(id: string): Promise<DocumentAttachment | null> {
    try {
      const documentAttachment = await prisma.documentAttachment.findUnique({
        where: { id },
        include: {
          uploadedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      return documentAttachment;
    } catch (error) {
      logger.error(`Error getting document attachment: ${error}`);
      throw error;
    }
  }

  /**
   * Get document attachments by entity
   */
  async getDocumentAttachmentsByEntity(
    entityType: string,
    entityId: string,
  ): Promise<DocumentAttachment[]> {
    try {
      const documentAttachments = await prisma.documentAttachment.findMany({
        where: {
          entityType,
          entityId,
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: {
          uploadedAt: "desc",
        },
      });

      return documentAttachments;
    } catch (error) {
      logger.error(`Error getting document attachments by entity: ${error}`);
      throw error;
    }
  }

  /**
   * Delete document attachment
   */
  async deleteDocumentAttachment(id: string): Promise<void> {
    try {
      const documentAttachment = await prisma.documentAttachment.findUnique({
        where: { id },
      });

      if (!documentAttachment) {
        throw new Error("Document attachment not found");
      }

      // Extract file path from URL if it's a local file
      if (documentAttachment.fileUrl.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), documentAttachment.fileUrl);
        try {
          await fs.unlink(filePath);
        } catch {
          logger.warn(`Failed to delete physical file: ${filePath}`);
        }
      }

      // Delete database record
      await prisma.documentAttachment.delete({
        where: { id },
      });

      logger.info(`Document attachment deleted: ${id}`);
    } catch (error) {
      logger.error(`Error deleting document attachment: ${error}`);
      throw error;
    }
  }

  /**
   * Get file stream for download
   */
  async getFileStream(id: string): Promise<{
    stream: any;
    documentAttachment: DocumentAttachment;
  }> {
    try {
      const documentAttachment = await this.getDocumentAttachment(id);

      if (!documentAttachment) {
        throw new Error("Document attachment not found");
      }

      // Check if it's a local file
      if (!documentAttachment.fileUrl.startsWith("/uploads/")) {
        throw new Error("File is not stored locally");
      }

      const filePath = path.join(process.cwd(), documentAttachment.fileUrl);

      // Check if file exists
      try {
        await fs.access(filePath);
      } catch {
        throw new Error("Physical file not found");
      }

      const stream = require("fs").createReadStream(filePath);
      return { stream, documentAttachment };
    } catch (error) {
      logger.error(`Error getting file stream: ${error}`);
      throw error;
    }
  }

  /**
   * Update document attachment metadata
   */
  async updateDocumentAttachment(
    id: string,
    updateData: {
      fileName?: string;
      entityType?: string;
      entityId?: string;
    },
  ): Promise<DocumentAttachment> {
    try {
      const documentAttachment = await prisma.documentAttachment.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Document attachment updated: ${id}`);
      return documentAttachment;
    } catch (error) {
      logger.error(`Error updating document attachment: ${error}`);
      throw error;
    }
  }

  /**
   * Process uploaded file and create attachment record
   */
  async processUploadedFile(
    file: any,
    entityType: string,
    entityId: string,
    uploadedById?: string,
  ): Promise<DocumentAttachment> {
    try {
      const fileUrl = `/uploads/${file.filename}`;

      const attachmentData: CreateDocumentAttachmentData = {
        fileName: file.originalname,
        fileUrl,
        mimeType: file.mimetype,
        entityType,
        entityId,
        uploadedById,
      };

      return await this.createDocumentAttachment(attachmentData);
    } catch (error) {
      // Clean up uploaded file on error
      try {
        await fs.unlink(file.path);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  /**
   * Generate secure download URL
   */
  generateDownloadUrl(fileId: string): string {
    // In a production environment, you would use signed URLs
    // For now, return a simple URL with the file ID
    return `/api/v1/files/${fileId}/download`;
  }

  /**
   * Validate file type and size
   */
  validateFile(file: any, options?: FileUploadOptions): void {
    const allowedTypes = options?.allowedMimeTypes || this.allowedTypes;
    const maxSize = options?.maxSize || this.maxFileSize;

    if (!allowedTypes.includes(file.mimetype)) {
      throw new Error(`File type ${file.mimetype} is not allowed`);
    }

    if (file.size > maxSize) {
      throw new Error(
        `File size ${file.size} exceeds maximum ${maxSize} bytes`,
      );
    }
  }
}
