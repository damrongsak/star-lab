// Mock all dependencies first, before any imports
const mockPrismaTestRequest = {
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
};

const mockPrismaTestRequestSample = {
  create: jest.fn(),
  findUnique: jest.fn(),
  findMany: jest.fn(),
  update: jest.fn(),
  deleteMany: jest.fn(),
  count: jest.fn(),
};

const mockPrismaCustomer = {
  findUnique: jest.fn(),
};

const mockPrismaUser = {
  findUnique: jest.fn(),
};

const mockPrismaLabTest = {
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    testRequest: mockPrismaTestRequest,
    testRequestSample: mockPrismaTestRequestSample,
    customer: mockPrismaCustomer,
    user: mockPrismaUser,
    labTest: mockPrismaLabTest,
  })),
  TestRequestDocumentStatus: {
    DRAFT: "DRAFT",
    SUBMITTED: "SUBMITTED",
    APPROVED: "APPROVED",
    REJECTED: "REJECTED",
  },
  LabInternalStatus: {
    RECEIVED: "RECEIVED",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    DELIVERED: "DELIVERED",
  },
  TestRequestSampleStatus: {
    PENDING: "PENDING",
    RECEIVED: "RECEIVED",
    IN_TESTING: "IN_TESTING",
    COMPLETED: "COMPLETED",
    REJECTED: "REJECTED",
  },
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Import the service after mocks are set up
import { TestRequestService } from "../services/TestRequestService";
import logger from "../utils/logger";

describe("TestRequestService", () => {
  let testRequestService: TestRequestService;

  beforeEach(() => {
    jest.clearAllMocks();
    testRequestService = new TestRequestService();
  });

  describe("createTestRequest", () => {
    it("should create a test request with samples successfully", async () => {
      const createData = {
        customerId: "customer-123",
        requesterName: "John Doe",
        objective: "Quality testing",
        notes: "Test notes",
        samples: [
          {
            customerSampleId: "SAMPLE-001",
            animalType: "Cat",
            sampleSpecimen: "Blood",
            panel: "CBC",
            method: "Automated",
            requestedQty: 5,
            unit: "ml",
            notes: "Handle with care",
          },
        ],
      };

      const mockRequestNo = "REQ-20241227-123456";
      const mockTestRequest = {
        id: "test-request-123",
        requestNo: mockRequestNo,
        customerId: "customer-123",
        requesterName: "John Doe",
        objective: "Quality testing",
        notes: "Test notes",
        documentStatus: "DRAFT",
        labInternalStatus: "RECEIVED",
        createdAt: new Date(),
        updatedAt: new Date(),
        testRequestSamples: [
          {
            id: "sample-123",
            customerSampleId: "SAMPLE-001",
            animalType: "Cat",
            sampleSpecimen: "Blood",
            panel: "CBC",
            method: "Automated",
            requestedQty: 5,
            unit: "ml",
            notes: "Handle with care",
          },
        ],
      };

      // Mock the private method
      jest
        .spyOn(testRequestService as any, "generateRequestNumber")
        .mockReturnValue(mockRequestNo);
      mockPrismaTestRequest.create.mockResolvedValue(mockTestRequest);

      const result = await testRequestService.createTestRequest(createData);

      expect(mockPrismaTestRequest.create).toHaveBeenCalledWith({
        data: {
          requestNo: mockRequestNo,
          customerId: "customer-123",
          requesterName: "John Doe",
          objective: "Quality testing",
          projectId: undefined,
          notes: "Test notes",
          testRequestSamples: {
            create: [
              {
                customerSampleId: "SAMPLE-001",
                sentSampleDate: undefined,
                animalType: "Cat",
                sampleSpecimen: "Blood",
                panel: "CBC",
                method: "Automated",
                requestedQty: 5,
                unit: "ml",
                notes: "Handle with care",
              },
            ],
          },
        },
        include: {
          testRequestSamples: true,
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          project: true,
        },
      });
      expect(result).toEqual(mockTestRequest);
      expect(logger.info).toHaveBeenCalledWith(
        `Test request created: ${mockRequestNo}`,
      );
    });

    it("should handle database errors", async () => {
      const createData = {
        customerId: "customer-123",
        requesterName: "John Doe",
        samples: [
          {
            customerSampleId: "SAMPLE-001",
            requestedQty: 5,
          },
        ],
      };

      const dbError = new Error("Database error");
      jest
        .spyOn(testRequestService as any, "generateRequestNumber")
        .mockReturnValue("REQ-20241227-123456");
      mockPrismaTestRequest.create.mockRejectedValue(dbError);

      await expect(
        testRequestService.createTestRequest(createData),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getTestRequestById", () => {
    it("should return test request with details when found", async () => {
      const mockTestRequest = {
        id: "test-request-123",
        requestNo: "TR-2024-001",
        customerId: "customer-123",
        requesterName: "John Doe",
        customer: {
          id: "customer-123",
          companyNameEn: "Test Company",
          companyNameTh: "company-th",
        },
        samples: [
          {
            id: "sample-123",
            customerSampleId: "SAMPLE-001",
            currentStatus: "PENDING",
          },
        ],
      };

      mockPrismaTestRequest.findUnique.mockResolvedValue(mockTestRequest);

      const result =
        await testRequestService.getTestRequestById("test-request-123");

      expect(mockPrismaTestRequest.findUnique).toHaveBeenCalledWith({
        where: { id: "test-request-123" },
        include: {
          testRequestSamples: {
            include: {
              labTests: {
                include: {
                  labResults: true,
                  assignedLabTechnician: {
                    select: {
                      id: true,
                      email: true,
                    },
                  },
                },
              },
              storageLocation: true,
            },
          },
          customer: {
            include: {
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          project: true,
          invoices: {
            include: {
              invoiceLineItems: true,
            },
          },
        },
      });
      expect(result).toEqual(mockTestRequest);
    });

    it("should return null when test request not found", async () => {
      mockPrismaTestRequest.findUnique.mockResolvedValue(null);

      const result =
        await testRequestService.getTestRequestById("non-existent-id");

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaTestRequest.findUnique.mockRejectedValue(dbError);

      await expect(
        testRequestService.getTestRequestById("test-request-123"),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getTestRequestsByCustomer", () => {
    it("should return paginated test requests for customer", async () => {
      const mockTestRequests = [
        {
          id: "test-request-1",
          requestNo: "TR-2024-001",
          customerId: "customer-123",
          requesterName: "John Doe",
          documentStatus: "SUBMITTED",
          labInternalStatus: "IN_PROGRESS",
          createdAt: new Date(),
        },
        {
          id: "test-request-2",
          requestNo: "TR-2024-002",
          customerId: "customer-123",
          requesterName: "Jane Smith",
          documentStatus: "APPROVED",
          labInternalStatus: "COMPLETED",
          createdAt: new Date(),
        },
      ];

      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);
      mockPrismaTestRequest.count.mockResolvedValue(2);

      const result = await testRequestService.getTestRequestsByCustomer(
        "customer-123",
        1,
        10,
      );

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: { customerId: "customer-123" },
        skip: 0,
        take: 10,
        include: {
          testRequestSamples: true,
          project: true,
        },
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrismaTestRequest.count).toHaveBeenCalledWith({
        where: { customerId: "customer-123" },
      });
      expect(result).toEqual({
        testRequests: mockTestRequests,
        total: 2,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should filter by status when provided", async () => {
      const mockTestRequests: any[] = [];
      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);
      mockPrismaTestRequest.count.mockResolvedValue(0);

      await testRequestService.getTestRequestsByCustomer("customer-123", 1, 10);

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: { customerId: "customer-123" },
        skip: 0,
        take: 10,
        include: {
          testRequestSamples: true,
          project: true,
        },
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaTestRequest.findMany.mockRejectedValue(dbError);

      await expect(
        testRequestService.getTestRequestsByCustomer("customer-123", 1, 10),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateTestRequest", () => {
    it("should update test request successfully", async () => {
      const updateData = {
        requesterName: "Updated Name",
        objective: "Updated objective",
        documentStatus: "SUBMITTED" as const,
        labInternalStatus: "IN_PROGRESS" as const,
      };

      const mockUpdatedTestRequest = {
        id: "test-request-123",
        requestNo: "TR-2024-001",
        requesterName: "Updated Name",
        objective: "Updated objective",
        documentStatus: "SUBMITTED",
        labInternalStatus: "IN_PROGRESS",
      };

      mockPrismaTestRequest.update.mockResolvedValue(mockUpdatedTestRequest);

      const result = await testRequestService.updateTestRequest(
        "test-request-123",
        updateData,
      );

      expect(mockPrismaTestRequest.update).toHaveBeenCalledWith({
        where: { id: "test-request-123" },
        data: updateData,
        include: {
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          project: true,
          testRequestSamples: true,
        },
      });
      expect(result).toEqual(mockUpdatedTestRequest);
    });

    it("should handle database errors", async () => {
      const updateData = { requesterName: "Updated Name" };
      const dbError = new Error("Update failed");
      mockPrismaTestRequest.update.mockRejectedValue(dbError);

      await expect(
        testRequestService.updateTestRequest("test-request-123", updateData),
      ).rejects.toThrow("Update failed");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateTestRequestSample", () => {
    it("should update test request sample successfully", async () => {
      const updateData = {
        receivedQty: 5,
        currentStatus: "RECEIVED" as const,
        storageLocationId: "storage-123",
        notes: "Sample received",
      };

      const mockUpdatedSample = {
        id: "sample-123",
        customerSampleId: "SAMPLE-001",
        receivedQty: 5,
        currentStatus: "RECEIVED",
        storageLocationId: "storage-123",
        notes: "Sample received",
      };

      mockPrismaTestRequestSample.update.mockResolvedValue(mockUpdatedSample);

      const result = await testRequestService.updateTestRequestSample(
        "sample-123",
        updateData,
      );

      expect(mockPrismaTestRequestSample.update).toHaveBeenCalledWith({
        where: { id: "sample-123" },
        data: updateData,
        include: {
          storageLocation: true,
          testRequest: {
            select: {
              requestNo: true,
            },
          },
        },
      });
      expect(result).toEqual(mockUpdatedSample);
    });

    it("should handle database errors", async () => {
      const updateData = { receivedQty: 5 };
      const dbError = new Error("Update failed");
      mockPrismaTestRequestSample.update.mockRejectedValue(dbError);

      await expect(
        testRequestService.updateTestRequestSample("sample-123", updateData),
      ).rejects.toThrow("Update failed");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getAllTestRequests", () => {
    it("should return paginated test requests", async () => {
      const mockTestRequests = [
        {
          id: "test-request-1",
          requestNo: "TR-2024-001",
          customerId: "customer-123",
          requesterName: "John Doe",
          documentStatus: "SUBMITTED",
          labInternalStatus: "IN_PROGRESS",
          createdAt: new Date(),
          customer: {
            companyNameEn: "Test Company",
          },
        },
      ];

      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);
      mockPrismaTestRequest.count.mockResolvedValue(1);

      const result = await testRequestService.getAllTestRequests(1, 10);

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: {},
        include: {
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          project: true,
          testRequestSamples: true,
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
      expect(result).toEqual({
        testRequests: mockTestRequests,
        total: 1,
        currentPage: 1,
        totalPages: 1,
      });
    });

    it("should filter by status when provided", async () => {
      const mockTestRequests: any[] = [];
      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);
      mockPrismaTestRequest.count.mockResolvedValue(0);

      await testRequestService.getAllTestRequests(1, 10, "IN_PROGRESS");

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: { labInternalStatus: "IN_PROGRESS" },
        include: {
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          project: true,
          testRequestSamples: true,
        },
        orderBy: { createdAt: "desc" },
        skip: 0,
        take: 10,
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaTestRequest.findMany.mockRejectedValue(dbError);

      await expect(
        testRequestService.getAllTestRequests(1, 10),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getTestRequestStatistics", () => {
    it("should return test request statistics", async () => {
      const mockStats = [50, 10, 15, 20, 5, 30];
      jest.spyOn(Promise, "all").mockResolvedValue(mockStats);

      const result = await testRequestService.getTestRequestStatistics();

      expect(result).toEqual({
        totalRequests: 50,
        pendingApproval: 10,
        inProgress: 15,
        completed: 20,
        samplesReceived: 5,
        samplesInTesting: 30,
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Statistics query failed");
      jest.spyOn(Promise, "all").mockRejectedValue(dbError);

      await expect(
        testRequestService.getTestRequestStatistics(),
      ).rejects.toThrow("Statistics query failed");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("assignTechnicianToSample", () => {
    it("should assign technician to sample successfully", async () => {
      const mockSample = {
        id: "sample-123",
        testRequestId: "request-123",
        customerSampleId: "SAMPLE-001",
        panel: "Basic Panel",
        method: "Standard Method",
        testRequest: {
          id: "request-123",
        },
      };

      const mockLabTest = {
        id: "lab-test-123",
        caseNo: "CASE-001",
        assignedLabTechnicianId: "tech-123",
      };

      mockPrismaTestRequestSample.findUnique.mockResolvedValue(mockSample);
      mockPrismaLabTest.findFirst.mockResolvedValue(null);
      mockPrismaLabTest.create.mockResolvedValue(mockLabTest);
      mockPrismaTestRequest.update.mockResolvedValue({});

      const result = await testRequestService.assignTechnicianToSample(
        "sample-123",
        "tech-123",
      );

      expect(mockPrismaTestRequestSample.findUnique).toHaveBeenCalledWith({
        where: { id: "sample-123" },
        include: { testRequest: true },
      });
      expect(mockPrismaLabTest.create).toHaveBeenCalled();
      expect(result).toEqual(mockLabTest);
    });

    it("should throw error when sample not found", async () => {
      mockPrismaTestRequestSample.findUnique.mockResolvedValue(null);

      await expect(
        testRequestService.assignTechnicianToSample("sample-123", "tech-123"),
      ).rejects.toThrow("Sample not found");
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaTestRequestSample.findUnique.mockRejectedValue(dbError);

      await expect(
        testRequestService.assignTechnicianToSample("sample-123", "tech-123"),
      ).rejects.toThrow("Database error");
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("searchTestRequests", () => {
    it("should search test requests by request number", async () => {
      const mockTestRequests = [
        {
          id: "test-request-1",
          requestNo: "TR-2024-001",
          customerId: "customer-123",
          requesterName: "John Doe",
          customer: {
            companyNameEn: "Test Company",
          },
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              currentStatus: "PENDING",
            },
          ],
        },
      ];

      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);

      const result = await testRequestService.searchTestRequests("TR-2024");

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { requestNo: { contains: "TR-2024", mode: "insensitive" } },
            { requesterName: { contains: "TR-2024", mode: "insensitive" } },
            {
              customer: {
                companyNameEn: { contains: "TR-2024", mode: "insensitive" },
              },
            },
            {
              customer: {
                companyNameTh: { contains: "TR-2024", mode: "insensitive" },
              },
            },
            {
              testRequestSamples: {
                some: {
                  customerSampleId: {
                    contains: "TR-2024",
                    mode: "insensitive",
                  },
                },
              },
            },
          ],
        },
        include: {
          testRequestSamples: true,
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          project: true,
        },
      });
      expect(result).toEqual(mockTestRequests);
    });

    it("should return empty array when no matches found", async () => {
      mockPrismaTestRequest.findMany.mockResolvedValue([]);

      const result = await testRequestService.searchTestRequests("nonexistent");

      expect(result).toEqual([]);
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Search failed");
      mockPrismaTestRequest.findMany.mockRejectedValue(dbError);

      await expect(
        testRequestService.searchTestRequests("search-term"),
      ).rejects.toThrow("Search failed");
      expect(logger.error).toHaveBeenCalled();
    });
  });
});
