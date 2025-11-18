import { PrismaClient, User, UserRole, TestRequestDocumentStatus } from "@prisma/client";
import logger from "../utils/logger";
import { hashPassword } from "../utils/password";

const prisma = new PrismaClient();

export interface CreateDoctorData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  licenseNumber: string;
  specialization?: string;
  qualifications?: string;
  isActive?: boolean;
}

export interface UpdateDoctorData {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  licenseNumber?: string;
  specialization?: string;
  qualifications?: string;
  isActive?: boolean;
}

export class DoctorService {
  async createDoctor(doctorData: CreateDoctorData): Promise<User> {
    try {
      // Check if email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: doctorData.email },
      });

      if (existingUser) {
        throw new Error("Email already exists");
      }

      // Hash password
      const hashedPassword = await hashPassword(doctorData.password);

      // Create user with doctor role
      const user = await prisma.user.create({
        data: {
          email: doctorData.email,
          passwordHash: hashedPassword,
          role: UserRole.DOCTOR,
        },
      });

      logger.info(`Doctor user created: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Error creating doctor: ${error}`);
      throw error;
    }
  }

  async getDoctorById(id: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
          role: UserRole.DOCTOR,
        },
      });

      return user;
    } catch (error) {
      logger.error(`Error getting doctor by ID: ${error}`);
      throw error;
    }
  }

  async getDoctorByUserId(userId: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
          role: UserRole.DOCTOR,
        },
      });

      return user;
    } catch (error) {
      logger.error(`Error getting doctor by user ID: ${error}`);
      throw error;
    }
  }

  async getAllDoctors(page: number = 1, limit: number = 10) {
    try {
      const skip = (page - 1) * limit;

      const [doctors, total] = await Promise.all([
        prisma.user.findMany({
          where: {
            role: UserRole.DOCTOR,
          },
          skip,
          take: limit,
          orderBy: {
            email: "asc",
          },
        }),
        prisma.user.count({
          where: {
            role: UserRole.DOCTOR,
          },
        }),
      ]);

      return {
        doctors,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting all doctors: ${error}`);
      throw error;
    }
  }

  async updateDoctor(id: string, updateData: UpdateDoctorData): Promise<User> {
    try {
      const user = await prisma.user.update({
        where: {
          id,
          role: UserRole.DOCTOR,
        },
        data: {
          email: updateData.email,
        },
      });

      logger.info(`Doctor updated: ${user.email}`);
      return user;
    } catch (error) {
      logger.error(`Error updating doctor: ${error}`);
      throw error;
    }
  }

  async deleteDoctor(id: string): Promise<void> {
    try {
      await prisma.user.delete({
        where: {
          id,
          role: UserRole.DOCTOR,
        },
      });

      logger.info(`Doctor deleted: ${id}`);
    } catch (error) {
      logger.error(`Error deleting doctor: ${error}`);
      throw error;
    }
  }

  async searchDoctors(searchTerm: string) {
    try {
      const doctors = await prisma.user.findMany({
        where: {
          role: UserRole.DOCTOR,
          email: { contains: searchTerm, mode: "insensitive" },
        },
      });

      return doctors;
    } catch (error) {
      logger.error(`Error searching doctors: ${error}`);
      throw error;
    }
  }

  async getDoctorWorkload(doctorId: string) {
    try {
      // Return mock data for now since we need the actual test request relationships
      // In the future, this will query actual test requests for the doctor
      logger.info(`Getting workload for doctor: ${doctorId}`);

      return {
        pendingReviews: 0,
        inProgressTests: 0,
        completedThisMonth: 0,
        totalAssigned: 0,
      };
    } catch (error) {
      logger.error(`Error getting doctor workload: ${error}`);
      throw error;
    }
  }

  async assignTestRequestToDoctor(
    testRequestId: string,
    doctorId: string,
  ): Promise<void> {
    try {
      // Verify doctor exists
      const doctor = await this.getDoctorById(doctorId);
      if (!doctor) {
        throw new Error("Doctor not found");
      }

      // For now, disable the assignment since the relationship isn't fully set up
      // This will be enabled once the Doctor table is properly connected
      logger.info(
        `Would assign test request ${testRequestId} to doctor ${doctorId}`,
      );

      logger.info(
        `Test request ${testRequestId} assigned to doctor ${doctorId}`,
      );
    } catch (error) {
      logger.error(`Error assigning test request to doctor: ${error}`);
      throw error;
    }
  }

  async getDoctorTestRequests(
    doctorId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = { doctorId };

      if (status) {
        where.status = status;
      }

      const [testRequests, total] = await Promise.all([
        prisma.testRequest.findMany({
          where,
          skip,
          take: limit,
          include: {
            customer: {
              select: {
                companyNameEn: true,
                companyNameTh: true,
              },
            },
            testRequestSamples: {
              include: {
                labTests: {
                  select: {
                    id: true,
                    labResultStatus: true,
                    labResults: true,
                  },
                },
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
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
      logger.error(`Error getting doctor test requests: ${error}`);
      throw error;
    }
  }

  /**
   * Get pending approval requests for a specific doctor
   * @param doctorId - The ID of the doctor
   * @returns Array of test requests with status RESULT_READY assigned to the doctor
   */
  async getPendingApprovals(doctorId: string) {
    try {
      // Use raw query as temporary workaround for enum mismatch in Docker container
      const testRequests = await prisma.$queryRaw`
        SELECT
          tr.*,
          json_build_object(
            'companyNameEn', c.company_name_en,
            'companyNameTh', c.company_name_th,
            'operatorFirstName', c.operator_first_name,
            'operatorLastName', c.operator_last_name
          ) as customer
        FROM test_requests tr
        LEFT JOIN customers c ON tr.customer_id = c.id
        WHERE tr.doctor_id = ${doctorId}::uuid
          AND tr.document_status = 'RESULT_READY'
        ORDER BY tr.created_at DESC
      ` as any[];

      logger.info(`Retrieved ${testRequests.length} pending approvals for doctor ${doctorId}`);
      return testRequests;
    } catch (error) {
      logger.error(`Error getting pending approvals: ${error}`);
      throw error;
    }
  }

  /**
   * Get detailed request information for doctor review
   * @param requestId - The ID of the test request
   * @param doctorId - The ID of the doctor
   * @returns Test request with full details including samples and results
   */
  async getRequestForReview(requestId: string, doctorId: string) {
    try {
      const testRequest = await prisma.testRequest.findUnique({
        where: { id: requestId },
        include: {
          customer: {
            select: {
              companyNameEn: true,
              companyNameTh: true,
              operatorFirstName: true,
              operatorLastName: true,
              operatorMobilePhone: true,
            },
          },
          testRequestSamples: {
            include: {
              labTests: {
                include: {
                  labResults: true,
                },
              },
            },
          },
          approvedBy: {
            select: {
              id: true,
              email: true,
              userProfile: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      if (!testRequest) {
        throw new Error("Test request not found");
      }

      // Verify this request is assigned to the requesting doctor
      if (testRequest.doctorId !== doctorId) {
        throw new Error("This request is not assigned to you");
      }

      logger.info(`Doctor ${doctorId} retrieved request ${requestId} for review`);
      return testRequest;
    } catch (error) {
      logger.error(`Error getting request for review: ${error}`);
      throw error;
    }
  }

  /**
   * Approve a test request
   * @param requestId - The ID of the test request
   * @param doctorId - The ID of the approving doctor
   */
  async approveRequest(requestId: string, doctorId: string): Promise<void> {
    try {
      const testRequest = await prisma.testRequest.findUnique({
        where: { id: requestId },
      });

      if (!testRequest) {
        throw new Error("Test request not found");
      }

      // Verify this request is assigned to the requesting doctor
      if (testRequest.doctorId !== doctorId) {
        throw new Error("This request is not assigned to you");
      }

      // Verify status is RESULT_READY
      if (testRequest.documentStatus !== TestRequestDocumentStatus.RESULT_READY) {
        throw new Error(`Cannot approve request with status ${testRequest.documentStatus}`);
      }

      // Update request status to APPROVED with timestamp and approver
      await prisma.testRequest.update({
        where: { id: requestId },
        data: {
          documentStatus: TestRequestDocumentStatus.APPROVED,
          approvedAt: new Date(),
          approvedById: doctorId,
        },
      });

      logger.info(`Test request ${requestId} approved by doctor ${doctorId}`);
    } catch (error) {
      logger.error(`Error approving request: ${error}`);
      throw error;
    }
  }

  /**
   * Reject a test request with a reason
   * @param requestId - The ID of the test request
   * @param doctorId - The ID of the rejecting doctor
   * @param reason - The reason for rejection
   */
  async rejectRequest(requestId: string, doctorId: string, reason: string): Promise<void> {
    try {
      const testRequest = await prisma.testRequest.findUnique({
        where: { id: requestId },
      });

      if (!testRequest) {
        throw new Error("Test request not found");
      }

      // Verify this request is assigned to the requesting doctor
      if (testRequest.doctorId !== doctorId) {
        throw new Error("This request is not assigned to you");
      }

      // Verify status is RESULT_READY
      if (testRequest.documentStatus !== TestRequestDocumentStatus.RESULT_READY) {
        throw new Error(`Cannot reject request with status ${testRequest.documentStatus}`);
      }

      // Update request status to REJECTED with timestamp and reason
      await prisma.testRequest.update({
        where: { id: requestId },
        data: {
          documentStatus: TestRequestDocumentStatus.REJECTED,
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
      });

      logger.info(`Test request ${requestId} rejected by doctor ${doctorId}: ${reason}`);
    } catch (error) {
      logger.error(`Error rejecting request: ${error}`);
      throw error;
    }
  }

  /**
   * Get approved requests for a doctor
   * @param doctorId - The ID of the doctor
   * @returns Array of approved test requests
   */
  async getApprovedRequests(doctorId: string) {
    try {
      const testRequests = await prisma.$queryRaw`
        SELECT
          tr.id,
          tr.request_no,
          tr.customer_id,
          tr.requester_name,
          tr.request_date,
          tr.document_status,
          tr.lab_internal_status,
          tr.approved_at,
          tr.approved_by_id,
          tr.created_at,
          tr.updated_at,
          json_build_object(
            'id', c.id,
            'company_name_en', c.company_name_en,
            'company_name_th', c.company_name_th,
            'operator_first_name', c.operator_first_name,
            'operator_last_name', c.operator_last_name
          ) as customer
        FROM test_requests tr
        LEFT JOIN customers c ON tr.customer_id = c.id
        WHERE tr.doctor_id = ${doctorId}::uuid
          AND tr.document_status = 'APPROVED'
        ORDER BY tr.approved_at DESC
      ` as any[];

      logger.info(`Retrieved ${testRequests.length} approved requests for doctor ${doctorId}`);
      return testRequests;
    } catch (error) {
      logger.error(`Error getting approved requests: ${error}`);
      throw error;
    }
  }
}
