// Mock dependencies first, before any imports to avoid hoisting issues
const mockPrismaAuditTrail = {
  create: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  ...jest.requireActual("@prisma/client"),
  PrismaClient: jest.fn().mockImplementation(() => ({
    auditTrail: mockPrismaAuditTrail,
  })),
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

// Import services and types after mocks
import { AuditService } from "../services/AuditService";
import logger from "../utils/logger";
import { AuditTrail } from "@prisma/client";

describe("AuditService", () => {
  let auditService: AuditService;

  beforeEach(() => {
    jest.clearAllMocks();
    auditService = new AuditService();
  });

  describe("logAction", () => {
    it("should log an action successfully", async () => {
      const logData = {
        userId: "user-123",
        action: "CREATE_TEST_REQUEST",
        entityType: "TestRequest",
        entityId: "req-123",
        details: { requestNo: "REQ-001" },
      };

      const mockCreatedLog: AuditTrail = {
        id: "log-123",
        userId: logData.userId,
        action: logData.action,
        entityType: logData.entityType,
        entityId: logData.entityId,
        details: logData.details,
        timestamp: new Date(),
        user: null, // Mock value for relation
      } as unknown as AuditTrail; // Type casting to satisfy strict checking if needed

      mockPrismaAuditTrail.create.mockResolvedValue(mockCreatedLog);

      const result = await auditService.logAction(logData);

      expect(mockPrismaAuditTrail.create).toHaveBeenCalledWith({
        data: logData,
      });
      expect(result).toEqual(mockCreatedLog);
      expect(logger.info).toHaveBeenCalled();
    });

    it("should handle logging errors", async () => {
      const logData = {
        action: "TEST_ACTION",
        entityType: "Test",
      };

      const error = new Error("Database error");
      mockPrismaAuditTrail.create.mockRejectedValue(error);

      await expect(auditService.logAction(logData)).rejects.toThrow(
        "Database error",
      );
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getAuditLogs", () => {
    it("should return paginated audit logs", async () => {
      const filters = {
        userId: "user-123",
      };

      const mockLogs: AuditTrail[] = [
        {
          id: "log-1",
          action: "ACTION_1",
          userId: "user-123",
          entityType: "Test",
          entityId: "entity-1",
          timestamp: new Date(),
          details: null,
        } as unknown as AuditTrail,
        {
          id: "log-2",
          action: "ACTION_2",
          userId: "user-123",
          entityType: "Test",
          entityId: "entity-2",
          timestamp: new Date(),
          details: null,
        } as unknown as AuditTrail,
      ];

      mockPrismaAuditTrail.findMany.mockResolvedValue(mockLogs);
      mockPrismaAuditTrail.count.mockResolvedValue(2);

      const result = await auditService.getAuditLogs(filters, 1, 10);

      expect(mockPrismaAuditTrail.findMany).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        skip: 0,
        take: 10,
        orderBy: { timestamp: "desc" },
        include: expect.any(Object),
      });
      expect(result).toEqual({
        logs: mockLogs,
        total: 2,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should apply date filters correctly", async () => {
      const startDate = new Date("2024-01-01T00:00:00.000Z");
      const endDate = new Date("2024-01-31T23:59:59.999Z");

      const filters = {
        startDate,
        endDate,
      };

      mockPrismaAuditTrail.findMany.mockResolvedValue([]);
      mockPrismaAuditTrail.count.mockResolvedValue(0);

      await auditService.getAuditLogs(filters);

      expect(mockPrismaAuditTrail.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            timestamp: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      );
    });
  });
});
