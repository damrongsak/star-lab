// Mock all dependencies first, before any imports
const mockPrismaInvoice = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  findFirst: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
};

const mockPrismaTestRequest = {
  findUnique: jest.fn(),
};

const mockPrismaCustomer = {
  findUnique: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    invoice: mockPrismaInvoice,
    testRequest: mockPrismaTestRequest,
    customer: mockPrismaCustomer,
  })),
  InvoicePaymentStatus: {
    PENDING: "PENDING",
    PAID: "PAID",
    OVERDUE: "OVERDUE",
    CANCELLED: "CANCELLED",
  },
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Now import after all mocks are set up
import { InvoiceService } from "../services/InvoiceService";
import type {
  CreateInvoiceData,
  UpdateInvoiceData,
  CreateInvoiceLineItemData,
} from "../services/InvoiceService";
import logger from "../utils/logger";

describe("InvoiceService", () => {
  let invoiceService: InvoiceService;

  const mockInvoice = {
    id: "invoice-123",
    invoiceNo: "INV-2024-001",
    testRequestId: "test-request-123",
    customerId: "customer-123",
    dueDate: new Date("2024-12-31"),
    labTaxInfo: { vatRate: 0.07 },
    subTotal: 1000,
    taxRate: 0.07,
    taxAmount: 70,
    netTotal: 1070,
    paymentStatus: "PENDING",
    issuedById: "admin-123",
    paymentSlipAttachmentUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockInvoiceWithDetails = {
    ...mockInvoice,
    invoiceLineItems: [
      {
        id: "line-item-1",
        invoiceId: "invoice-123",
        description: "Test service",
        quantity: 1,
        unitPrice: 1000,
        lineTotal: 1000,
      },
    ],
    customer: {
      id: "customer-123",
      companyNameEn: "Test Company",
      companyNameTh: "บริษัททดสอบ",
      user: {
        email: "customer@example.com",
      },
    },
    testRequest: {
      id: "test-request-123",
      requestNo: "REQ-2024-001",
      requesterName: "John Doe",
    },
    issuedBy: {
      id: "admin-123",
      email: "admin@example.com",
    },
  };

  const lineItems: CreateInvoiceLineItemData[] = [
    {
      description: "Test service",
      quantity: 1,
      unitPrice: 1000,
    },
  ];

  const createInvoiceData: CreateInvoiceData = {
    testRequestId: "test-request-123",
    customerId: "customer-123",
    dueDate: new Date("2024-12-31"),
    labTaxInfo: { vatRate: 0.07 },
    subTotal: 1000,
    taxRate: 0.07,
    issuedById: "admin-123",
    lineItems,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    invoiceService = new InvoiceService();

    // Mock the generateInvoiceNumber method
    jest
      .spyOn(invoiceService as any, "generateInvoiceNumber")
      .mockResolvedValue("INV-2024-001");
  });

  describe("createInvoice", () => {
    it("should create an invoice successfully", async () => {
      // Setup mocks
      mockPrismaInvoice.create.mockResolvedValue(mockInvoiceWithDetails);

      // Execute
      const result = await invoiceService.createInvoice(createInvoiceData);

      // Verify
      expect(mockPrismaInvoice.create).toHaveBeenCalledWith({
        data: {
          invoiceNo: "INV-2024-001",
          testRequestId: createInvoiceData.testRequestId,
          customerId: createInvoiceData.customerId,
          dueDate: createInvoiceData.dueDate,
          labTaxInfo: createInvoiceData.labTaxInfo,
          subTotal: createInvoiceData.subTotal,
          taxRate: 0.07,
          taxAmount: 70, // 1000 * 0.07
          netTotal: 1070, // 1000 + 70
          paymentStatus: "PENDING",
          issuedById: createInvoiceData.issuedById,
          invoiceLineItems: {
            create: [
              {
                description: "Test service",
                quantity: 1,
                unitPrice: 1000,
                lineTotal: 1000,
              },
            ],
          },
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(mockInvoiceWithDetails);
    });

    it("should use default tax rate when not provided", async () => {
      const dataWithoutTaxRate = { ...createInvoiceData };
      delete dataWithoutTaxRate.taxRate;

      mockPrismaInvoice.create.mockResolvedValue(mockInvoiceWithDetails);

      await invoiceService.createInvoice(dataWithoutTaxRate);

      expect(mockPrismaInvoice.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          taxRate: 0.07, // default 7% VAT
          taxAmount: 70,
          netTotal: 1070,
        }),
        include: expect.any(Object),
      });
    });

    it("should calculate tax amounts correctly", async () => {
      const customTaxData = {
        ...createInvoiceData,
        taxRate: 0.1, // 10% tax
        subTotal: 2000,
      };

      mockPrismaInvoice.create.mockResolvedValue(mockInvoiceWithDetails);

      await invoiceService.createInvoice(customTaxData);

      expect(mockPrismaInvoice.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          taxRate: 0.1,
          taxAmount: 200, // 2000 * 0.1
          netTotal: 2200, // 2000 + 200
        }),
        include: expect.any(Object),
      });
    });

    it("should handle invoice creation errors", async () => {
      const createError = new Error("Database error");
      mockPrismaInvoice.create.mockRejectedValue(createError);

      await expect(
        invoiceService.createInvoice(createInvoiceData),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getInvoiceById", () => {
    it("should return invoice with details when found", async () => {
      mockPrismaInvoice.findUnique.mockResolvedValue(mockInvoiceWithDetails);

      const result = await invoiceService.getInvoiceById("invoice-123");

      expect(mockPrismaInvoice.findUnique).toHaveBeenCalledWith({
        where: { id: "invoice-123" },
        include: {
          invoiceLineItems: {
            orderBy: {
              createdAt: "asc",
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
          testRequest: {
            select: {
              id: true,
              requestNo: true,
              requesterName: true,
            },
          },
          issuedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(mockInvoiceWithDetails);
    });

    it("should return null when invoice not found", async () => {
      mockPrismaInvoice.findUnique.mockResolvedValue(null);

      const result = await invoiceService.getInvoiceById("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaInvoice.findUnique.mockRejectedValue(dbError);

      await expect(
        invoiceService.getInvoiceById("invoice-123"),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateInvoice", () => {
    const updateData: UpdateInvoiceData = {
      paymentStatus: "PAID",
      paymentSlipAttachmentUrl: "https://example.com/slip.pdf",
    };

    it("should update invoice successfully", async () => {
      const updatedInvoice = { ...mockInvoice, ...updateData };
      mockPrismaInvoice.update.mockResolvedValue(updatedInvoice);

      const result = await invoiceService.updateInvoice(
        "invoice-123",
        updateData,
      );

      expect(mockPrismaInvoice.update).toHaveBeenCalledWith({
        where: { id: "invoice-123" },
        data: updateData,
        include: {
          invoiceLineItems: true,
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          testRequest: {
            select: {
              requestNo: true,
            },
          },
        },
      });
      expect(result).toEqual(updatedInvoice);
      expect(logger.info).toHaveBeenCalledWith("Invoice updated: INV-2024-001");
    });

    it("should recalculate totals when subTotal or taxRate is updated", async () => {
      const recalcUpdateData: UpdateInvoiceData = {
        subTotal: 2000,
        taxRate: 0.1,
      };

      const expectedUpdateData = {
        ...recalcUpdateData,
        taxAmount: 200, // 2000 * 0.1
        netTotal: 2200, // 2000 + 200
      };

      // Mock the findUnique call for getting current invoice
      mockPrismaInvoice.findUnique.mockResolvedValue(mockInvoice);
      mockPrismaInvoice.update.mockResolvedValue(mockInvoice);

      await invoiceService.updateInvoice("invoice-123", recalcUpdateData);

      expect(mockPrismaInvoice.findUnique).toHaveBeenCalledWith({
        where: { id: "invoice-123" },
      });
      expect(mockPrismaInvoice.update).toHaveBeenCalledWith({
        where: { id: "invoice-123" },
        data: expectedUpdateData,
        include: {
          invoiceLineItems: true,
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          testRequest: {
            select: {
              requestNo: true,
            },
          },
        },
      });
    });

    it("should handle update errors", async () => {
      const updateError = new Error("Update failed");
      mockPrismaInvoice.update.mockRejectedValue(updateError);

      await expect(
        invoiceService.updateInvoice("invoice-123", updateData),
      ).rejects.toThrow("Update failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getAllInvoices", () => {
    it("should return paginated invoices", async () => {
      const mockInvoices = [mockInvoiceWithDetails];
      const totalCount = 1;

      mockPrismaInvoice.findMany.mockResolvedValue(mockInvoices);
      mockPrismaInvoice.count.mockResolvedValue(totalCount);

      const result = await invoiceService.getAllInvoices(1, 10);

      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrismaInvoice.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({
        invoices: mockInvoices,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should filter by payment status when provided", async () => {
      const mockInvoices: any[] = [];
      mockPrismaInvoice.findMany.mockResolvedValue(mockInvoices);
      mockPrismaInvoice.count.mockResolvedValue(0);

      await invoiceService.getAllInvoices(1, 10, "PAID");

      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: { paymentStatus: "PAID" },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle pagination correctly", async () => {
      const mockInvoices = [mockInvoiceWithDetails];
      const totalCount = 25;

      mockPrismaInvoice.findMany.mockResolvedValue(mockInvoices);
      mockPrismaInvoice.count.mockResolvedValue(totalCount);

      const result = await invoiceService.getAllInvoices(3, 10);

      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 20, // (3 - 1) * 10
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual({
        invoices: mockInvoices,
        total: totalCount,
        totalPages: 3, // Math.ceil(25 / 10)
        currentPage: 3,
      });
    });
  });

  describe("getInvoicesByCustomer", () => {
    it("should return paginated invoices for a specific customer", async () => {
      const mockInvoices = [mockInvoiceWithDetails];
      const totalCount = 1;

      mockPrismaInvoice.findMany.mockResolvedValue(mockInvoices);
      mockPrismaInvoice.count.mockResolvedValue(totalCount);

      const result = await invoiceService.getInvoicesByCustomer("customer-123");

      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: { customerId: "customer-123" },
        skip: 0,
        take: 10,
        include: {
          invoiceLineItems: true,
          testRequest: {
            select: {
              requestNo: true,
              requesterName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrismaInvoice.count).toHaveBeenCalledWith({
        where: { customerId: "customer-123" },
      });
      expect(result).toEqual({
        invoices: mockInvoices,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should filter by payment status when provided", async () => {
      const mockInvoices: any[] = [];
      mockPrismaInvoice.findMany.mockResolvedValue(mockInvoices);
      mockPrismaInvoice.count.mockResolvedValue(0);

      await invoiceService.getInvoicesByCustomer("customer-123", 1, 10, "PAID");

      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: { customerId: "customer-123", paymentStatus: "PAID" },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaInvoice.findMany.mockRejectedValue(dbError);

      await expect(
        invoiceService.getInvoicesByCustomer("customer-123"),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("searchInvoices", () => {
    it("should search invoices by various criteria", async () => {
      const mockInvoices = [mockInvoiceWithDetails];
      mockPrismaInvoice.findMany.mockResolvedValue(mockInvoices);

      const result = await invoiceService.searchInvoices("Test");

      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { invoiceNo: { contains: "Test", mode: "insensitive" } },
            {
              customer: {
                companyNameEn: { contains: "Test", mode: "insensitive" },
              },
            },
            {
              customer: {
                companyNameTh: { contains: "Test", mode: "insensitive" },
              },
            },
            {
              testRequest: {
                requestNo: { contains: "Test", mode: "insensitive" },
              },
            },
            {
              testRequest: {
                requesterName: { contains: "Test", mode: "insensitive" },
              },
            },
          ],
        },
        include: {
          invoiceLineItems: true,
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
            },
          },
          testRequest: {
            select: {
              requestNo: true,
              requesterName: true,
            },
          },
        },
      });
      expect(result).toEqual(mockInvoices);
    });

    it("should handle search errors", async () => {
      const searchError = new Error("Search failed");
      mockPrismaInvoice.findMany.mockRejectedValue(searchError);

      await expect(invoiceService.searchInvoices("Test")).rejects.toThrow(
        "Search failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getInvoiceStatistics", () => {
    it("should return invoice statistics", async () => {
      const mockStats = [
        10, // totalInvoices
        3, // pendingInvoices
        5, // paidInvoices
        2, // overdueInvoices
        0, // cancelledInvoices
        { _sum: { netTotal: 50000 } }, // totalRevenue
        { _sum: { netTotal: 15000 } }, // pendingRevenue
        { _sum: { netTotal: 25000 } }, // monthlyRevenue
      ];

      // Mock Promise.all results
      jest.spyOn(Promise, "all").mockResolvedValue(mockStats);

      const result = await invoiceService.getInvoiceStatistics();

      expect(result).toEqual({
        totalInvoices: 10,
        pendingInvoices: 3,
        paidInvoices: 5,
        overdueInvoices: 2,
        cancelledInvoices: 0,
        totalRevenue: 50000,
        pendingRevenue: 15000,
        monthlyRevenue: 25000,
        paymentRate: 50, // (5 / 10) * 100
      });
    });

    it("should handle null revenue sums", async () => {
      const mockStats = [
        0, // totalInvoices
        0, // pendingInvoices
        0, // paidInvoices
        0, // overdueInvoices
        0, // cancelledInvoices
        { _sum: { netTotal: null } }, // totalRevenue
        { _sum: { netTotal: null } }, // pendingRevenue
        { _sum: { netTotal: null } }, // monthlyRevenue
      ];

      jest.spyOn(Promise, "all").mockResolvedValue(mockStats);

      const result = await invoiceService.getInvoiceStatistics();

      expect(result).toEqual({
        totalInvoices: 0,
        pendingInvoices: 0,
        paidInvoices: 0,
        overdueInvoices: 0,
        cancelledInvoices: 0,
        totalRevenue: 0,
        pendingRevenue: 0,
        monthlyRevenue: 0,
        paymentRate: 0,
      });
    });

    it("should handle statistics errors", async () => {
      const statsError = new Error("Statistics query failed");
      jest.spyOn(Promise, "all").mockRejectedValue(statsError);

      await expect(invoiceService.getInvoiceStatistics()).rejects.toThrow(
        "Statistics query failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("generateInvoiceFromTestRequest", () => {
    const mockTestRequest = {
      id: "test-request-123",
      customerId: "customer-123",
      testRequestSamples: [
        {
          id: "sample-1",
          customerSampleId: "SAMPLE-001",
          panel: "Blood Test",
          method: "PCR",
          labTests: [],
        },
      ],
      customer: mockInvoiceWithDetails.customer,
    };

    it("should generate invoice from test request successfully", async () => {
      mockPrismaTestRequest.findUnique.mockResolvedValue(mockTestRequest);
      mockPrismaInvoice.findFirst.mockResolvedValue(null); // No existing invoice
      mockPrismaInvoice.create.mockResolvedValue(mockInvoiceWithDetails);

      const result = await invoiceService.generateInvoiceFromTestRequest(
        "test-request-123",
        "admin-123",
      );

      expect(mockPrismaTestRequest.findUnique).toHaveBeenCalledWith({
        where: { id: "test-request-123" },
        include: {
          customer: true,
          testRequestSamples: {
            include: {
              labTests: true,
            },
          },
        },
      });
      expect(mockPrismaInvoice.findFirst).toHaveBeenCalledWith({
        where: { testRequestId: "test-request-123" },
      });
      expect(result).toEqual(mockInvoiceWithDetails);
    });

    it("should throw error if test request not found", async () => {
      mockPrismaTestRequest.findUnique.mockResolvedValue(null);

      await expect(
        invoiceService.generateInvoiceFromTestRequest("nonexistent"),
      ).rejects.toThrow("Test request not found");

      expect(mockPrismaInvoice.create).not.toHaveBeenCalled();
    });

    it("should throw error if invoice already exists", async () => {
      mockPrismaTestRequest.findUnique.mockResolvedValue(mockTestRequest);
      mockPrismaInvoice.findFirst.mockResolvedValue(mockInvoice);

      await expect(
        invoiceService.generateInvoiceFromTestRequest("test-request-123"),
      ).rejects.toThrow("Invoice already exists for this test request");

      expect(mockPrismaInvoice.create).not.toHaveBeenCalled();
    });

    it("should handle test request with no samples", async () => {
      const testRequestNoSamples = {
        ...mockTestRequest,
        testRequestSamples: [],
      };
      mockPrismaTestRequest.findUnique.mockResolvedValue(testRequestNoSamples);
      mockPrismaInvoice.findFirst.mockResolvedValue(null);
      mockPrismaInvoice.create.mockResolvedValue(mockInvoiceWithDetails);

      const result =
        await invoiceService.generateInvoiceFromTestRequest("test-request-123");

      // Should create default service line item
      expect(mockPrismaInvoice.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            subTotal: 1000, // Default price
            invoiceLineItems: {
              create: [
                {
                  description: "Laboratory Testing Service",
                  quantity: 1,
                  unitPrice: 1000,
                  lineTotal: 1000,
                },
              ],
            },
          }),
        }),
      );
      expect(result).toEqual(mockInvoiceWithDetails);
    });
  });
});
