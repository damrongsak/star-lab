import { PrismaClient, Customer } from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateCustomerData {
  userId: string;
  companyNameEn: string;
  companyNameTh: string;
  legalEntityId: string;
  companyDescription?: string;
  companyAddressLine1: string;
  companyProvince: string;
  companyDistrict: string;
  companySubDistrict: string;
  companyZipCode: string;
  companyPhone: string;
  companyFax?: string;
  companyRegistrationAttachmentsIds?: any;
  operatorIdCard: string;
  operatorPrefix: string;
  operatorFirstName: string;
  operatorLastName: string;
  operatorMobilePhone: string;
  operatorPhone?: string;
  operatorIdCardAttachmentsIds?: any;
  receiptAddressBuildingFloorNumber: string;
  receiptProvince: string;
  receiptDistrict: string;
  receiptSubDistrict: string;
  receiptZipCode: string;
  receiptPhone: string;
  receiptFax?: string;
}

export interface UpdateCustomerData {
  companyNameEn?: string;
  companyNameTh?: string;
  legalEntityId?: string;
  companyDescription?: string;
  companyAddressLine1?: string;
  companyProvince?: string;
  companyDistrict?: string;
  companySubDistrict?: string;
  companyZipCode?: string;
  companyPhone?: string;
  companyFax?: string;
  companyRegistrationAttachmentsIds?: any;
  operatorIdCard?: string;
  operatorPrefix?: string;
  operatorFirstName?: string;
  operatorLastName?: string;
  operatorMobilePhone?: string;
  operatorPhone?: string;
  operatorIdCardAttachmentsIds?: any;
  receiptAddressBuildingFloorNumber?: string;
  receiptProvince?: string;
  receiptDistrict?: string;
  receiptSubDistrict?: string;
  receiptZipCode?: string;
  receiptPhone?: string;
  receiptFax?: string;
}

export type CustomerWithUser = Customer & {
  user: {
    id: string;
    email: string;
    role: string;
    isEmailConfirmed: boolean | null;
    verificationToken?: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
  };
};

export class CustomerService {
  async createCustomer(customerData: CreateCustomerData): Promise<Customer> {
    try {
      // Check if user exists and doesn't already have a customer profile
      const existingUser = await prisma.user.findUnique({
        where: { id: customerData.userId },
        include: { customer: true },
      });

      if (!existingUser) {
        throw new Error("User not found");
      }

      if (existingUser.customer) {
        throw new Error("Customer profile already exists for this user");
      }

      // Check if legal entity ID is unique
      const existingLegalEntity = await prisma.customer.findUnique({
        where: { legalEntityId: customerData.legalEntityId },
      });

      if (existingLegalEntity) {
        throw new Error("Legal Entity ID already exists");
      }

      // Check if operator ID card is unique
      const existingOperatorId = await prisma.customer.findUnique({
        where: { operatorIdCard: customerData.operatorIdCard },
      });

      if (existingOperatorId) {
        throw new Error("Operator ID Card already exists");
      }

      const customer = await prisma.customer.create({
        data: customerData,
      });

      logger.info(`Customer profile created for user: ${customerData.userId}`);
      return customer;
    } catch (error) {
      logger.error(`Error creating customer: ${error}`);
      throw error;
    }
  }

  async getCustomerById(id: string): Promise<CustomerWithUser | null> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { id },
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

      return customer as CustomerWithUser | null;
    } catch (error) {
      logger.error(`Error getting customer by ID: ${error}`);
      throw error;
    }
  }

  async getCustomerByUserId(userId: string): Promise<CustomerWithUser | null> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { userId },
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

      return customer as CustomerWithUser | null;
    } catch (error) {
      logger.error(`Error getting customer by user ID: ${error}`);
      throw error;
    }
  }

  async updateCustomer(
    id: string,
    updateData: UpdateCustomerData,
  ): Promise<Customer> {
    try {
      // If updating legal entity ID or operator ID card, check uniqueness
      if (updateData.legalEntityId) {
        const existingLegalEntity = await prisma.customer.findFirst({
          where: {
            legalEntityId: updateData.legalEntityId,
            id: { not: id },
          },
        });

        if (existingLegalEntity) {
          throw new Error("Legal Entity ID already exists");
        }
      }

      if (updateData.operatorIdCard) {
        const existingOperatorId = await prisma.customer.findFirst({
          where: {
            operatorIdCard: updateData.operatorIdCard,
            id: { not: id },
          },
        });

        if (existingOperatorId) {
          throw new Error("Operator ID Card already exists");
        }
      }

      const customer = await prisma.customer.update({
        where: { id },
        data: updateData,
      });

      logger.info(`Customer updated: ${id}`);
      return customer;
    } catch (error) {
      logger.error(`Error updating customer: ${error}`);
      throw error;
    }
  }

  async getAllCustomers(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    customers: CustomerWithUser[];
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [customers, total] = await Promise.all([
        prisma.customer.findMany({
          skip,
          take: limit,
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
        }),
        prisma.customer.count(),
      ]);

      return {
        customers: customers as CustomerWithUser[],
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting all customers: ${error}`);
      throw error;
    }
  }

  async searchCustomers(searchTerm: string): Promise<CustomerWithUser[]> {
    try {
      const customers = await prisma.customer.findMany({
        where: {
          OR: [
            { companyNameEn: { contains: searchTerm, mode: "insensitive" } },
            { companyNameTh: { contains: searchTerm, mode: "insensitive" } },
            { legalEntityId: { contains: searchTerm, mode: "insensitive" } },
            {
              operatorFirstName: { contains: searchTerm, mode: "insensitive" },
            },
            { operatorLastName: { contains: searchTerm, mode: "insensitive" } },
            { user: { email: { contains: searchTerm, mode: "insensitive" } } },
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

      return customers as CustomerWithUser[];
    } catch (error) {
      logger.error(`Error searching customers: ${error}`);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<boolean> {
    try {
      // Check if customer has active test requests
      const activeTestRequests = await prisma.testRequest.findMany({
        where: {
          customerId: id,
          labInternalStatus: {
            notIn: ["COMPLETED"],
          },
        },
      });

      if (activeTestRequests.length > 0) {
        throw new Error("Cannot delete customer with active test requests");
      }

      await prisma.customer.delete({
        where: { id },
      });

      logger.info(`Customer deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting customer: ${error}`);
      throw error;
    }
  }

  async getCustomerStatistics(customerId: string): Promise<{
    totalTestRequests: number;
    completedTestRequests: number;
    pendingTestRequests: number;
    totalInvoices: number;
    paidInvoices: number;
    pendingInvoices: number;
    totalAmountSpent: number;
  }> {
    try {
      const [
        totalTestRequests,
        completedTestRequests,
        pendingTestRequests,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        invoiceStats,
      ] = await Promise.all([
        prisma.testRequest.count({ where: { customerId } }),
        prisma.testRequest.count({
          where: { customerId, labInternalStatus: "COMPLETED" },
        }),
        prisma.testRequest.count({
          where: {
            customerId,
            labInternalStatus: { notIn: ["COMPLETED"] },
          },
        }),
        prisma.invoice.count({ where: { customerId } }),
        prisma.invoice.count({
          where: { customerId, paymentStatus: "PAID" },
        }),
        prisma.invoice.count({
          where: { customerId, paymentStatus: "PENDING" },
        }),
        prisma.invoice.aggregate({
          where: { customerId, paymentStatus: "PAID" },
          _sum: { netTotal: true },
        }),
      ]);

      return {
        totalTestRequests,
        completedTestRequests,
        pendingTestRequests,
        totalInvoices,
        paidInvoices,
        pendingInvoices,
        totalAmountSpent: Number(invoiceStats._sum.netTotal || 0),
      };
    } catch (error) {
      logger.error(`Error getting customer statistics: ${error}`);
      throw error;
    }
  }
}
