// Mock all dependencies first, before any imports
const mockPrismaDocumentAttachment = {
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    documentAttachment: mockPrismaDocumentAttachment,
  })),
}));

jest.mock("fs/promises", () => ({
  access: jest.fn(),
  mkdir: jest.fn(),
  unlink: jest.fn(),
  createReadStream: jest.fn(),
  stat: jest.fn(),
}));

jest.mock("multer", () => {
  const multerInstance = {
    single: jest.fn(),
    array: jest.fn(),
    fields: jest.fn(),
  };
  const multerFunction = jest.fn(() => multerInstance);
  return Object.assign(multerFunction, {
    diskStorage: jest.fn(() => ({})),
  });
});

jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Import modules after mocks
import { FileService } from "../services/FileService";
import logger from "../utils/logger";
import fs from "fs/promises";

describe("FileService", () => {
  let fileService: FileService;

  beforeEach(() => {
    jest.clearAllMocks();
    fileService = new FileService();
  });

  describe("createDocumentAttachment", () => {
    it("should create document attachment successfully", async () => {
      const attachmentData = {
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
        mimeType: "application/pdf",
        entityType: "test_request",
        entityId: "request-123",
        uploadedById: "user-123",
      };

      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
        mimeType: "application/pdf",
        entityType: "test_request",
        entityId: "request-123",
        uploadedById: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaDocumentAttachment.create.mockResolvedValue(mockAttachment);

      const result = await fileService.createDocumentAttachment(attachmentData);

      expect(mockPrismaDocumentAttachment.create).toHaveBeenCalledWith({
        data: attachmentData,
      });
      expect(result).toEqual(mockAttachment);
      expect(logger.info).toHaveBeenCalledWith(
        `Document attachment created: ${mockAttachment.id}`,
      );
    });

    it("should handle database errors", async () => {
      const attachmentData = {
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
        entityType: "test_request",
        entityId: "request-123",
      };

      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.create.mockRejectedValue(dbError);

      await expect(
        fileService.createDocumentAttachment(attachmentData),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getDocumentAttachment", () => {
    it("should return document attachment when found", async () => {
      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
        mimeType: "application/pdf",
        entityType: "test_request",
        entityId: "request-123",
        uploadedById: "user-123",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(mockAttachment);

      const result = await fileService.getDocumentAttachment("attachment-123");

      expect(mockPrismaDocumentAttachment.findUnique).toHaveBeenCalledWith({
        where: { id: "attachment-123" },
        include: {
          uploadedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(mockAttachment);
    });

    it("should return null when attachment not found", async () => {
      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(null);

      const result = await fileService.getDocumentAttachment("non-existent-id");

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.findUnique.mockRejectedValue(dbError);

      await expect(
        fileService.getDocumentAttachment("attachment-123"),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getDocumentAttachmentsByEntity", () => {
    it("should return attachments for an entity", async () => {
      const mockAttachments = [
        {
          id: "attachment-1",
          fileName: "document1.pdf",
          fileUrl: "/uploads/document1.pdf",
          mimeType: "application/pdf",
          entityType: "test_request",
          entityId: "request-123",
          createdAt: new Date(),
        },
        {
          id: "attachment-2",
          fileName: "document2.pdf",
          fileUrl: "/uploads/document2.pdf",
          mimeType: "application/pdf",
          entityType: "test_request",
          entityId: "request-123",
          createdAt: new Date(),
        },
      ];

      mockPrismaDocumentAttachment.findMany.mockResolvedValue(mockAttachments);

      const result = await fileService.getDocumentAttachmentsByEntity(
        "test_request",
        "request-123",
      );

      expect(mockPrismaDocumentAttachment.findMany).toHaveBeenCalledWith({
        where: {
          entityType: "test_request",
          entityId: "request-123",
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
        orderBy: { uploadedAt: "desc" },
      });
      expect(result).toEqual(mockAttachments);
    });

    it("should return empty array when no attachments found", async () => {
      mockPrismaDocumentAttachment.findMany.mockResolvedValue([]);

      const result = await fileService.getDocumentAttachmentsByEntity(
        "test_request",
        "request-123",
      );

      expect(result).toEqual([]);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.findMany.mockRejectedValue(dbError);

      await expect(
        fileService.getDocumentAttachmentsByEntity(
          "test_request",
          "request-123",
        ),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteDocumentAttachment", () => {
    it("should delete document attachment and file successfully", async () => {
      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
      };

      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(mockAttachment);
      mockPrismaDocumentAttachment.delete.mockResolvedValue(mockAttachment);
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      await fileService.deleteDocumentAttachment("attachment-123");

      expect(mockPrismaDocumentAttachment.findUnique).toHaveBeenCalledWith({
        where: { id: "attachment-123" },
      });
      expect(mockPrismaDocumentAttachment.delete).toHaveBeenCalledWith({
        where: { id: "attachment-123" },
      });
      expect(fs.unlink).toHaveBeenCalledWith(
        expect.stringContaining("test-document.pdf"),
      );
      expect(logger.info).toHaveBeenCalledWith(
        `Document attachment deleted: ${mockAttachment.id}`,
      );
    });

    it("should throw error when attachment not found", async () => {
      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(null);

      await expect(
        fileService.deleteDocumentAttachment("non-existent-id"),
      ).rejects.toThrow("Document attachment not found");
    });

    it("should handle file deletion errors gracefully", async () => {
      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
      };

      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(mockAttachment);
      mockPrismaDocumentAttachment.delete.mockResolvedValue(mockAttachment);
      (fs.unlink as jest.Mock).mockRejectedValue(new Error("File not found"));

      await fileService.deleteDocumentAttachment("attachment-123");

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining("Failed to delete physical file"),
      );
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.findUnique.mockRejectedValue(dbError);

      await expect(
        fileService.deleteDocumentAttachment("attachment-123"),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getFileStream", () => {
    it("should return file stream and document attachment", async () => {
      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
        mimeType: "application/pdf",
      };

      const mockStream = { pipe: jest.fn() };

      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(mockAttachment);
      const mockCreateReadStream = jest.fn().mockReturnValue(mockStream);
      require("fs").createReadStream = mockCreateReadStream;
      (fs.access as jest.Mock).mockResolvedValue(undefined);

      const result = await fileService.getFileStream("attachment-123");

      expect(mockPrismaDocumentAttachment.findUnique).toHaveBeenCalledWith({
        where: { id: "attachment-123" },
        include: {
          uploadedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      expect(fs.access).toHaveBeenCalledWith(
        expect.stringContaining("test-document.pdf"),
      );
      expect(result).toEqual({
        stream: mockStream,
        documentAttachment: mockAttachment,
      });
    });

    it("should throw error when attachment not found", async () => {
      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(null);

      await expect(
        fileService.getFileStream("non-existent-id"),
      ).rejects.toThrow("Document attachment not found");
    });

    it("should throw error when file is not stored locally", async () => {
      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "https://external.com/test-document.pdf",
        mimeType: "application/pdf",
      };

      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(mockAttachment);

      await expect(fileService.getFileStream("attachment-123")).rejects.toThrow(
        "File is not stored locally",
      );
    });

    it("should throw error when file does not exist", async () => {
      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/test-document.pdf",
        mimeType: "application/pdf",
      };

      mockPrismaDocumentAttachment.findUnique.mockResolvedValue(mockAttachment);
      (fs.access as jest.Mock).mockRejectedValue(new Error("File not found"));

      await expect(fileService.getFileStream("attachment-123")).rejects.toThrow(
        "Physical file not found",
      );
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.findUnique.mockRejectedValue(dbError);

      await expect(fileService.getFileStream("attachment-123")).rejects.toThrow(
        "Database error",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateDocumentAttachment", () => {
    it("should update document attachment successfully", async () => {
      const updateData = {
        fileName: "updated-document.pdf",
        entityType: "invoice",
        entityId: "invoice-123",
      };

      const mockUpdatedAttachment = {
        id: "attachment-123",
        fileName: "updated-document.pdf",
        fileUrl: "/uploads/updated-document.pdf",
        mimeType: "application/pdf",
        entityType: "invoice",
        entityId: "invoice-123",
        updatedAt: new Date(),
      };

      mockPrismaDocumentAttachment.update.mockResolvedValue(
        mockUpdatedAttachment,
      );

      const result = await fileService.updateDocumentAttachment(
        "attachment-123",
        updateData,
      );

      expect(mockPrismaDocumentAttachment.update).toHaveBeenCalledWith({
        where: { id: "attachment-123" },
        data: updateData,
      });
      expect(result).toEqual(mockUpdatedAttachment);
    });

    it("should handle database errors", async () => {
      const updateData = { fileName: "updated-document.pdf" };
      const dbError = new Error("Update failed");
      mockPrismaDocumentAttachment.update.mockRejectedValue(dbError);

      await expect(
        fileService.updateDocumentAttachment("attachment-123", updateData),
      ).rejects.toThrow("Update failed");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("processUploadedFile", () => {
    it("should process uploaded file successfully", async () => {
      const fileData = {
        originalname: "test-document.pdf",
        filename: "uuid-123-test-document.pdf",
        path: "/tmp/upload-123",
        mimetype: "application/pdf",
        size: 1024,
      };

      const mockAttachment = {
        id: "attachment-123",
        fileName: "test-document.pdf",
        fileUrl: "/uploads/uuid-123-test-document.pdf",
        mimeType: "application/pdf",
        entityType: "test_request",
        entityId: "request-123",
        uploadedById: "user-123",
      };

      mockPrismaDocumentAttachment.create.mockResolvedValue(mockAttachment);

      const result = await fileService.processUploadedFile(
        fileData,
        "test_request",
        "request-123",
        "user-123",
      );

      expect(mockPrismaDocumentAttachment.create).toHaveBeenCalledWith({
        data: {
          fileName: "test-document.pdf",
          fileUrl: "/uploads/uuid-123-test-document.pdf",
          mimeType: "application/pdf",
          entityType: "test_request",
          entityId: "request-123",
          uploadedById: "user-123",
        },
      });
      expect(result).toEqual(mockAttachment);
    });

    it("should handle database errors and clean up file", async () => {
      const fileData = {
        originalname: "test-document.pdf",
        filename: "uuid-123-test-document.pdf",
        path: "/tmp/upload-123",
        mimetype: "application/pdf",
        size: 1024,
      };

      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.create.mockRejectedValue(dbError);
      (fs.unlink as jest.Mock).mockResolvedValue(undefined);

      await expect(
        fileService.processUploadedFile(
          fileData,
          "test_request",
          "request-123",
        ),
      ).rejects.toThrow("Database error");

      expect(fs.unlink).toHaveBeenCalledWith("/tmp/upload-123");
      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle cleanup errors gracefully", async () => {
      const fileData = {
        originalname: "test-document.pdf",
        filename: "uuid-123-test-document.pdf",
        path: "/tmp/upload-123",
        mimetype: "application/pdf",
        size: 1024,
      };

      const dbError = new Error("Database error");
      mockPrismaDocumentAttachment.create.mockRejectedValue(dbError);
      (fs.unlink as jest.Mock).mockRejectedValue(new Error("Cleanup failed"));

      await expect(
        fileService.processUploadedFile(
          fileData,
          "test_request",
          "request-123",
        ),
      ).rejects.toThrow("Database error");

      expect(fs.unlink).toHaveBeenCalledWith("/tmp/upload-123");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("validateFile", () => {
    it("should validate allowed file types", () => {
      const mockFile1 = { mimetype: "application/pdf", size: 1024 };
      const mockFile2 = { mimetype: "image/jpeg", size: 1024 };
      const mockFile3 = { mimetype: "text/plain", size: 1024 };

      expect(() => fileService.validateFile(mockFile1)).not.toThrow();
      expect(() => fileService.validateFile(mockFile2)).not.toThrow();
      expect(() => fileService.validateFile(mockFile3)).not.toThrow();
    });

    it("should throw error for disallowed file types", () => {
      const mockFile1 = { mimetype: "application/x-executable", size: 1024 };
      const mockFile2 = { mimetype: "video/mp4", size: 1024 };

      expect(() => fileService.validateFile(mockFile1)).toThrow(
        "File type application/x-executable is not allowed",
      );
      expect(() => fileService.validateFile(mockFile2)).toThrow(
        "File type video/mp4 is not allowed",
      );
    });

    it("should throw error for file too large", () => {
      const mockFile = { mimetype: "application/pdf", size: 15 * 1024 * 1024 }; // 15MB

      expect(() => fileService.validateFile(mockFile)).toThrow(
        "File size 15728640 exceeds maximum 10485760 bytes",
      );
    });

    it("should validate file size within limits", () => {
      const mockFile1 = { mimetype: "application/pdf", size: 1024 };
      const mockFile2 = { mimetype: "application/pdf", size: 5 * 1024 * 1024 }; // 5MB

      expect(() => fileService.validateFile(mockFile1)).not.toThrow();
      expect(() => fileService.validateFile(mockFile2)).not.toThrow();
    });

    it("should use custom options for validation", () => {
      const mockFile = { mimetype: "video/mp4", size: 1024 };
      const options = {
        allowedMimeTypes: ["video/mp4", "video/avi"],
        maxSize: 2048,
      };

      expect(() => fileService.validateFile(mockFile, options)).not.toThrow();
    });

    it("should throw error when file exceeds custom size limit", () => {
      const mockFile = { mimetype: "application/pdf", size: 3000 };
      const options = { maxSize: 2048 };

      expect(() => fileService.validateFile(mockFile, options)).toThrow(
        "File size 3000 exceeds maximum 2048 bytes",
      );
    });
  });

  describe("getMulterConfig", () => {
    it("should return multer configuration with default options", () => {
      const config = fileService.getMulterConfig();

      expect(config).toBeDefined();
      // The actual multer instance is mocked, so we can't test internal implementation
      // but we can verify the method exists and returns something
    });

    it("should return multer configuration with custom options", () => {
      const options = {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedMimeTypes: ["image/jpeg", "image/png"],
        destinationPath: "/custom/uploads",
      };

      const config = fileService.getMulterConfig(options);

      expect(config).toBeDefined();
    });
  });

  describe("generateDownloadUrl", () => {
    it("should generate download URL for file ID", () => {
      const fileId = "file-123";
      const expectedUrl = "/api/v1/files/file-123/download";

      const result = fileService.generateDownloadUrl(fileId);

      expect(result).toBe(expectedUrl);
    });
  });
});
