// Mock dependencies
const mockPrismaTestRequest = {
  update: jest.fn(),
};

const mockPrisma = {
  testRequest: mockPrismaTestRequest,
  $transaction: jest.fn(),
};

const mockInvoiceService = {
  generateInvoiceFromTestRequest: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  ...jest.requireActual("@prisma/client"),
  PrismaClient: jest.fn().mockImplementation(() => mockPrisma),
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock("../services/AuditService", () => ({
  AuditService: jest.fn().mockImplementation(() => ({
    logAction: jest.fn(),
  })),
}));

jest.mock("../services/InvoiceService", () => ({
  InvoiceService: jest.fn().mockImplementation(() => mockInvoiceService),
}));

import { TestRequestService } from "../services/TestRequestService";
import { InvoiceService } from "../services/InvoiceService";
import { LabInternalStatus } from "@prisma/client";

describe("Invoice Workflow Integration", () => {
  let testRequestService: TestRequestService;

  beforeEach(() => {
    jest.clearAllMocks();
    testRequestService = new TestRequestService();
  });

  it("should automatically generate invoice when test request is completed", async () => {
    const testRequestId = "test-req-123";
    const userId = "user-123";

    // Setup mock for update
    mockPrismaTestRequest.update.mockResolvedValue({
      id: testRequestId,
      labInternalStatus: "COMPLETED",
    });

    // Call the private method via any cast to access it for testing
    await (testRequestService as any).updateTestRequestStatus(
      testRequestId,
      "COMPLETED" as LabInternalStatus,
      userId,
    );

    // Verify status update
    expect(mockPrismaTestRequest.update).toHaveBeenCalledWith({
      where: { id: testRequestId },
      data: { labInternalStatus: "COMPLETED" },
    });

    // Verify invoice generation was triggered
    expect(InvoiceService).toHaveBeenCalled();
    expect(
      mockInvoiceService.generateInvoiceFromTestRequest,
    ).toHaveBeenCalledWith(testRequestId, userId);
  });

  it("should NOT generate invoice when status is not COMPLETED", async () => {
    const testRequestId = "test-req-123";
    const userId = "user-123";

    mockPrismaTestRequest.update.mockResolvedValue({
      id: testRequestId,
      labInternalStatus: "IN_PROGRESS",
    });

    await (testRequestService as any).updateTestRequestStatus(
      testRequestId,
      "IN_PROGRESS" as LabInternalStatus,
      userId,
    );

    expect(
      mockInvoiceService.generateInvoiceFromTestRequest,
    ).not.toHaveBeenCalled();
  });

  it("should handle invoice generation errors gracefully", async () => {
    const testRequestId = "test-req-123";
    const userId = "user-123";

    mockPrismaTestRequest.update.mockResolvedValue({
      id: testRequestId,
      labInternalStatus: "COMPLETED",
    });

    const error = new Error("Invoice generation failed");
    mockInvoiceService.generateInvoiceFromTestRequest.mockRejectedValue(error);

    // Should not throw
    await expect(
      (testRequestService as any).updateTestRequestStatus(
        testRequestId,
        "COMPLETED" as LabInternalStatus,
        userId,
      ),
    ).resolves.not.toThrow();

    expect(
      mockInvoiceService.generateInvoiceFromTestRequest,
    ).toHaveBeenCalled();
  });
});
