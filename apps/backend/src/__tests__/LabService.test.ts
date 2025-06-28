// Mock all dependencies first, before any imports
const mockPrismaLabTest = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrismaLabResult = {
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrismaTestRequestSample = {
  findUnique: jest.fn(),
  update: jest.fn(),
};

const mockPrismaUser = {
  findMany: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    labTest: mockPrismaLabTest,
    labResult: mockPrismaLabResult,
    testRequestSample: mockPrismaTestRequestSample,
    user: mockPrismaUser,
  })),
  LabResultStatus: {
    PENDING: "PENDING",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    APPROVED: "APPROVED",
  },
  TestRequestSampleStatus: {
    RECEIVED: "RECEIVED",
    IN_TESTING: "IN_TESTING",
    COMPLETED: "COMPLETED",
  },
  UserRole: {
    LAB_TECHNICIAN: "LAB_TECHNICIAN",
  },
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Now import after all mocks are set up
import { LabService } from "../services/LabService";
import type {
  CreateLabTestData,
  UpdateLabTestData,
  CreateLabResultData,
  UpdateLabResultData,
} from "../services/LabService";
import logger from "../utils/logger";

describe("LabService", () => {
  let labService: LabService;

  const mockLabTest = {
    id: "lab-test-123",
    testRequestSampleId: "sample-123",
    caseNo: "CASE-2024-001",
    caseDate: new Date(),
    assignedLabTechnicianId: "tech-123",
    testPanel: "Blood Panel",
    testMethod: "PCR",
    labResultStatus: "PENDING",
    notes: "Test notes",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockLabResult = {
    id: "result-123",
    labTestId: "lab-test-123",
    parameter: "Glucose",
    value: "85",
    unit: "mg/dL",
    referenceRange: "70-100",
    isAbnormal: false,
    notes: "Normal range",
    recordedById: "tech-123",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createLabTestData: CreateLabTestData = {
    testRequestSampleId: "sample-123",
    assignedLabTechnicianId: "tech-123",
    testPanel: "Blood Panel",
    testMethod: "PCR",
    notes: "Test notes",
  };

  const createLabResultData: CreateLabResultData = {
    labTestId: "lab-test-123",
    parameter: "Glucose",
    value: "85",
    unit: "mg/dL",
    referenceRange: "70-100",
    isAbnormal: false,
    notes: "Normal range",
    recordedById: "tech-123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    labService = new LabService();

    // Mock the generateCaseNumber method
    jest
      .spyOn(labService as any, "generateCaseNumber")
      .mockReturnValue("CASE-2024-001");
  });

  describe("createLabTest", () => {
    it("should create a lab test successfully", async () => {
      const mockLabTestWithDetails = {
        ...mockLabTest,
        testRequestSample: {
          id: "sample-123",
          customerSampleId: "SAMPLE-001",
          testRequest: {
            requestNo: "REQ-2024-001",
          },
        },
        assignedLabTechnician: {
          id: "tech-123",
          email: "tech@example.com",
        },
        labResults: [],
      };

      mockPrismaLabTest.create.mockResolvedValue(mockLabTestWithDetails);

      const result = await labService.createLabTest(createLabTestData);

      expect(mockPrismaLabTest.create).toHaveBeenCalledWith({
        data: {
          testRequestSampleId: createLabTestData.testRequestSampleId,
          caseNo: "CASE-2024-001",
          caseDate: expect.any(Date),
          assignedLabTechnicianId: createLabTestData.assignedLabTechnicianId,
          testPanel: createLabTestData.testPanel,
          testMethod: createLabTestData.testMethod,
          notes: createLabTestData.notes,
          labResultStatus: "PENDING",
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockLabTestWithDetails);
      expect(logger.info).toHaveBeenCalledWith(
        "Lab test created: CASE-2024-001",
      );
    });

    it("should handle lab test creation errors", async () => {
      const createError = new Error("Database error");
      mockPrismaLabTest.create.mockRejectedValue(createError);

      await expect(labService.createLabTest(createLabTestData)).rejects.toThrow(
        "Database error",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getLabTestById", () => {
    it("should return lab test with details when found", async () => {
      const mockLabTestWithDetails = {
        ...mockLabTest,
        testRequestSample: {
          testRequest: { customer: { companyNameEn: "Test Company" } },
        },
        assignedLabTechnician: { email: "tech@example.com" },
        labResults: [mockLabResult],
      };

      mockPrismaLabTest.findUnique.mockResolvedValue(mockLabTestWithDetails);

      const result = await labService.getLabTestById("lab-test-123");

      expect(mockPrismaLabTest.findUnique).toHaveBeenCalledWith({
        where: { id: "lab-test-123" },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockLabTestWithDetails);
    });

    it("should return null when lab test not found", async () => {
      mockPrismaLabTest.findUnique.mockResolvedValue(null);

      const result = await labService.getLabTestById("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaLabTest.findUnique.mockRejectedValue(dbError);

      await expect(labService.getLabTestById("lab-test-123")).rejects.toThrow(
        "Database error",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateLabTest", () => {
    const updateData: UpdateLabTestData = {
      labResultStatus: "COMPLETED",
      notes: "Updated notes",
    };

    it("should update lab test successfully", async () => {
      const updatedLabTest = {
        ...mockLabTest,
        ...updateData,
        caseNo: "CASE-2024-001",
        testRequestSample: {
          testRequest: {
            requestNo: "REQ-2024-001",
          },
        },
        assignedLabTechnician: {
          id: "tech-123",
          email: "tech@example.com",
        },
      };
      mockPrismaLabTest.update.mockResolvedValue(updatedLabTest);

      const result = await labService.updateLabTest("lab-test-123", updateData);

      expect(mockPrismaLabTest.update).toHaveBeenCalledWith({
        where: { id: "lab-test-123" },
        data: updateData,
        include: {
          testRequestSample: {
            include: {
              testRequest: {
                select: {
                  requestNo: true,
                },
              },
            },
          },
          assignedLabTechnician: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedLabTest);
      expect(logger.info).toHaveBeenCalledWith(
        "Lab test updated: CASE-2024-001",
      );
    });

    it("should handle update errors", async () => {
      const updateError = new Error("Update failed");
      mockPrismaLabTest.update.mockRejectedValue(updateError);

      await expect(
        labService.updateLabTest("lab-test-123", updateData),
      ).rejects.toThrow("Update failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("createLabResult", () => {
    it("should create a lab result successfully", async () => {
      const mockLabResultWithDetails = {
        ...mockLabResult,
        labTest: {
          caseNo: "CASE-2024-001",
        },
        recordedBy: {
          id: "tech-123",
          email: "tech@example.com",
        },
      };

      const mockUpdatedLabTest = {
        ...mockLabTest,
        labResultStatus: "PARTIAL",
      };

      mockPrismaLabResult.create.mockResolvedValue(mockLabResultWithDetails);
      mockPrismaLabResult.count.mockResolvedValue(1);
      mockPrismaLabTest.update.mockResolvedValue(mockUpdatedLabTest);

      const result = await labService.createLabResult(createLabResultData);

      expect(mockPrismaLabResult.create).toHaveBeenCalledWith({
        data: {
          labTestId: createLabResultData.labTestId,
          parameter: createLabResultData.parameter,
          value: createLabResultData.value,
          unit: createLabResultData.unit,
          referenceRange: createLabResultData.referenceRange,
          isAbnormal: false,
          notes: createLabResultData.notes,
          recordedById: createLabResultData.recordedById,
        },
        include: {
          labTest: {
            select: {
              caseNo: true,
            },
          },
          recordedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(mockLabResultWithDetails);
      expect(logger.info).toHaveBeenCalledWith(
        "Lab result created for test: CASE-2024-001",
      );
    });

    it("should handle lab result creation errors", async () => {
      const createError = new Error("Database error");
      mockPrismaLabResult.create.mockRejectedValue(createError);

      await expect(
        labService.createLabResult(createLabResultData),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getLabTestsByTechnician", () => {
    it("should return paginated lab tests for technician", async () => {
      const mockLabTests = [mockLabTest];
      const totalCount = 1;

      mockPrismaLabTest.findMany.mockResolvedValue(mockLabTests);
      mockPrismaLabTest.count.mockResolvedValue(totalCount);

      const result = await labService.getLabTestsByTechnician("tech-123");

      expect(mockPrismaLabTest.findMany).toHaveBeenCalledWith({
        where: { assignedLabTechnicianId: "tech-123" },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrismaLabTest.count).toHaveBeenCalledWith({
        where: { assignedLabTechnicianId: "tech-123" },
      });
      expect(result).toEqual({
        labTests: mockLabTests,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should filter by status when provided", async () => {
      const mockLabTests: any[] = [];
      mockPrismaLabTest.findMany.mockResolvedValue(mockLabTests);
      mockPrismaLabTest.count.mockResolvedValue(0);

      await labService.getLabTestsByTechnician("tech-123", 1, 10, "COMPLETED");

      expect(mockPrismaLabTest.findMany).toHaveBeenCalledWith({
        where: {
          assignedLabTechnicianId: "tech-123",
          labResultStatus: "COMPLETED",
        },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaLabTest.findMany.mockRejectedValue(dbError);

      await expect(
        labService.getLabTestsByTechnician("tech-123"),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getAvailableTechnicians", () => {
    it("should return available lab technicians", async () => {
      const mockTechnicians = [
        {
          id: "tech-1",
          email: "tech1@example.com",
          role: "LAB_TECHNICIAN",
        },
        {
          id: "tech-2",
          email: "tech2@example.com",
          role: "LAB_TECHNICIAN",
        },
      ];

      mockPrismaUser.findMany.mockResolvedValue(mockTechnicians);

      const result = await labService.getAvailableTechnicians();

      expect(mockPrismaUser.findMany).toHaveBeenCalledWith({
        where: {
          role: "TECHNICIAN",
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      expect(result).toEqual(mockTechnicians);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaUser.findMany.mockRejectedValue(dbError);

      await expect(labService.getAvailableTechnicians()).rejects.toThrow(
        "Database error",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateLabResult", () => {
    const updateLabResultData: UpdateLabResultData = {
      value: "95",
      isAbnormal: true,
      notes: "Updated result",
    };

    it("should update lab result successfully", async () => {
      const mockUpdatedLabResult = {
        ...mockLabResult,
        ...updateLabResultData,
        labTest: {
          caseNo: "CASE-2024-001",
        },
        recordedBy: {
          id: "tech-123",
          email: "tech@example.com",
        },
      };

      mockPrismaLabResult.update.mockResolvedValue(mockUpdatedLabResult);

      const result = await labService.updateLabResult(
        "result-123",
        updateLabResultData,
      );

      expect(mockPrismaLabResult.update).toHaveBeenCalledWith({
        where: { id: "result-123" },
        data: updateLabResultData,
        include: {
          labTest: {
            select: {
              caseNo: true,
            },
          },
          recordedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(mockUpdatedLabResult);
      expect(logger.info).toHaveBeenCalledWith(
        "Lab result updated for test: CASE-2024-001",
      );
    });

    it("should handle update errors", async () => {
      const updateError = new Error("Update failed");
      mockPrismaLabResult.update.mockRejectedValue(updateError);

      await expect(
        labService.updateLabResult("result-123", updateLabResultData),
      ).rejects.toThrow("Update failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteLabTest", () => {
    it("should delete lab test successfully", async () => {
      mockPrismaLabTest.delete.mockResolvedValue(mockLabTest);

      const result = await labService.deleteLabResult("lab-test-123");

      expect(mockPrismaLabResult.delete).toHaveBeenCalledWith({
        where: { id: "lab-test-123" },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith(
        "Lab result deleted: lab-test-123",
      );
    });

    it("should handle delete errors", async () => {
      const deleteError = new Error("Delete failed");
      mockPrismaLabResult.delete.mockRejectedValue(deleteError);

      await expect(labService.deleteLabResult("lab-test-123")).rejects.toThrow(
        "Delete failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getLabStatistics", () => {
    it("should return lab statistics", async () => {
      // Mock the individual count calls that getLabStatistics makes
      mockPrismaLabTest.count
        .mockResolvedValueOnce(15) // totalTests
        .mockResolvedValueOnce(5) // pendingTests
        .mockResolvedValueOnce(3) // inProgressTests (PARTIAL)
        .mockResolvedValueOnce(2) // completedTests
        .mockResolvedValueOnce(1) // reviewedTests
        .mockResolvedValueOnce(4); // approvedTests

      mockPrismaLabResult.count
        .mockResolvedValueOnce(50) // totalResults
        .mockResolvedValueOnce(10); // abnormalResults

      const result = await labService.getLabStatistics();

      expect(result).toEqual({
        totalTests: 15,
        pendingTests: 5,
        inProgressTests: 3,
        completedTests: 2,
        reviewedTests: 1,
        approvedTests: 4,
        totalResults: 50,
        abnormalResults: 10,
        abnormalRate: 20, // (10 / 50) * 100
      });
    });

    it("should handle zero tests case", async () => {
      mockPrismaLabTest.count
        .mockResolvedValueOnce(0) // totalTests
        .mockResolvedValueOnce(0) // pendingTests
        .mockResolvedValueOnce(0) // inProgressTests
        .mockResolvedValueOnce(0) // completedTests
        .mockResolvedValueOnce(0) // reviewedTests
        .mockResolvedValueOnce(0); // approvedTests

      mockPrismaLabResult.count
        .mockResolvedValueOnce(0) // totalResults
        .mockResolvedValueOnce(0); // abnormalResults

      const result = await labService.getLabStatistics();

      expect(result.totalTests).toBe(0);
      expect(result.abnormalRate).toBe(0);
    });

    it("should handle statistics errors", async () => {
      const statsError = new Error("Statistics query failed");
      mockPrismaLabTest.count.mockRejectedValue(statsError);

      await expect(labService.getLabStatistics()).rejects.toThrow(
        "Statistics query failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getAllLabTests", () => {
    it("should return paginated lab tests", async () => {
      const mockLabTests = [mockLabTest];
      const totalCount = 1;

      mockPrismaLabTest.findMany.mockResolvedValue(mockLabTests);
      mockPrismaLabTest.count.mockResolvedValue(totalCount);

      const result = await labService.getAllLabTests();

      expect(mockPrismaLabTest.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrismaLabTest.count).toHaveBeenCalledWith({
        where: {},
      });
      expect(result).toEqual({
        labTests: mockLabTests,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should filter by status when provided", async () => {
      const mockLabTests: any[] = [];
      mockPrismaLabTest.findMany.mockResolvedValue(mockLabTests);
      mockPrismaLabTest.count.mockResolvedValue(0);

      await labService.getAllLabTests(1, 10, "COMPLETED");

      expect(mockPrismaLabTest.findMany).toHaveBeenCalledWith({
        where: { labResultStatus: "COMPLETED" },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaLabTest.findMany.mockRejectedValue(dbError);

      await expect(labService.getAllLabTests()).rejects.toThrow(
        "Database error",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("completeLabTest", () => {
    it("should complete lab test successfully", async () => {
      const mockLabTestWithResults = {
        ...mockLabTest,
        labResults: [mockLabResult],
        testRequestSample: {
          testRequestId: "request-123",
        },
      };

      const mockCompletedLabTest = {
        ...mockLabTest,
        labResultStatus: "COMPLETED",
        testRequestSample: {
          testRequestId: "request-123",
          testRequest: {
            id: "request-123",
          },
        },
      };

      mockPrismaLabTest.findUnique.mockResolvedValue(mockLabTestWithResults);
      mockPrismaLabTest.update.mockResolvedValue(mockCompletedLabTest);
      mockPrismaTestRequestSample.update.mockResolvedValue({});

      const result = await labService.completeLabTest(
        "lab-test-123",
        "user-123",
      );

      expect(mockPrismaLabTest.findUnique).toHaveBeenCalledWith({
        where: { id: "lab-test-123" },
        include: { labResults: true },
      });
      expect(mockPrismaLabTest.update).toHaveBeenCalledWith({
        where: { id: "lab-test-123" },
        data: { labResultStatus: "COMPLETED" },
        include: {
          testRequestSample: {
            include: {
              testRequest: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCompletedLabTest);
      expect(logger.info).toHaveBeenCalledWith(
        `Lab test completed: ${mockLabTest.caseNo}`,
      );
    });

    it("should throw error when lab test not found", async () => {
      mockPrismaLabTest.findUnique.mockResolvedValue(null);

      await expect(
        labService.completeLabTest("nonexistent", "user-123"),
      ).rejects.toThrow("Lab test not found");
    });

    it("should throw error when no results exist", async () => {
      const mockLabTestWithoutResults = {
        ...mockLabTest,
        labResults: [],
      };

      mockPrismaLabTest.findUnique.mockResolvedValue(mockLabTestWithoutResults);

      await expect(
        labService.completeLabTest("lab-test-123", "user-123"),
      ).rejects.toThrow("Cannot complete lab test without any results");
    });

    it("should handle completion errors", async () => {
      const dbError = new Error("Completion failed");
      mockPrismaLabTest.findUnique.mockRejectedValue(dbError);

      await expect(
        labService.completeLabTest("lab-test-123", "user-123"),
      ).rejects.toThrow("Completion failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("searchLabTests", () => {
    it("should search lab tests by various criteria", async () => {
      const mockLabTests = [mockLabTest];
      mockPrismaLabTest.findMany.mockResolvedValue(mockLabTests);

      const result = await labService.searchLabTests("CASE-2024");

      expect(mockPrismaLabTest.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { caseNo: { contains: "CASE-2024", mode: "insensitive" } },
            { testPanel: { contains: "CASE-2024", mode: "insensitive" } },
            { testMethod: { contains: "CASE-2024", mode: "insensitive" } },
            {
              testRequestSample: {
                customerSampleId: {
                  contains: "CASE-2024",
                  mode: "insensitive",
                },
              },
            },
            {
              testRequestSample: {
                testRequest: {
                  requestNo: { contains: "CASE-2024", mode: "insensitive" },
                },
              },
            },
          ],
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockLabTests);
    });

    it("should handle search errors", async () => {
      const searchError = new Error("Search failed");
      mockPrismaLabTest.findMany.mockRejectedValue(searchError);

      await expect(labService.searchLabTests("test")).rejects.toThrow(
        "Search failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
