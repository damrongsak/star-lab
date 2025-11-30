import { Request, Response } from "express";
import { InvoiceController } from "../controllers/InvoiceController";
import { InvoiceService } from "../services/InvoiceService";
import { prisma } from "../utils/db";

// Define UserRole locally
const UserRole = {
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
};

// Mock dependencies
jest.mock("../services/InvoiceService");
jest.mock("../utils/db", () => ({
  prisma: {
    customer: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("../utils/logger");

describe("InvoiceController Data Ownership", () => {
  let invoiceController: InvoiceController;
  let mockInvoiceService: jest.Mocked<InvoiceService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    mockInvoiceService = new InvoiceService() as jest.Mocked<InvoiceService>;
    invoiceController = new InvoiceController();
    // Inject the mocked service (casting to any to access private property if needed,
    // or assuming DI pattern. Here we'll just spy/mock the prototype if no DI)
    (invoiceController as any).invoiceService = mockInvoiceService;

    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    } as unknown as Response;
  });

  describe("getInvoices", () => {
    it("should call getAllInvoices for ADMIN role", async () => {
      mockRequest = {
        user: {
          userId: "admin-id",
          email: "admin@test.com",
          role: UserRole.ADMIN,
        },
        query: { page: "1", limit: "10" },
      } as any;

      mockInvoiceService.getAllInvoices.mockResolvedValue({
        invoices: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      await invoiceController.getInvoices(
        mockRequest as any,
        mockResponse as any,
      );

      expect(mockInvoiceService.getAllInvoices).toHaveBeenCalled();
      expect(mockInvoiceService.getInvoicesByCustomer).not.toHaveBeenCalled();
    });

    it("should call getInvoicesByCustomer for CUSTOMER role with correct customer ID", async () => {
      mockRequest = {
        user: {
          userId: "user-id",
          email: "customer@test.com",
          role: UserRole.CUSTOMER,
        },
        query: { page: "1", limit: "10" },
      } as any;

      // Mock finding the customer profile from the user ID
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue({
        id: "customer-id",
      });

      mockInvoiceService.getInvoicesByCustomer.mockResolvedValue({
        invoices: [],
        total: 0,
        totalPages: 0,
        currentPage: 1,
      });

      await invoiceController.getInvoices(
        mockRequest as any,
        mockResponse as any,
      );

      expect(prisma.customer.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-id" },
      });
      expect(mockInvoiceService.getInvoicesByCustomer).toHaveBeenCalledWith(
        "customer-id",
        1,
        10,
        undefined,
        undefined,
      );
      expect(mockInvoiceService.getAllInvoices).not.toHaveBeenCalled();
    });

    it("should return 404 if customer profile not found for CUSTOMER role", async () => {
      mockRequest = {
        user: {
          userId: "user-id",
          email: "customer@test.com",
          role: UserRole.CUSTOMER,
        },
        query: {},
      } as any;

      (prisma.customer.findUnique as jest.Mock).mockResolvedValue(null);

      await invoiceController.getInvoices(
        mockRequest as any,
        mockResponse as any,
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Customer profile not found" }),
      );
    });
  });

  describe("getInvoice (by ID)", () => {
    it("should allow ADMIN to view any invoice", async () => {
      mockRequest = {
        params: { invoiceId: "inv-1" },
        user: { userId: "admin-id", role: UserRole.ADMIN },
      } as any;

      mockInvoiceService.getInvoiceById.mockResolvedValue({
        id: "inv-1",
        customerId: "cust-1",
      } as any);

      await invoiceController.getInvoice(
        mockRequest as any,
        mockResponse as any,
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should allow CUSTOMER to view their own invoice", async () => {
      mockRequest = {
        params: { invoiceId: "inv-1" },
        user: { userId: "user-id", role: UserRole.CUSTOMER },
      } as any;

      mockInvoiceService.getInvoiceById.mockResolvedValue({
        id: "inv-1",
        customerId: "cust-1",
      } as any);
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue({
        id: "cust-1",
      });

      await invoiceController.getInvoice(
        mockRequest as any,
        mockResponse as any,
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should deny CUSTOMER access to another customer's invoice", async () => {
      mockRequest = {
        params: { invoiceId: "inv-1" },
        user: { userId: "user-id", role: UserRole.CUSTOMER },
      } as any;

      mockInvoiceService.getInvoiceById.mockResolvedValue({
        id: "inv-1",
        customerId: "cust-2",
      } as any);
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue({
        id: "cust-1",
      }); // Different customer ID

      await invoiceController.getInvoice(
        mockRequest as any,
        mockResponse as any,
      );

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Access denied" }),
      );
    });
  });

  describe("getInvoiceByNumber", () => {
    it("should allow ADMIN to view any invoice", async () => {
      mockRequest = {
        params: { invoiceNo: "INV-001" },
        user: { userId: "admin-id", role: UserRole.ADMIN },
      } as any;

      mockInvoiceService.getInvoiceByNumber.mockResolvedValue({
        invoiceNo: "INV-001",
        customerId: "cust-1",
      } as any);

      await invoiceController.getInvoiceByNumber(
        mockRequest as any,
        mockResponse as any,
      );

      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ success: true }),
      );
    });

    it("should deny CUSTOMER access to another customer's invoice", async () => {
      mockRequest = {
        params: { invoiceNo: "INV-001" },
        user: { userId: "user-id", role: UserRole.CUSTOMER },
      } as any;

      mockInvoiceService.getInvoiceByNumber.mockResolvedValue({
        invoiceNo: "INV-001",
        customerId: "cust-2",
      } as any);
      (prisma.customer.findUnique as jest.Mock).mockResolvedValue({
        id: "cust-1",
      });

      await invoiceController.getInvoiceByNumber(
        mockRequest as any,
        mockResponse as any,
      );

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Access denied" }),
      );
    });
  });
});
