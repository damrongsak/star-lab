import {
  PrismaClient,
  TestRequest,
  TestRequestDocumentStatus,
  LabInternalStatus,
  TestRequestSample,
  TestRequestSampleStatus,
} from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateTestRequestData {
  customerId: string;
  requesterName: string;
  objective?: string;
  projectId?: string;
  notes?: string;
  samples: CreateTestRequestSampleData[];
}

export interface CreateTestRequestSampleData {
  customerSampleId: string;
  sentSampleDate?: Date;
  animalType?: string;
  sampleSpecimen?: string;
  panel?: string;
  method?: string;
  requestedQty: number;
  unit?: string;
  notes?: string;
}

export interface UpdateTestRequestData {
  requesterName?: string;
  objective?: string;
  projectId?: string;
  notes?: string;
  documentStatus?: TestRequestDocumentStatus;
  labInternalStatus?: LabInternalStatus;
}

export interface UpdateTestRequestSampleData {
  receivedQty?: number;
  currentStatus?: TestRequestSampleStatus;
  storageLocationId?: string;
  notes?: string;
}

export class TestRequestService {
  async createTestRequest(data: CreateTestRequestData): Promise<TestRequest> {
    try {
      // Generate unique request number
      const requestNo = this.generateRequestNumber();

      const testRequest = await prisma.testRequest.create({
        data: {
          requestNo,
          customerId: data.customerId,
          requesterName: data.requesterName,
          objective: data.objective,
          projectId: data.projectId,
          notes: data.notes,
          testRequestSamples: {
            create: data.samples.map((sample) => ({
              customerSampleId: sample.customerSampleId,
              sentSampleDate: sample.sentSampleDate,
              animalType: sample.animalType,
              sampleSpecimen: sample.sampleSpecimen,
              panel: sample.panel,
              method: sample.method,
              requestedQty: sample.requestedQty,
              unit: sample.unit,
              notes: sample.notes,
            })),
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

      logger.info(`Test request created: ${testRequest.requestNo}`);
      return testRequest;
    } catch (error) {
      logger.error(`Error creating test request: ${error}`);
      throw error;
    }
  }

  async getTestRequestById(id: string) {
    try {
      const testRequest = await prisma.testRequest.findUnique({
        where: { id },
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

      return testRequest;
    } catch (error) {
      logger.error(`Error getting test request by ID: ${error}`);
      throw error;
    }
  }

  async getTestRequestsByCustomer(
    customerId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    try {
      const skip = (page - 1) * limit;

      const [testRequests, total] = await Promise.all([
        prisma.testRequest.findMany({
          where: { customerId },
          skip,
          take: limit,
          include: {
            testRequestSamples: true,
            project: true,
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.testRequest.count({ where: { customerId } }),
      ]);

      return {
        testRequests,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting test requests by customer: ${error}`);
      throw error;
    }
  }

  async updateTestRequest(
    id: string,
    updateData: UpdateTestRequestData,
  ): Promise<TestRequest> {
    try {
      const testRequest = await prisma.testRequest.update({
        where: { id },
        data: updateData,
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

      logger.info(`Test request updated: ${testRequest.requestNo}`);
      return testRequest;
    } catch (error) {
      logger.error(`Error updating test request: ${error}`);
      throw error;
    }
  }

  async updateTestRequestSample(
    sampleId: string,
    updateData: UpdateTestRequestSampleData,
  ) {
    try {
      const sample = await prisma.testRequestSample.update({
        where: { id: sampleId },
        data: updateData,
        include: {
          testRequest: {
            select: {
              requestNo: true,
            },
          },
          storageLocation: true,
        },
      });

      logger.info(`Test request sample updated: ${sampleId}`);
      return sample;
    } catch (error) {
      logger.error(`Error updating test request sample: ${error}`);
      throw error;
    }
  }

  async getAllTestRequests(
    page: number = 1,
    limit: number = 10,
    status?: LabInternalStatus,
    documentStatus?: TestRequestDocumentStatus,
  ) {
    try {
      const skip = (page - 1) * limit;

      const where: any = {};
      if (status) where.labInternalStatus = status;
      if (documentStatus) where.documentStatus = documentStatus;

      const [testRequests, total] = await Promise.all([
        prisma.testRequest.findMany({
          where,
          skip,
          take: limit,
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
          orderBy: { createdAt: "desc" },
        }),
        prisma.testRequest.count({ where }),
      ]);

      return {
        testRequests,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting all test requests: ${error}`);
      throw error;
    }
  }

  async getTestRequestStatistics() {
    try {
      const [
        totalRequests,
        pendingApproval,
        inProgress,
        completed,
        samplesReceived,
        samplesInTesting,
      ] = await Promise.all([
        prisma.testRequest.count(),
        prisma.testRequest.count({
          where: { labInternalStatus: "WAITING_APPROVAL_LAB" },
        }),
        prisma.testRequest.count({
          where: {
            labInternalStatus: {
              in: ["RECEIVED_SAMPLES", "ASSIGNED_TECHNICIAN", "IN_PROGRESS"],
            },
          },
        }),
        prisma.testRequest.count({
          where: { labInternalStatus: "COMPLETED" },
        }),
        prisma.testRequestSample.count({
          where: { currentStatus: "RECEIVED" },
        }),
        prisma.testRequestSample.count({
          where: { currentStatus: "IN_TESTING" },
        }),
      ]);

      return {
        totalRequests,
        pendingApproval,
        inProgress,
        completed,
        samplesReceived,
        samplesInTesting,
      };
    } catch (error) {
      logger.error(`Error getting test request statistics: ${error}`);
      throw error;
    }
  }

  async assignTechnicianToSample(sampleId: string, technicianId: string) {
    try {
      // First, create or update the lab test for this sample
      const sample = await prisma.testRequestSample.findUnique({
        where: { id: sampleId },
        include: { testRequest: true },
      });

      if (!sample) {
        throw new Error("Sample not found");
      }

      // Create lab test if it doesn't exist
      let labTest = await prisma.labTest.findFirst({
        where: { testRequestSampleId: sampleId },
      });

      if (!labTest) {
        const caseNo = this.generateCaseNumber();
        labTest = await prisma.labTest.create({
          data: {
            testRequestSampleId: sampleId,
            caseNo,
            caseDate: new Date(),
            assignedLabTechnicianId: technicianId,
            testPanel: sample.panel,
            testMethod: sample.method,
          },
        });
      } else {
        labTest = await prisma.labTest.update({
          where: { id: labTest.id },
          data: {
            assignedLabTechnicianId: technicianId,
          },
        });
      }

      // Update test request status if needed
      await this.updateTestRequestStatus(
        sample.testRequestId,
        "ASSIGNED_TECHNICIAN",
      );

      logger.info(`Technician ${technicianId} assigned to sample ${sampleId}`);
      return labTest;
    } catch (error) {
      logger.error(`Error assigning technician to sample: ${error}`);
      throw error;
    }
  }

  private async updateTestRequestStatus(
    testRequestId: string,
    status: LabInternalStatus,
  ) {
    try {
      await prisma.testRequest.update({
        where: { id: testRequestId },
        data: { labInternalStatus: status },
      });
    } catch (error) {
      logger.error(`Error updating test request status: ${error}`);
      throw error;
    }
  }

  private generateRequestNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = now.getTime().toString().slice(-6);

    return `REQ-${year}${month}${day}-${timestamp}`;
  }

  private generateCaseNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = now.getTime().toString().slice(-6);

    return `CASE-${year}${month}${day}-${timestamp}`;
  }

  async searchTestRequests(searchTerm: string) {
    try {
      const testRequests = await prisma.testRequest.findMany({
        where: {
          OR: [
            { requestNo: { contains: searchTerm, mode: "insensitive" } },
            { requesterName: { contains: searchTerm, mode: "insensitive" } },
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
              testRequestSamples: {
                some: {
                  customerSampleId: {
                    contains: searchTerm,
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

      return testRequests;
    } catch (error) {
      logger.error(`Error searching test requests: ${error}`);
      throw error;
    }
  }
}
