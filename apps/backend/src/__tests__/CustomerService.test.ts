// Mock all dependencies first, before any imports
const mockPrismaCustomer = {
  findUnique: jest.fn(),
  findFirst: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
  aggregate: jest.fn(),
};

const mockPrismaUser = {
  findUnique: jest.fn(),
};

const mockPrismaTestRequest = {
  findMany: jest.fn(),
  count: jest.fn(),
};

const mockPrismaInvoice = {
  count: jest.fn(),
  aggregate: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    customer: mockPrismaCustomer,
    user: mockPrismaUser,
    testRequest: mockPrismaTestRequest,
    invoice: mockPrismaInvoice,
  })),
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

// Now import after all mocks are set up
import { CustomerService } from "../services/CustomerService";
import type {
  CreateCustomerData,
  UpdateCustomerData,
} from "../services/CustomerService";
import logger from "../utils/logger";

describe("CustomerService", () => {
  let customerService: CustomerService;

  const mockUser = {
    id: "user-123",
    email: "test@example.com",
    role: "CUSTOMER",
    isEmailConfirmed: true,
    verificationToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    customer: null,
  };

  const mockCustomer = {
    id: "customer-123",
    userId: "user-123",
    companyNameEn: "Test Company",
    companyNameTh: "บริษัททดสอบ",
    legalEntityId: "1234567890123",
    companyDescription: "Test company description",
    companyAddressLine1: "123 Test Street",
    companyProvince: "Bangkok",
    companyDistrict: "Watthana",
    companySubDistrict: "Lumpini",
    companyZipCode: "10330",
    companyPhone: "02-123-4567",
    companyFax: "02-123-4568",
    operatorIdCard: "1234567890123",
    operatorPrefix: "Mr.",
    operatorFirstName: "John",
    operatorLastName: "Doe",
    operatorMobilePhone: "081-234-5678",
    operatorPhone: "02-234-5678",
    receiptAddressBuildingFloorNumber: "456 Receipt Building",
    receiptProvince: "Bangkok",
    receiptDistrict: "Watthana",
    receiptSubDistrict: "Lumpini",
    receiptZipCode: "10330",
    receiptPhone: "02-345-6789",
    receiptFax: "02-345-6790",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCustomerWithUser = {
    ...mockCustomer,
    user: {
      id: "user-123",
      email: "test@example.com",
      role: "CUSTOMER",
      isEmailConfirmed: true,
      verificationToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    testRequests: [],
    invoices: [],
  };

  const createCustomerData: CreateCustomerData = {
    userId: "user-123",
    companyNameEn: "Test Company",
    companyNameTh: "บริษัททดสอบ",
    legalEntityId: "1234567890123",
    companyDescription: "Test company description",
    companyAddressLine1: "123 Test Street",
    companyProvince: "Bangkok",
    companyDistrict: "Watthana",
    companySubDistrict: "Lumpini",
    companyZipCode: "10330",
    companyPhone: "02-123-4567",
    companyFax: "02-123-4568",
    operatorIdCard: "1234567890123",
    operatorPrefix: "Mr.",
    operatorFirstName: "John",
    operatorLastName: "Doe",
    operatorMobilePhone: "081-234-5678",
    operatorPhone: "02-234-5678",
    receiptAddressBuildingFloorNumber: "456 Receipt Building",
    receiptProvince: "Bangkok",
    receiptDistrict: "Watthana",
    receiptSubDistrict: "Lumpini",
    receiptZipCode: "10330",
    receiptPhone: "02-345-6789",
    receiptFax: "02-345-6790",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    customerService = new CustomerService();
  });

  describe("createCustomer", () => {
    it("should create a customer successfully", async () => {
      // Setup mocks
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockPrismaCustomer.findUnique
        .mockResolvedValueOnce(null) // legal entity check
        .mockResolvedValueOnce(null); // operator ID card check
      mockPrismaCustomer.create.mockResolvedValue(mockCustomer);

      // Execute
      const result = await customerService.createCustomer(createCustomerData);

      // Verify
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { id: createCustomerData.userId },
        include: { customer: true },
      });
      expect(mockPrismaCustomer.findUnique).toHaveBeenCalledWith({
        where: { legalEntityId: createCustomerData.legalEntityId },
      });
      expect(mockPrismaCustomer.findUnique).toHaveBeenCalledWith({
        where: { operatorIdCard: createCustomerData.operatorIdCard },
      });
      expect(mockPrismaCustomer.create).toHaveBeenCalledWith({
        data: createCustomerData,
      });
      expect(result).toEqual(mockCustomer);
      expect(logger.info).toHaveBeenCalledWith(
        "Customer profile created for user: user-123",
      );
    });

    it("should throw error if user not found", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(
        customerService.createCustomer(createCustomerData),
      ).rejects.toThrow("User not found");

      expect(mockPrismaCustomer.findUnique).not.toHaveBeenCalled();
      expect(mockPrismaCustomer.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should throw error if customer profile already exists", async () => {
      const userWithCustomer = { ...mockUser, customer: mockCustomer };
      mockPrismaUser.findUnique.mockResolvedValue(userWithCustomer);

      await expect(
        customerService.createCustomer(createCustomerData),
      ).rejects.toThrow("Customer profile already exists for this user");

      expect(mockPrismaCustomer.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should throw error if legal entity ID already exists", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockPrismaCustomer.findUnique.mockResolvedValueOnce(mockCustomer);

      await expect(
        customerService.createCustomer(createCustomerData),
      ).rejects.toThrow("Legal Entity ID already exists");

      expect(mockPrismaCustomer.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should throw error if operator ID card already exists", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockUser);
      mockPrismaCustomer.findUnique
        .mockResolvedValueOnce(null) // legal entity check
        .mockResolvedValueOnce(mockCustomer); // operator ID card check

      await expect(
        customerService.createCustomer(createCustomerData),
      ).rejects.toThrow("Operator ID Card already exists");

      expect(mockPrismaCustomer.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getCustomerById", () => {
    it("should return customer with user data when found", async () => {
      mockPrismaCustomer.findUnique.mockResolvedValue(mockCustomerWithUser);

      const result = await customerService.getCustomerById("customer-123");

      expect(mockPrismaCustomer.findUnique).toHaveBeenCalledWith({
        where: { id: "customer-123" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isEmailConfirmed: true,
              verificationToken: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          testRequests: {
            include: {
              testRequestSamples: true,
              project: true,
            },
          },
          invoices: {
            include: {
              invoiceLineItems: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCustomerWithUser);
    });

    it("should return null when customer not found", async () => {
      mockPrismaCustomer.findUnique.mockResolvedValue(null);

      const result = await customerService.getCustomerById("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaCustomer.findUnique.mockRejectedValue(dbError);

      await expect(
        customerService.getCustomerById("customer-123"),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getCustomerByUserId", () => {
    it("should return customer by user ID", async () => {
      mockPrismaCustomer.findUnique.mockResolvedValue(mockCustomerWithUser);

      const result = await customerService.getCustomerByUserId("user-123");

      expect(mockPrismaCustomer.findUnique).toHaveBeenCalledWith({
        where: { userId: "user-123" },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isEmailConfirmed: true,
              verificationToken: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          testRequests: {
            include: {
              testRequestSamples: true,
              project: true,
            },
          },
          invoices: {
            include: {
              invoiceLineItems: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCustomerWithUser);
    });

    it("should return null when customer not found by user ID", async () => {
      mockPrismaCustomer.findUnique.mockResolvedValue(null);

      const result = await customerService.getCustomerByUserId("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("updateCustomer", () => {
    const updateData: UpdateCustomerData = {
      companyNameEn: "Updated Company",
      companyPhone: "02-999-8888",
    };

    it("should update customer successfully", async () => {
      const updatedCustomer = { ...mockCustomer, ...updateData };
      mockPrismaCustomer.update.mockResolvedValue(updatedCustomer);

      const result = await customerService.updateCustomer(
        "customer-123",
        updateData,
      );

      expect(mockPrismaCustomer.update).toHaveBeenCalledWith({
        where: { id: "customer-123" },
        data: updateData,
      });
      expect(result).toEqual(updatedCustomer);
      expect(logger.info).toHaveBeenCalledWith(
        "Customer updated: customer-123",
      );
    });

    it("should validate legal entity ID uniqueness when updating", async () => {
      const updateDataWithLegalEntity: UpdateCustomerData = {
        legalEntityId: "9999999999999",
      };

      mockPrismaCustomer.findFirst.mockResolvedValue(null);
      mockPrismaCustomer.update.mockResolvedValue(mockCustomer);

      await customerService.updateCustomer(
        "customer-123",
        updateDataWithLegalEntity,
      );

      expect(mockPrismaCustomer.findFirst).toHaveBeenCalledWith({
        where: {
          legalEntityId: "9999999999999",
          id: { not: "customer-123" },
        },
      });
    });

    it("should throw error if legal entity ID already exists when updating", async () => {
      const updateDataWithLegalEntity: UpdateCustomerData = {
        legalEntityId: "9999999999999",
      };

      mockPrismaCustomer.findFirst.mockResolvedValue(mockCustomer);

      await expect(
        customerService.updateCustomer(
          "customer-123",
          updateDataWithLegalEntity,
        ),
      ).rejects.toThrow("Legal Entity ID already exists");

      expect(mockPrismaCustomer.update).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should validate operator ID card uniqueness when updating", async () => {
      const updateDataWithOperatorId: UpdateCustomerData = {
        operatorIdCard: "9999999999999",
      };

      mockPrismaCustomer.findFirst.mockResolvedValue(null);
      mockPrismaCustomer.update.mockResolvedValue(mockCustomer);

      await customerService.updateCustomer(
        "customer-123",
        updateDataWithOperatorId,
      );

      expect(mockPrismaCustomer.findFirst).toHaveBeenCalledWith({
        where: {
          operatorIdCard: "9999999999999",
          id: { not: "customer-123" },
        },
      });
    });

    it("should throw error if operator ID card already exists when updating", async () => {
      const updateDataWithOperatorId: UpdateCustomerData = {
        operatorIdCard: "9999999999999",
      };

      mockPrismaCustomer.findFirst.mockResolvedValue(mockCustomer);

      await expect(
        customerService.updateCustomer(
          "customer-123",
          updateDataWithOperatorId,
        ),
      ).rejects.toThrow("Operator ID Card already exists");

      expect(mockPrismaCustomer.update).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getAllCustomers", () => {
    it("should return paginated customers", async () => {
      const mockCustomers = [mockCustomerWithUser];
      const totalCount = 1;

      mockPrismaCustomer.findMany.mockResolvedValue(mockCustomers);
      mockPrismaCustomer.count.mockResolvedValue(totalCount);

      const result = await customerService.getAllCustomers(1, 10);

      expect(mockPrismaCustomer.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isEmailConfirmed: true,
              verificationToken: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      expect(mockPrismaCustomer.count).toHaveBeenCalled();
      expect(result).toEqual({
        customers: mockCustomers,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should handle pagination correctly", async () => {
      const mockCustomers = [mockCustomerWithUser];
      const totalCount = 25;

      mockPrismaCustomer.findMany.mockResolvedValue(mockCustomers);
      mockPrismaCustomer.count.mockResolvedValue(totalCount);

      const result = await customerService.getAllCustomers(3, 10);

      expect(mockPrismaCustomer.findMany).toHaveBeenCalledWith({
        skip: 20, // (3 - 1) * 10
        take: 10,
        include: expect.any(Object),
        orderBy: { createdAt: "desc" },
      });
      expect(result).toEqual({
        customers: mockCustomers,
        total: totalCount,
        totalPages: 3, // Math.ceil(25 / 10)
        currentPage: 3,
      });
    });
  });

  describe("searchCustomers", () => {
    it("should search customers by various criteria", async () => {
      const mockCustomers = [mockCustomerWithUser];
      mockPrismaCustomer.findMany.mockResolvedValue(mockCustomers);

      const result = await customerService.searchCustomers("Test");

      expect(mockPrismaCustomer.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { companyNameEn: { contains: "Test", mode: "insensitive" } },
            { companyNameTh: { contains: "Test", mode: "insensitive" } },
            { legalEntityId: { contains: "Test", mode: "insensitive" } },
            { operatorFirstName: { contains: "Test", mode: "insensitive" } },
            { operatorLastName: { contains: "Test", mode: "insensitive" } },
            { user: { email: { contains: "Test", mode: "insensitive" } } },
          ],
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isEmailConfirmed: true,
              verificationToken: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      });
      expect(result).toEqual(mockCustomers);
    });

    it("should handle search errors", async () => {
      const searchError = new Error("Search failed");
      mockPrismaCustomer.findMany.mockRejectedValue(searchError);

      await expect(customerService.searchCustomers("Test")).rejects.toThrow(
        "Search failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteCustomer", () => {
    it("should delete customer successfully when no active test requests", async () => {
      mockPrismaTestRequest.findMany.mockResolvedValue([]);
      mockPrismaCustomer.delete.mockResolvedValue(mockCustomer);

      const result = await customerService.deleteCustomer("customer-123");

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: {
          customerId: "customer-123",
          labInternalStatus: {
            notIn: ["COMPLETED"],
          },
        },
      });
      expect(mockPrismaCustomer.delete).toHaveBeenCalledWith({
        where: { id: "customer-123" },
      });
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith(
        "Customer deleted: customer-123",
      );
    });

    it("should throw error when customer has active test requests", async () => {
      const activeTestRequests = [{ id: "test-request-1" }];
      mockPrismaTestRequest.findMany.mockResolvedValue(activeTestRequests);

      await expect(
        customerService.deleteCustomer("customer-123"),
      ).rejects.toThrow("Cannot delete customer with active test requests");

      expect(mockPrismaCustomer.delete).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle delete errors", async () => {
      mockPrismaTestRequest.findMany.mockResolvedValue([]);
      const deleteError = new Error("Delete failed");
      mockPrismaCustomer.delete.mockRejectedValue(deleteError);

      await expect(
        customerService.deleteCustomer("customer-123"),
      ).rejects.toThrow("Delete failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getCustomerStatistics", () => {
    it("should return customer statistics", async () => {
      const mockStats = [
        5, // totalTestRequests
        3, // completedTestRequests
        2, // pendingTestRequests
        4, // totalInvoices
        2, // paidInvoices
        2, // pendingInvoices
        { _sum: { netTotal: 1500.5 } }, // invoiceStats
      ];

      // Mock Promise.all results
      jest.spyOn(Promise, "all").mockResolvedValue(mockStats);

      const result =
        await customerService.getCustomerStatistics("customer-123");

      expect(result).toEqual({
        totalTestRequests: 5,
        completedTestRequests: 3,
        pendingTestRequests: 2,
        totalInvoices: 4,
        paidInvoices: 2,
        pendingInvoices: 2,
        totalAmountSpent: 1500.5,
      });
    });

    it("should handle null invoice sum", async () => {
      const mockStats = [
        0, // totalTestRequests
        0, // completedTestRequests
        0, // pendingTestRequests
        0, // totalInvoices
        0, // paidInvoices
        0, // pendingInvoices
        { _sum: { netTotal: null } }, // invoiceStats
      ];

      jest.spyOn(Promise, "all").mockResolvedValue(mockStats);

      const result =
        await customerService.getCustomerStatistics("customer-123");

      expect(result.totalAmountSpent).toBe(0);
    });

    it("should handle statistics errors", async () => {
      const statsError = new Error("Statistics query failed");
      jest.spyOn(Promise, "all").mockRejectedValue(statsError);

      await expect(
        customerService.getCustomerStatistics("customer-123"),
      ).rejects.toThrow("Statistics query failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
