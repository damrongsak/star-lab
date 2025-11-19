import { Request, Response } from "express";
import { TestRequestService } from "../services/TestRequestService";
import { CustomerService } from "../services/CustomerService";
import logger from "../utils/logger";

// Create mock instances
const mockCreateTestRequest = jest.fn();
const mockGetCustomerByUserId = jest.fn();

// Mock dependencies
jest.mock("../services/TestRequestService", () => {
  return {
    TestRequestService: jest.fn().mockImplementation(() => ({
      createTestRequest: mockCreateTestRequest,
    })),
  };
});

jest.mock("../services/CustomerService", () => {
  return {
    CustomerService: jest.fn().mockImplementation(() => ({
      getCustomerByUserId: mockGetCustomerByUserId,
    })),
  };
});

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
}));

// Import controller AFTER mocks
import { TestRequestController } from "../controllers/TestRequestController";

describe("TestRequestController - Date Conversion", () => {
  let controller: TestRequestController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    controller = new TestRequestController();

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as any;
  });

  describe("createTestRequest - date conversion", () => {
    it("should convert sentSampleDate string to Date object when creating test request", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
        companyNameEn: "Test Company",
        companyNameTh: "บริษัททดสอบ",
      };

      const mockCreatedRequest = {
        id: "request-123",
        requestNo: "REQ-20251119-001",
        customerId: "customer-123",
        requesterName: "John Doe",
        objective: "Testing",
        testRequestSamples: [
          {
            id: "sample-123",
            customerSampleId: "SAMPLE-001",
            sentSampleDate: new Date("2025-11-19T00:00:00.000Z"),
            animalType: "cat",
            sampleSpecimen: "blood",
          },
        ],
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          objective: "Testing",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19", // String format from frontend
              animalType: "cat",
              sampleSpecimen: "blood",
              panel: "CBC",
              method: "automated",
              requestedQty: 1,
              unit: "samples",
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockResolvedValue(mockCreatedRequest as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGetCustomerByUserId).toHaveBeenCalledWith("user-123");
      expect(mockCreateTestRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          customerId: "customer-123",
          requesterName: "John Doe",
          objective: "Testing",
          samples: expect.arrayContaining([
            expect.objectContaining({
              customerSampleId: "SAMPLE-001",
              sentSampleDate: expect.any(Date), // Should be converted to Date object
              animalType: "cat",
              sampleSpecimen: "blood",
            }),
          ]),
        })
      );

      // Verify the date was converted correctly
      const callArgs = mockCreateTestRequest.mock.calls[0][0];
      const sentDate = callArgs.samples[0].sentSampleDate;
      expect(sentDate).toBeInstanceOf(Date);
      expect(sentDate?.toISOString()).toBe("2025-11-19T00:00:00.000Z");

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Test request created successfully",
        testRequest: mockCreatedRequest,
      });
    });

    it("should handle multiple samples with different dates", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "Jane Doe",
          objective: "Multi-sample test",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19",
              requestedQty: 1,
            },
            {
              customerSampleId: "SAMPLE-002",
              sentSampleDate: "2025-12-25",
              requestedQty: 2,
            },
            {
              customerSampleId: "SAMPLE-003",
              sentSampleDate: "2026-01-15",
              requestedQty: 3,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockResolvedValue({
        id: "request-123",
        requestNo: "REQ-001",
      } as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      const callArgs = mockCreateTestRequest.mock.calls[0][0];
      expect(callArgs.samples).toHaveLength(3);

      // Verify all dates were converted
      expect(callArgs.samples[0].sentSampleDate).toBeInstanceOf(Date);
      expect(callArgs.samples[0].sentSampleDate?.toISOString()).toBe("2025-11-19T00:00:00.000Z");

      expect(callArgs.samples[1].sentSampleDate).toBeInstanceOf(Date);
      expect(callArgs.samples[1].sentSampleDate?.toISOString()).toBe("2025-12-25T00:00:00.000Z");

      expect(callArgs.samples[2].sentSampleDate).toBeInstanceOf(Date);
      expect(callArgs.samples[2].sentSampleDate?.toISOString()).toBe("2026-01-15T00:00:00.000Z");

      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should handle missing sentSampleDate gracefully", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              // No sentSampleDate field
              requestedQty: 1,
              unit: "samples",
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockResolvedValue({
        id: "request-123",
        requestNo: "REQ-001",
      } as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      const callArgs = mockCreateTestRequest.mock.calls[0][0];
      expect(callArgs.samples[0].sentSampleDate).toBeUndefined();
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should handle null sentSampleDate", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: null, // Explicitly null
              requestedQty: 1,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockResolvedValue({
        id: "request-123",
        requestNo: "REQ-001",
      } as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      const callArgs = mockCreateTestRequest.mock.calls[0][0];
      expect(callArgs.samples[0].sentSampleDate).toBeUndefined();
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should preserve ISO-8601 date strings", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19T12:30:45.000Z", // Already ISO-8601 format
              requestedQty: 1,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockResolvedValue({
        id: "request-123",
        requestNo: "REQ-001",
      } as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      const callArgs = mockCreateTestRequest.mock.calls[0][0];
      expect(callArgs.samples[0].sentSampleDate).toBeInstanceOf(Date);
      expect(callArgs.samples[0].sentSampleDate?.toISOString()).toBe("2025-11-19T12:30:45.000Z");
      expect(statusMock).toHaveBeenCalledWith(201);
    });
  });

  describe("createTestRequest - customer validation", () => {
    it("should fetch customer before creating test request with dates", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19",
              requestedQty: 1,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockResolvedValue({
        id: "request-123",
        requestNo: "REQ-001",
      } as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert - customer lookup should happen first
      expect(mockGetCustomerByUserId).toHaveBeenCalled();
      expect(mockCreateTestRequest).toHaveBeenCalled();

      // Verify customer lookup was called with correct userId
      expect(mockGetCustomerByUserId).toHaveBeenCalledWith("user-123");

      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Customer found: customer-123")
      );
    });

    it("should return 404 when customer not found, even with valid dates", async () => {
      // Arrange
      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19", // Valid date
              requestedQty: 1,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(null); // Customer not found

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGetCustomerByUserId).toHaveBeenCalledWith("user-123");
      expect(mockCreateTestRequest).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Customer profile not found" });
    });

    it("should return 401 when user is not authenticated", async () => {
      // Arrange
      mockRequest = {
        user: undefined, // No user
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19",
              requestedQty: 1,
            },
          ],
        },
      } as any;

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockGetCustomerByUserId).not.toHaveBeenCalled();
      expect(mockCreateTestRequest).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Unauthorized" });
    });
  });

  describe("createTestRequest - validation", () => {
    it("should validate required fields before date conversion", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          // Missing requesterName
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19", // Valid date
              requestedQty: 1,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockCreateTestRequest).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Requester name and at least one sample are required",
      });
    });

    it("should validate samples array is not empty before date conversion", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [], // Empty array
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockCreateTestRequest).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        message: "Requester name and at least one sample are required",
      });
    });

    it("should validate samples field exists", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          // No samples field
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockCreateTestRequest).not.toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(400);
    });
  });

  describe("createTestRequest - error handling", () => {
    it("should handle Prisma validation errors for date fields", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19",
              requestedQty: 1,
            },
          ],
        },
      } as any;

      const prismaError = new Error("Invalid value for argument `sentSampleDate`: premature end of input. Expected ISO-8601 DateTime.");
      prismaError.name = "PrismaClientValidationError";

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockRejectedValue(prismaError);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating test request")
      );
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
    });

    it("should log errors when date conversion causes database errors", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19",
              requestedQty: 1,
            },
          ],
        },
      } as any;

      const dbError = new Error("Database connection failed");
      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockRejectedValue(dbError);

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        expect.stringContaining("Error creating test request: Error: Database connection failed")
      );
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
    });

    it("should handle service errors gracefully", async () => {
      // Arrange
      const mockCustomer = {
        id: "customer-123",
        userId: "user-123",
      };

      mockRequest = {
        user: { userId: "user-123", role: "CUSTOMER" },
        body: {
          requesterName: "John Doe",
          samples: [
            {
              customerSampleId: "SAMPLE-001",
              sentSampleDate: "2025-11-19",
              requestedQty: 1,
            },
          ],
        },
      } as any;

      mockGetCustomerByUserId.mockResolvedValue(mockCustomer as any);
      mockCreateTestRequest.mockRejectedValue(new Error("Service error"));

      // Act
      await controller.createTestRequest(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });
});
