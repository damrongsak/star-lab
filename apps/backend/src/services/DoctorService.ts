import {
  PrismaClient,
  User,
  UserRole,
  TestRequestDocumentStatus,
} from "@prisma/client";
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
        prisma.doctor.findMany({
          where: {
            isActive: true,
          },
          skip,
          take: limit,
          include: {
            user: {
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
          orderBy: {
            createdAt: "desc",
          },
        }),
        prisma.doctor.count({
          where: {
            isActive: true,
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
      logger.info(`Getting workload for doctor: ${doctorId}`);

      // Get current date ranges
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

      // Query statistics using raw SQL for performance
      const [
        pendingCount,
        approvedThisWeek,
        approvedThisMonth,
        rejectedThisWeek,
        rejectedThisMonth,
        totalAssigned,
      ] = await Promise.all([
        // Pending approvals (RESULT_READY)
        prisma.testRequest.count({
          where: {
            doctorId,
            documentStatus: TestRequestDocumentStatus.RESULT_READY,
          },
        }),
        // Approved this week
        prisma.testRequest.count({
          where: {
            doctorId,
            documentStatus: TestRequestDocumentStatus.APPROVED,
            approvedAt: {
              gte: startOfWeek,
            },
          },
        }),
        // Approved this month
        prisma.testRequest.count({
          where: {
            doctorId,
            documentStatus: TestRequestDocumentStatus.APPROVED,
            approvedAt: {
              gte: startOfMonth,
            },
          },
        }),
        // Rejected this week
        prisma.testRequest.count({
          where: {
            doctorId,
            documentStatus: TestRequestDocumentStatus.REJECTED,
            rejectedAt: {
              gte: startOfWeek,
            },
          },
        }),
        // Rejected this month
        prisma.testRequest.count({
          where: {
            doctorId,
            documentStatus: TestRequestDocumentStatus.REJECTED,
            rejectedAt: {
              gte: startOfMonth,
            },
          },
        }),
        // Total assigned (all time)
        prisma.testRequest.count({
          where: {
            doctorId,
          },
        }),
      ]);

      // Calculate average turnaround time (approved + rejected in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(now.getDate() - 30);

      const recentCompletedRequests = await prisma.testRequest.findMany({
        where: {
          doctorId,
          documentStatus: {
            in: [
              TestRequestDocumentStatus.APPROVED,
              TestRequestDocumentStatus.REJECTED,
            ],
          },
          OR: [
            { approvedAt: { gte: thirtyDaysAgo } },
            { rejectedAt: { gte: thirtyDaysAgo } },
          ],
        },
        select: {
          createdAt: true,
          approvedAt: true,
          rejectedAt: true,
        },
      });

      // Calculate average turnaround in hours
      let averageTurnaroundHours = 0;
      if (recentCompletedRequests.length > 0) {
        const totalHours = recentCompletedRequests.reduce((sum, req) => {
          const completionDate = req.approvedAt || req.rejectedAt;
          if (!completionDate || !req.createdAt) return sum;
          const hours =
            (completionDate.getTime() - req.createdAt!.getTime()) /
            (1000 * 60 * 60);
          return sum + hours;
        }, 0);
        averageTurnaroundHours = Math.round(
          totalHours / recentCompletedRequests.length,
        );
      }

      const workload = {
        pendingReviews: pendingCount,
        approvedThisWeek,
        approvedThisMonth,
        rejectedThisWeek,
        rejectedThisMonth,
        totalAssigned,
        averageTurnaroundHours,
        completedThisMonth: approvedThisMonth + rejectedThisMonth,
      };

      logger.info(
        `Workload for doctor ${doctorId}: ${JSON.stringify(workload)}`,
      );
      return workload;
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
      // Verify doctor exists in Doctor table
      const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId },
      });

      if (!doctor) {
        throw new Error("Doctor not found");
      }

      // Verify test request exists
      const testRequest = await prisma.testRequest.findUnique({
        where: { id: testRequestId },
      });

      if (!testRequest) {
        throw new Error("Test request not found");
      }

      // Update test request with doctor assignment
      await prisma.testRequest.update({
        where: { id: testRequestId },
        data: {
          doctorId: doctorId,
        },
      });

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
    search?: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      const where: any = { doctorId };

      if (status) {
        where.status = status;
      }

      if (search) {
        where.OR = [
          { requestNo: { contains: search, mode: "insensitive" } },
          { requesterName: { contains: search, mode: "insensitive" } },
          {
            customer: {
              companyNameEn: { contains: search, mode: "insensitive" },
            },
          },
          {
            customer: {
              companyNameTh: { contains: search, mode: "insensitive" },
            },
          },
        ];
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
   * @param page - Page number (default 1)
   * @param limit - Number of items per page (default 10)
   * @param search - Optional search term
   * @returns Object containing array of test requests and pagination info
   */
  async getPendingApprovals(
    doctorId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    try {
      const offset = (page - 1) * limit;

      // Build search condition
      let searchCondition = "";
      if (search) {
        searchCondition = `
          AND (
            tr.request_no ILIKE '%${search}%' OR 
            c.company_name_en ILIKE '%${search}%' OR
            c.company_name_th ILIKE '%${search}%' OR
            tr.requester_name ILIKE '%${search}%'
          )
        `;
      }

      // Get total count first
      const totalCountQuery = `
        SELECT COUNT(*)::integer as count
        FROM test_requests tr
        LEFT JOIN customers c ON tr.customer_id = c.id
        WHERE tr.doctor_id = '${doctorId}'::uuid
          AND tr.document_status = 'RESULT_READY'
          ${searchCondition}
      `;

      const totalCountResult = (await prisma.$queryRawUnsafe(
        totalCountQuery,
      )) as any[];

      let total = 0;
      if (totalCountResult.length > 0) {
        const countVal = totalCountResult[0].count;
        total = Number(countVal);
      }

      // Get paginated data
      const dataQuery = `
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
        WHERE tr.doctor_id = '${doctorId}'::uuid
          AND tr.document_status = 'RESULT_READY'
          ${searchCondition}
        ORDER BY tr.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const testRequests = (await prisma.$queryRawUnsafe(dataQuery)) as any[];

      logger.info(
        `Retrieved ${testRequests.length} pending approvals for doctor ${doctorId} (Page ${page})`,
      );

      return {
        testRequests,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
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
        },
      });

      if (!testRequest) {
        throw new Error("Test request not found");
      }

      // Verify this request is assigned to the requesting doctor
      if (testRequest.doctorId !== doctorId) {
        throw new Error("This request is not assigned to you");
      }

      logger.info(
        `Doctor ${doctorId} retrieved request ${requestId} for review`,
      );
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
   * @param userId - The ID of the user (doctor) performing the approval
   */
  async approveRequest(
    requestId: string,
    doctorId: string,
    userId: string,
  ): Promise<void> {
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
      if (
        testRequest.documentStatus !== TestRequestDocumentStatus.RESULT_READY
      ) {
        throw new Error(
          `Cannot approve request with status ${testRequest.documentStatus}`,
        );
      }

      // Update request status to APPROVED with timestamp and approver
      await prisma.testRequest.update({
        where: { id: requestId },
        data: {
          documentStatus: TestRequestDocumentStatus.APPROVED,
          approvedAt: new Date(),
          approvedById: userId,
        } as any,
      });

      logger.info(
        `Test request ${requestId} approved by doctor ${doctorId} (User: ${userId})`,
      );
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
  async rejectRequest(
    requestId: string,
    doctorId: string,
    reason: string,
  ): Promise<void> {
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
      if (
        testRequest.documentStatus !== TestRequestDocumentStatus.RESULT_READY
      ) {
        throw new Error(
          `Cannot reject request with status ${testRequest.documentStatus}`,
        );
      }

      // Update request status to REJECTED with timestamp and reason
      await prisma.testRequest.update({
        where: { id: requestId },
        data: {
          documentStatus: TestRequestDocumentStatus.REJECTED,
          rejectedAt: new Date(),
          rejectionReason: reason,
        } as any,
      });

      logger.info(
        `Test request ${requestId} rejected by doctor ${doctorId}: ${reason}`,
      );
    } catch (error) {
      logger.error(`Error rejecting request: ${error}`);
      throw error;
    }
  }

  /**
   * Get approved requests for a doctor
   * @param doctorId - The ID of the doctor
   * @param page - The page number (default: 1)
   * @param limit - The number of items per page (default: 10)
   * @param search - Optional search term
   * @returns Array of approved test requests and pagination info
   */
  async getApprovedRequests(
    doctorId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    try {
      const offset = (page - 1) * limit;

      // Build search condition
      let searchCondition = "";
      if (search) {
        searchCondition = `
          AND (
            tr.request_no ILIKE '%${search}%' OR 
            c.company_name_en ILIKE '%${search}%' OR
            c.company_name_th ILIKE '%${search}%' OR
            tr.requester_name ILIKE '%${search}%'
          )
        `;
      }

      // Get total count first
      const totalCountQuery = `
        SELECT COUNT(*)::integer as count
        FROM test_requests tr
        LEFT JOIN customers c ON tr.customer_id = c.id
        WHERE tr.doctor_id = '${doctorId}'::uuid
          AND tr.document_status = 'APPROVED'
          ${searchCondition}
      `;

      const totalCountResult = (await prisma.$queryRawUnsafe(
        totalCountQuery,
      )) as any[];

      let total = 0;
      if (totalCountResult.length > 0) {
        const countVal = totalCountResult[0].count;
        total = Number(countVal);
      }

      const dataQuery = `
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
        WHERE tr.doctor_id = '${doctorId}'::uuid
          AND tr.document_status = 'APPROVED'
          ${searchCondition}
        ORDER BY tr.approved_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

      const testRequests = (await prisma.$queryRawUnsafe(dataQuery)) as any[];

      logger.info(
        `Retrieved ${testRequests.length} approved requests for doctor ${doctorId} (Page ${page})`,
      );

      return {
        data: testRequests,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      };
    } catch (error) {
      logger.error(`Error getting approved requests: ${error}`);
      throw error;
    }
  }
}
