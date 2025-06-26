import {
  PrismaClient,
  Invoice,
  InvoiceLineItem,
  InvoicePaymentStatus,
  TestRequest,
} from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateInvoiceData {
  testRequestId: string;
  customerId: string;
  dueDate?: Date;
  labTaxInfo?: any;
  subTotal: number;
  taxRate?: number;
  issuedById?: string;
  lineItems: CreateInvoiceLineItemData[];
}

export interface CreateInvoiceLineItemData {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface UpdateInvoiceData {
  dueDate?: Date;
  labTaxInfo?: any;
  subTotal?: number;
  taxRate?: number;
  paymentStatus?: InvoicePaymentStatus;
  paymentSlipAttachmentUrl?: string;
}

export interface InvoiceWithDetails extends Invoice {
  invoiceLineItems: InvoiceLineItem[];
  customer: {
    id: string;
    companyNameEn: string;
    companyNameTh: string;
    user: {
      email: string;
    };
  };
  testRequest: {
    id: string;
    requestNo: string;
    requesterName: string;
  };
  issuedBy?: {
    id: string;
    email: string;
  };
}

export class InvoiceService {
  async createInvoice(invoiceData: CreateInvoiceData): Promise<Invoice> {
    try {
      // Generate unique invoice number
      const invoiceNo = await this.generateInvoiceNumber();

      // Calculate tax amount and net total
      const taxRate = invoiceData.taxRate || 0.07; // Default 7% VAT
      const taxAmount = invoiceData.subTotal * taxRate;
      const netTotal = invoiceData.subTotal + taxAmount;

      const invoice = await prisma.invoice.create({
        data: {
          invoiceNo,
          testRequestId: invoiceData.testRequestId,
          customerId: invoiceData.customerId,
          dueDate: invoiceData.dueDate,
          labTaxInfo: invoiceData.labTaxInfo,
          subTotal: invoiceData.subTotal,
          taxRate,
          taxAmount,
          netTotal,
          paymentStatus: "PENDING",
          issuedById: invoiceData.issuedById,
          invoiceLineItems: {
            create: invoiceData.lineItems.map((item) => ({
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.quantity * item.unitPrice,
            })),
          },
        },
        include: {
          invoiceLineItems: true,
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
              requestNo: true,
              requesterName: true,
            },
          },
        },
      });

      logger.info(`Invoice created: ${invoice.invoiceNo}`);
      return invoice;
    } catch (error) {
      logger.error(`Error creating invoice: ${error}`);
      throw error;
    }
  }

  async getInvoiceById(id: string): Promise<InvoiceWithDetails | null> {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
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

      return invoice as InvoiceWithDetails | null;
    } catch (error) {
      logger.error(`Error getting invoice by ID: ${error}`);
      throw error;
    }
  }

  async getInvoiceByNumber(
    invoiceNo: string,
  ): Promise<InvoiceWithDetails | null> {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { invoiceNo },
        include: {
          invoiceLineItems: true,
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

      return invoice as InvoiceWithDetails | null;
    } catch (error) {
      logger.error(`Error getting invoice by number: ${error}`);
      throw error;
    }
  }

  async getInvoicesByCustomer(
    customerId: string,
    page: number = 1,
    limit: number = 10,
    status?: InvoicePaymentStatus,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = { customerId };

      if (status) {
        where.paymentStatus = status;
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          skip,
          take: limit,
          include: {
            invoiceLineItems: true,
            testRequest: {
              select: {
                requestNo: true,
                requesterName: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.invoice.count({ where }),
      ]);

      return {
        invoices,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting invoices by customer: ${error}`);
      throw error;
    }
  }

  async getAllInvoices(
    page: number = 1,
    limit: number = 10,
    status?: InvoicePaymentStatus,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (status) {
        where.paymentStatus = status;
      }

      const [invoices, total] = await Promise.all([
        prisma.invoice.findMany({
          where,
          skip,
          take: limit,
          include: {
            invoiceLineItems: true,
            customer: {
              select: {
                companyNameEn: true,
                companyNameTh: true,
                user: {
                  select: {
                    email: true,
                  },
                },
              },
            },
            testRequest: {
              select: {
                requestNo: true,
                requesterName: true,
              },
            },
            issuedBy: {
              select: {
                email: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.invoice.count({ where }),
      ]);

      return {
        invoices,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting all invoices: ${error}`);
      throw error;
    }
  }

  async updateInvoice(
    id: string,
    updateData: UpdateInvoiceData,
  ): Promise<Invoice> {
    try {
      // Recalculate totals if subTotal or taxRate changed
      const updates: any = { ...updateData };

      if (
        updateData.subTotal !== undefined ||
        updateData.taxRate !== undefined
      ) {
        const currentInvoice = await prisma.invoice.findUnique({
          where: { id },
        });

        if (!currentInvoice) {
          throw new Error("Invoice not found");
        }

        const subTotal = updateData.subTotal ?? currentInvoice.subTotal;
        const taxRate = updateData.taxRate ?? currentInvoice.taxRate;
        const taxAmount = Number(subTotal) * Number(taxRate);
        const netTotal = Number(subTotal) + taxAmount;

        updates.taxAmount = taxAmount;
        updates.netTotal = netTotal;
      }

      const invoice = await prisma.invoice.update({
        where: { id },
        data: updates,
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

      logger.info(`Invoice updated: ${invoice.invoiceNo}`);
      return invoice;
    } catch (error) {
      logger.error(`Error updating invoice: ${error}`);
      throw error;
    }
  }

  async markInvoiceAsPaid(
    id: string,
    paymentSlipUrl?: string,
  ): Promise<Invoice> {
    try {
      const invoice = await prisma.invoice.update({
        where: { id },
        data: {
          paymentStatus: "PAID",
          paymentSlipAttachmentUrl: paymentSlipUrl,
        },
        include: {
          customer: {
            select: {
              companyNameEn: true,
            },
          },
          testRequest: {
            select: {
              requestNo: true,
            },
          },
        },
      });

      logger.info(`Invoice marked as paid: ${invoice.invoiceNo}`);
      return invoice;
    } catch (error) {
      logger.error(`Error marking invoice as paid: ${error}`);
      throw error;
    }
  }

  async generateInvoiceFromTestRequest(
    testRequestId: string,
    issuedById?: string,
  ): Promise<Invoice> {
    try {
      // Get test request with samples and lab tests
      const testRequest = await prisma.testRequest.findUnique({
        where: { id: testRequestId },
        include: {
          customer: true,
          testRequestSamples: {
            include: {
              labTests: true,
            },
          },
        },
      });

      if (!testRequest) {
        throw new Error("Test request not found");
      }

      // Check if invoice already exists
      const existingInvoice = await prisma.invoice.findFirst({
        where: { testRequestId },
      });

      if (existingInvoice) {
        throw new Error("Invoice already exists for this test request");
      }

      // Generate line items based on samples and tests
      const lineItems: CreateInvoiceLineItemData[] = [];
      let subTotal = 0;

      // Add line item for each sample/test
      testRequest.testRequestSamples.forEach((sample) => {
        const unitPrice = this.calculateTestPrice(sample.panel, sample.method);
        const quantity = 1; // One test per sample
        const description = `${sample.panel || "Lab Test"} - Sample: ${sample.customerSampleId}`;

        lineItems.push({
          description,
          quantity,
          unitPrice,
        });

        subTotal += unitPrice * quantity;
      });

      // If no samples, add a default service charge
      if (lineItems.length === 0) {
        lineItems.push({
          description: "Laboratory Testing Service",
          quantity: 1,
          unitPrice: 1000, // Default price
        });
        subTotal = 1000;
      }

      // Create invoice
      const invoiceData: CreateInvoiceData = {
        testRequestId,
        customerId: testRequest.customerId,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        subTotal,
        issuedById,
        lineItems,
      };

      return await this.createInvoice(invoiceData);
    } catch (error) {
      logger.error(`Error generating invoice from test request: ${error}`);
      throw error;
    }
  }

  async getInvoiceStatistics() {
    try {
      const [
        totalInvoices,
        pendingInvoices,
        paidInvoices,
        overdueInvoices,
        cancelledInvoices,
        totalRevenue,
        pendingRevenue,
        monthlyRevenue,
      ] = await Promise.all([
        prisma.invoice.count(),
        prisma.invoice.count({ where: { paymentStatus: "PENDING" } }),
        prisma.invoice.count({ where: { paymentStatus: "PAID" } }),
        prisma.invoice.count({ where: { paymentStatus: "OVERDUE" } }),
        prisma.invoice.count({ where: { paymentStatus: "CANCELLED" } }),
        prisma.invoice.aggregate({
          where: { paymentStatus: "PAID" },
          _sum: { netTotal: true },
        }),
        prisma.invoice.aggregate({
          where: { paymentStatus: "PENDING" },
          _sum: { netTotal: true },
        }),
        prisma.invoice.aggregate({
          where: {
            paymentStatus: "PAID",
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          _sum: { netTotal: true },
        }),
      ]);

      return {
        totalInvoices,
        pendingInvoices,
        paidInvoices,
        overdueInvoices,
        cancelledInvoices,
        totalRevenue: Number(totalRevenue._sum.netTotal || 0),
        pendingRevenue: Number(pendingRevenue._sum.netTotal || 0),
        monthlyRevenue: Number(monthlyRevenue._sum.netTotal || 0),
        paymentRate:
          totalInvoices > 0 ? (paidInvoices / totalInvoices) * 100 : 0,
      };
    } catch (error) {
      logger.error(`Error getting invoice statistics: ${error}`);
      throw error;
    }
  }

  async searchInvoices(searchTerm: string) {
    try {
      const invoices = await prisma.invoice.findMany({
        where: {
          OR: [
            { invoiceNo: { contains: searchTerm, mode: "insensitive" } },
            {
              customer: {
                companyNameEn: { contains: searchTerm, mode: "insensitive" },
              },
            },
            {
              customer: {
                companyNameTh: { contains: searchTerm, mode: "insensitive" },
              },
            },
            {
              testRequest: {
                requestNo: { contains: searchTerm, mode: "insensitive" },
              },
            },
            {
              testRequest: {
                requesterName: { contains: searchTerm, mode: "insensitive" },
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

      return invoices;
    } catch (error) {
      logger.error(`Error searching invoices: ${error}`);
      throw error;
    }
  }

  private async generateInvoiceNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");

    // Get the count of invoices created this month
    const startOfMonth = new Date(year, now.getMonth(), 1);
    const endOfMonth = new Date(year, now.getMonth() + 1, 0);

    const invoiceCount = await prisma.invoice.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    const sequence = String(invoiceCount + 1).padStart(4, "0");
    return `INV-${year}${month}-${sequence}`;
  }

  private calculateTestPrice(
    panel?: string | null,
    method?: string | null,
  ): number {
    // This would typically come from a pricing configuration
    // For now, return base prices based on test type
    const basePrices: { [key: string]: number } = {
      "Blood Test": 500,
      "Urine Test": 300,
      "DNA Test": 2000,
      Pathology: 1500,
      Microbiology: 800,
      Chemistry: 600,
    };

    // Try to match panel name to base price
    for (const [testType, price] of Object.entries(basePrices)) {
      if (panel?.toLowerCase().includes(testType.toLowerCase())) {
        return price;
      }
    }

    // Default price if no match found
    return 1000;
  }
}
