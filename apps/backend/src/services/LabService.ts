import {
  PrismaClient,
  LabTest,
  LabResult,
  LabResultStatus,
  TestRequestSampleStatus,
  User,
} from "@prisma/client";
import logger from "../utils/logger";

const prisma = new PrismaClient();

export interface CreateLabTestData {
  testRequestSampleId: string;
  assignedLabTechnicianId: string;
  testPanel?: string;
  testMethod?: string;
  notes?: string;
}

export interface UpdateLabTestData {
  assignedLabTechnicianId?: string;
  testPanel?: string;
  testMethod?: string;
  labResultStatus?: LabResultStatus;
  notes?: string;
}

export interface CreateLabResultData {
  labTestId: string;
  parameter: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  notes?: string;
  recordedById: string;
}

export interface UpdateLabResultData {
  parameter?: string;
  value?: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  notes?: string;
}

export interface LabTestWithDetails extends LabTest {
  testRequestSample: {
    id: string;
    customerSampleId: string;
    testRequest: {
      id: string;
      requestNo: string;
      customer: {
        companyNameEn: string;
        companyNameTh: string;
      };
    };
  };
  assignedLabTechnician?: {
    id: string;
    email: string;
  };
  labResults: LabResult[];
}

export class LabService {
  async createLabTest(testData: CreateLabTestData): Promise<LabTest> {
    try {
      // Generate case number
      const caseNo = this.generateCaseNumber();

      const labTest = await prisma.labTest.create({
        data: {
          testRequestSampleId: testData.testRequestSampleId,
          caseNo,
          caseDate: new Date(),
          assignedLabTechnicianId: testData.assignedLabTechnicianId,
          testPanel: testData.testPanel,
          testMethod: testData.testMethod,
          notes: testData.notes,
          labResultStatus: "PENDING",
        },
        include: {
          testRequestSample: {
            include: {
              testRequest: {
                select: {
                  requestNo: true,
                },
              },
            },
          },
          assignedLabTechnician: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Update sample status to IN_TESTING
      await this.updateSampleStatus(testData.testRequestSampleId, "IN_TESTING");

      logger.info(`Lab test created: ${labTest.caseNo}`);
      return labTest;
    } catch (error) {
      logger.error(`Error creating lab test: ${error}`);
      throw error;
    }
  }

  async getLabTestById(id: string): Promise<LabTestWithDetails | null> {
    try {
      const labTest = await prisma.labTest.findUnique({
        where: { id },
        include: {
          testRequestSample: {
            include: {
              testRequest: {
                include: {
                  customer: {
                    select: {
                      companyNameEn: true,
                      companyNameTh: true,
                    },
                  },
                },
              },
            },
          },
          assignedLabTechnician: {
            select: {
              id: true,
              email: true,
            },
          },
          labResults: {
            include: {
              recordedBy: {
                select: {
                  id: true,
                  email: true,
                },
              },
            },
            orderBy: {
              recordedAt: "desc",
            },
          },
        },
      });

      return labTest as LabTestWithDetails | null;
    } catch (error) {
      logger.error(`Error getting lab test by ID: ${error}`);
      throw error;
    }
  }

  async getLabTestsByTechnician(
    technicianId: string,
    page: number = 1,
    limit: number = 10,
    status?: LabResultStatus,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = { assignedLabTechnicianId: technicianId };

      if (status) {
        where.labResultStatus = status;
      }

      const [labTests, total] = await Promise.all([
        prisma.labTest.findMany({
          where,
          skip,
          take: limit,
          include: {
            testRequestSample: {
              include: {
                testRequest: {
                  include: {
                    customer: {
                      select: {
                        companyNameEn: true,
                        companyNameTh: true,
                      },
                    },
                  },
                },
              },
            },
            labResults: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.labTest.count({ where }),
      ]);

      return {
        labTests,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting lab tests by technician: ${error}`);
      throw error;
    }
  }

  async getAllLabTests(
    page: number = 1,
    limit: number = 10,
    status?: LabResultStatus,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = {};

      if (status) {
        where.labResultStatus = status;
      }

      const [labTests, total] = await Promise.all([
        prisma.labTest.findMany({
          where,
          skip,
          take: limit,
          include: {
            testRequestSample: {
              include: {
                testRequest: {
                  include: {
                    customer: {
                      select: {
                        companyNameEn: true,
                        companyNameTh: true,
                      },
                    },
                  },
                },
              },
            },
            assignedLabTechnician: {
              select: {
                id: true,
                email: true,
              },
            },
            labResults: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.labTest.count({ where }),
      ]);

      return {
        labTests,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting all lab tests: ${error}`);
      throw error;
    }
  }

  async updateLabTest(
    id: string,
    updateData: UpdateLabTestData,
  ): Promise<LabTest> {
    try {
      const labTest = await prisma.labTest.update({
        where: { id },
        data: updateData,
        include: {
          testRequestSample: {
            include: {
              testRequest: {
                select: {
                  requestNo: true,
                },
              },
            },
          },
          assignedLabTechnician: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Lab test updated: ${labTest.caseNo}`);
      return labTest;
    } catch (error) {
      logger.error(`Error updating lab test: ${error}`);
      throw error;
    }
  }

  async createLabResult(resultData: CreateLabResultData): Promise<LabResult> {
    try {
      const labResult = await prisma.labResult.create({
        data: {
          labTestId: resultData.labTestId,
          parameter: resultData.parameter,
          value: resultData.value,
          unit: resultData.unit,
          referenceRange: resultData.referenceRange,
          isAbnormal: resultData.isAbnormal || false,
          notes: resultData.notes,
          recordedById: resultData.recordedById,
        },
        include: {
          labTest: {
            select: {
              caseNo: true,
            },
          },
          recordedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      // Update lab test status if this is the first result
      const existingResults = await prisma.labResult.count({
        where: { labTestId: resultData.labTestId },
      });

      if (existingResults === 1) {
        await this.updateLabTest(resultData.labTestId, {
          labResultStatus: "PARTIAL",
        });
      }

      logger.info(`Lab result created for test: ${labResult.labTest.caseNo}`);
      return labResult;
    } catch (error) {
      logger.error(`Error creating lab result: ${error}`);
      throw error;
    }
  }

  async updateLabResult(
    id: string,
    updateData: UpdateLabResultData,
  ): Promise<LabResult> {
    try {
      const labResult = await prisma.labResult.update({
        where: { id },
        data: updateData,
        include: {
          labTest: {
            select: {
              caseNo: true,
            },
          },
          recordedBy: {
            select: {
              id: true,
              email: true,
            },
          },
        },
      });

      logger.info(`Lab result updated for test: ${labResult.labTest.caseNo}`);
      return labResult;
    } catch (error) {
      logger.error(`Error updating lab result: ${error}`);
      throw error;
    }
  }

  async deleteLabResult(id: string): Promise<boolean> {
    try {
      await prisma.labResult.delete({
        where: { id },
      });

      logger.info(`Lab result deleted: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting lab result: ${error}`);
      throw error;
    }
  }

  async completeLabTest(
    labTestId: string,
    completedById: string,
  ): Promise<LabTest> {
    try {
      // Check if all required results are present
      const labTest = await prisma.labTest.findUnique({
        where: { id: labTestId },
        include: {
          labResults: true,
        },
      });

      if (!labTest) {
        throw new Error("Lab test not found");
      }

      if (labTest.labResults.length === 0) {
        throw new Error("Cannot complete lab test without any results");
      }

      const updatedLabTest = await prisma.labTest.update({
        where: { id: labTestId },
        data: {
          labResultStatus: "COMPLETED",
        },
        include: {
          testRequestSample: {
            include: {
              testRequest: true,
            },
          },
        },
      });

      // Update sample status
      await this.updateSampleStatus(labTest.testRequestSampleId, "CONSUMED");

      // Check if all samples in the test request are completed
      await this.checkAndUpdateTestRequestStatus(
        updatedLabTest.testRequestSample.testRequestId,
      );

      logger.info(`Lab test completed: ${updatedLabTest.caseNo}`);
      return updatedLabTest;
    } catch (error) {
      logger.error(`Error completing lab test: ${error}`);
      throw error;
    }
  }

  async getLabStatistics() {
    try {
      const [
        totalTests,
        pendingTests,
        inProgressTests,
        completedTests,
        reviewedTests,
        approvedTests,
        totalResults,
        abnormalResults,
      ] = await Promise.all([
        prisma.labTest.count(),
        prisma.labTest.count({ where: { labResultStatus: "PENDING" } }),
        prisma.labTest.count({ where: { labResultStatus: "PARTIAL" } }),
        prisma.labTest.count({ where: { labResultStatus: "COMPLETED" } }),
        prisma.labTest.count({ where: { labResultStatus: "REVIEWED" } }),
        prisma.labTest.count({ where: { labResultStatus: "APPROVED" } }),
        prisma.labResult.count(),
        prisma.labResult.count({ where: { isAbnormal: true } }),
      ]);

      return {
        totalTests,
        pendingTests,
        inProgressTests,
        completedTests,
        reviewedTests,
        approvedTests,
        totalResults,
        abnormalResults,
        abnormalRate:
          totalResults > 0 ? (abnormalResults / totalResults) * 100 : 0,
      };
    } catch (error) {
      logger.error(`Error getting lab statistics: ${error}`);
      throw error;
    }
  }

  async searchLabTests(searchTerm: string) {
    try {
      const labTests = await prisma.labTest.findMany({
        where: {
          OR: [
            { caseNo: { contains: searchTerm, mode: "insensitive" } },
            { testPanel: { contains: searchTerm, mode: "insensitive" } },
            { testMethod: { contains: searchTerm, mode: "insensitive" } },
            {
              testRequestSample: {
                customerSampleId: { contains: searchTerm, mode: "insensitive" },
              },
            },
            {
              testRequestSample: {
                testRequest: {
                  requestNo: { contains: searchTerm, mode: "insensitive" },
                },
              },
            },
          ],
        },
        include: {
          testRequestSample: {
            include: {
              testRequest: {
                include: {
                  customer: {
                    select: {
                      companyNameEn: true,
                      companyNameTh: true,
                    },
                  },
                },
              },
            },
          },
          assignedLabTechnician: {
            select: {
              id: true,
              email: true,
            },
          },
          labResults: true,
        },
      });

      return labTests;
    } catch (error) {
      logger.error(`Error searching lab tests: ${error}`);
      throw error;
    }
  }

  async getAvailableTechnicians(): Promise<User[]> {
    try {
      const technicians = await prisma.user.findMany({
        where: {
          role: "TECHNICIAN",
        },
        select: {
          id: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return technicians as User[];
    } catch (error) {
      logger.error(`Error getting available technicians: ${error}`);
      throw error;
    }
  }

  private async updateSampleStatus(
    sampleId: string,
    status: TestRequestSampleStatus,
  ): Promise<void> {
    try {
      await prisma.testRequestSample.update({
        where: { id: sampleId },
        data: { currentStatus: status },
      });
    } catch (error) {
      logger.error(`Error updating sample status: ${error}`);
      throw error;
    }
  }

  private async checkAndUpdateTestRequestStatus(
    testRequestId: string,
  ): Promise<void> {
    try {
      const testRequest = await prisma.testRequest.findUnique({
        where: { id: testRequestId },
        include: {
          testRequestSamples: {
            include: {
              labTests: true,
            },
          },
        },
      });

      if (!testRequest) return;

      // Check if all samples have completed lab tests
      const allCompleted = testRequest.testRequestSamples.every((sample) =>
        sample.labTests.some((test) => test.labResultStatus === "COMPLETED"),
      );

      if (allCompleted) {
        await prisma.testRequest.update({
          where: { id: testRequestId },
          data: { labInternalStatus: "RESULTS_UPLOADED" },
        });
      }
    } catch (error) {
      logger.error(`Error checking test request status: ${error}`);
    }
  }

  private generateCaseNumber(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const timestamp = now.getTime().toString().slice(-6);

    return `CASE-${year}${month}${day}-${timestamp}`;
  }
}
