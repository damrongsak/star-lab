import { InvoiceService } from "../services/InvoiceService";

// Mock logger
jest.mock("../utils/logger", () => ({
  error: jest.fn(),
}));

// Mock PrismaClient
const mockFindMany = jest.fn();
const mockCount = jest.fn();

jest.mock("@prisma/client", () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      invoice: {
        findMany: (...args: any[]) => mockFindMany(...args),
        count: (...args: any[]) => mockCount(...args),
      },
    })),
  };
});

describe("InvoiceService Search Functionality", () => {
  let invoiceService: InvoiceService;

  beforeEach(() => {
    jest.clearAllMocks();
    invoiceService = new InvoiceService();
  });

  describe("getAllInvoices with search", () => {
    it("should apply search filter when search term is provided", async () => {
      const mockInvoices = [{ id: "inv-1", invoiceNo: "INV-001" }];
      const totalCount = 1;

      mockFindMany.mockResolvedValue(mockInvoices);
      mockCount.mockResolvedValue(totalCount);

      const searchTerm = "INV-001";
      await invoiceService.getAllInvoices(1, 10, undefined, searchTerm);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { invoiceNo: { contains: searchTerm, mode: "insensitive" } },
              {
                customer: {
                  companyNameEn: { contains: searchTerm, mode: "insensitive" },
                },
              },
            ]),
          }),
        }),
      );
    });

    it("should apply status filter when payment status is provided", async () => {
      const mockInvoices = [
        { id: "inv-1", invoiceNo: "INV-001", paymentStatus: "PAID" },
      ];
      const totalCount = 1;

      mockFindMany.mockResolvedValue(mockInvoices);
      mockCount.mockResolvedValue(totalCount);

      await invoiceService.getAllInvoices(1, 10, "PAID", undefined);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            paymentStatus: "PAID",
          }),
        }),
      );
    });

    it("should apply both search and status filters when both are provided", async () => {
      const mockInvoices = [
        { id: "inv-1", invoiceNo: "INV-001", paymentStatus: "PAID" },
      ];
      const totalCount = 1;

      mockFindMany.mockResolvedValue(mockInvoices);
      mockCount.mockResolvedValue(totalCount);

      const searchTerm = "INV-001";
      await invoiceService.getAllInvoices(1, 10, "PAID", searchTerm);

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            paymentStatus: "PAID",
            OR: expect.arrayContaining([
              { invoiceNo: { contains: searchTerm, mode: "insensitive" } },
            ]),
          }),
        }),
      );
    });
  });

  describe("getInvoicesByCustomer with search", () => {
    it("should apply search filter when search term is provided", async () => {
      const mockInvoices = [{ id: "inv-1", invoiceNo: "INV-001" }];
      const totalCount = 1;
      const customerId = "cust-123";

      mockFindMany.mockResolvedValue(mockInvoices);
      mockCount.mockResolvedValue(totalCount);

      const searchTerm = "INV-001";
      await invoiceService.getInvoicesByCustomer(
        customerId,
        1,
        10,
        undefined,
        searchTerm,
      );

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            customerId: customerId,
            OR: expect.arrayContaining([
              { invoiceNo: { contains: searchTerm, mode: "insensitive" } },
              {
                testRequest: {
                  requestNo: { contains: searchTerm, mode: "insensitive" },
                },
              },
            ]),
          }),
        }),
      );
    });

    it("should apply status filter when payment status is provided", async () => {
      const mockInvoices = [
        { id: "inv-1", invoiceNo: "INV-001", paymentStatus: "CANCELLED" },
      ];
      const totalCount = 1;
      const customerId = "cust-123";

      mockFindMany.mockResolvedValue(mockInvoices);
      mockCount.mockResolvedValue(totalCount);

      await invoiceService.getInvoicesByCustomer(
        customerId,
        1,
        10,
        "CANCELLED",
        undefined,
      );

      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            customerId: customerId,
            paymentStatus: "CANCELLED",
          }),
        }),
      );
    });
  });
});
