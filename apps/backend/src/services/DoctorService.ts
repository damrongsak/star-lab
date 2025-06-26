import { PrismaClient, User, UserRole } from "@prisma/client";
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
}
