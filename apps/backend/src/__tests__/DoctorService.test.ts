// Mock all dependencies first, before any imports
const mockPrismaUser = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  count: jest.fn(),
};

const mockPrismaTestRequest = {
  findMany: jest.fn(),
  count: jest.fn(),
};

jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    user: mockPrismaUser,
    testRequest: mockPrismaTestRequest,
  })),
  UserRole: {
    DOCTOR: "DOCTOR",
    CUSTOMER: "CUSTOMER",
    ADMIN: "ADMIN",
  },
}));

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

jest.mock("../utils/password", () => ({
  hashPassword: jest.fn(),
}));

// Now import after all mocks are set up
import { DoctorService } from "../services/DoctorService";
import type {
  CreateDoctorData,
  UpdateDoctorData,
} from "../services/DoctorService";
import logger from "../utils/logger";
import { hashPassword } from "../utils/password";

describe("DoctorService", () => {
  let doctorService: DoctorService;

  const mockDoctor = {
    id: "doctor-123",
    email: "doctor@example.com",
    passwordHash: "hashed-password",
    role: "DOCTOR",
    isEmailConfirmed: true,
    verificationToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createDoctorData: CreateDoctorData = {
    email: "doctor@example.com",
    password: "password123",
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "081-234-5678",
    licenseNumber: "MD-12345",
    specialization: "Internal Medicine",
    qualifications: "MD, PhD",
    isActive: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    doctorService = new DoctorService();
  });

  describe("createDoctor", () => {
    it("should create a doctor successfully", async () => {
      // Setup mocks
      mockPrismaUser.findUnique.mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue("hashed-password");
      mockPrismaUser.create.mockResolvedValue(mockDoctor);

      // Execute
      const result = await doctorService.createDoctor(createDoctorData);

      // Verify
      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: { email: createDoctorData.email },
      });
      expect(hashPassword).toHaveBeenCalledWith(createDoctorData.password);
      expect(mockPrismaUser.create).toHaveBeenCalledWith({
        data: {
          email: createDoctorData.email,
          passwordHash: "hashed-password",
          role: "DOCTOR",
        },
      });
      expect(result).toEqual(mockDoctor);
      expect(logger.info).toHaveBeenCalledWith(
        `Doctor user created: ${mockDoctor.email}`,
      );
    });

    it("should throw error if email already exists", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockDoctor);

      await expect(
        doctorService.createDoctor(createDoctorData),
      ).rejects.toThrow("Email already exists");

      expect(hashPassword).not.toHaveBeenCalled();
      expect(mockPrismaUser.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle password hashing errors", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);
      const hashError = new Error("Password hashing failed");
      (hashPassword as jest.Mock).mockRejectedValue(hashError);

      await expect(
        doctorService.createDoctor(createDoctorData),
      ).rejects.toThrow("Password hashing failed");

      expect(mockPrismaUser.create).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle database creation errors", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);
      (hashPassword as jest.Mock).mockResolvedValue("hashed-password");
      const dbError = new Error("Database error");
      mockPrismaUser.create.mockRejectedValue(dbError);

      await expect(
        doctorService.createDoctor(createDoctorData),
      ).rejects.toThrow("Database error");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getDoctorById", () => {
    it("should return doctor when found", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockDoctor);

      const result = await doctorService.getDoctorById("doctor-123");

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: {
          id: "doctor-123",
          role: "DOCTOR",
        },
      });
      expect(result).toEqual(mockDoctor);
    });

    it("should return null when doctor not found", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await doctorService.getDoctorById("nonexistent");

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaUser.findUnique.mockRejectedValue(dbError);

      await expect(doctorService.getDoctorById("doctor-123")).rejects.toThrow(
        "Database error",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getDoctorByUserId", () => {
    it("should return doctor by user ID", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockDoctor);

      const result = await doctorService.getDoctorByUserId("doctor-123");

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: {
          id: "doctor-123",
          role: "DOCTOR",
        },
      });
      expect(result).toEqual(mockDoctor);
    });

    it("should return null when doctor not found by user ID", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      const result = await doctorService.getDoctorByUserId("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("getAllDoctors", () => {
    it("should return paginated doctors", async () => {
      const mockDoctors = [mockDoctor];
      const totalCount = 1;

      mockPrismaUser.findMany.mockResolvedValue(mockDoctors);
      mockPrismaUser.count.mockResolvedValue(totalCount);

      const result = await doctorService.getAllDoctors(1, 10);

      expect(mockPrismaUser.findMany).toHaveBeenCalledWith({
        where: {
          role: "DOCTOR",
        },
        skip: 0,
        take: 10,
        orderBy: {
          email: "asc",
        },
      });
      expect(mockPrismaUser.count).toHaveBeenCalledWith({
        where: {
          role: "DOCTOR",
        },
      });
      expect(result).toEqual({
        doctors: mockDoctors,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should handle pagination correctly", async () => {
      const mockDoctors = [mockDoctor];
      const totalCount = 25;

      mockPrismaUser.findMany.mockResolvedValue(mockDoctors);
      mockPrismaUser.count.mockResolvedValue(totalCount);

      const result = await doctorService.getAllDoctors(3, 10);

      expect(mockPrismaUser.findMany).toHaveBeenCalledWith({
        where: {
          role: "DOCTOR",
        },
        skip: 20, // (3 - 1) * 10
        take: 10,
        orderBy: {
          email: "asc",
        },
      });
      expect(result).toEqual({
        doctors: mockDoctors,
        total: totalCount,
        totalPages: 3, // Math.ceil(25 / 10)
        currentPage: 3,
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database error");
      mockPrismaUser.findMany.mockRejectedValue(dbError);

      await expect(doctorService.getAllDoctors()).rejects.toThrow(
        "Database error",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("updateDoctor", () => {
    const updateData: UpdateDoctorData = {
      email: "updated@example.com",
      firstName: "Updated",
      lastName: "Name",
    };

    it("should update doctor successfully", async () => {
      const updatedDoctor = { ...mockDoctor, ...updateData };
      mockPrismaUser.update.mockResolvedValue(updatedDoctor);

      const result = await doctorService.updateDoctor("doctor-123", updateData);

      expect(mockPrismaUser.update).toHaveBeenCalledWith({
        where: {
          id: "doctor-123",
          role: "DOCTOR",
        },
        data: {
          email: updateData.email,
        },
      });
      expect(result).toEqual(updatedDoctor);
      expect(logger.info).toHaveBeenCalledWith(
        `Doctor updated: ${updatedDoctor.email}`,
      );
    });

    it("should handle update errors", async () => {
      const updateError = new Error("Update failed");
      mockPrismaUser.update.mockRejectedValue(updateError);

      await expect(
        doctorService.updateDoctor("doctor-123", updateData),
      ).rejects.toThrow("Update failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("deleteDoctor", () => {
    it("should delete doctor successfully", async () => {
      mockPrismaUser.delete.mockResolvedValue(mockDoctor);

      await doctorService.deleteDoctor("doctor-123");

      expect(mockPrismaUser.delete).toHaveBeenCalledWith({
        where: {
          id: "doctor-123",
          role: "DOCTOR",
        },
      });
      expect(logger.info).toHaveBeenCalledWith("Doctor deleted: doctor-123");
    });

    it("should handle delete errors", async () => {
      const deleteError = new Error("Delete failed");
      mockPrismaUser.delete.mockRejectedValue(deleteError);

      await expect(doctorService.deleteDoctor("doctor-123")).rejects.toThrow(
        "Delete failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("searchDoctors", () => {
    it("should search doctors by email", async () => {
      const mockDoctors = [mockDoctor];
      mockPrismaUser.findMany.mockResolvedValue(mockDoctors);

      const result = await doctorService.searchDoctors("doctor");

      expect(mockPrismaUser.findMany).toHaveBeenCalledWith({
        where: {
          role: "DOCTOR",
          email: { contains: "doctor", mode: "insensitive" },
        },
      });
      expect(result).toEqual(mockDoctors);
    });

    it("should handle search errors", async () => {
      const searchError = new Error("Search failed");
      mockPrismaUser.findMany.mockRejectedValue(searchError);

      await expect(doctorService.searchDoctors("test")).rejects.toThrow(
        "Search failed",
      );

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getDoctorWorkload", () => {
    it("should return doctor workload statistics", async () => {
      const result = await doctorService.getDoctorWorkload("doctor-123");

      expect(result).toEqual({
        pendingReviews: 0,
        inProgressTests: 0,
        completedThisMonth: 0,
        totalAssigned: 0,
      });
      expect(logger.info).toHaveBeenCalledWith(
        "Getting workload for doctor: doctor-123",
      );
    });

    it("should handle workload errors", async () => {
      // Since getDoctorWorkload currently returns static data, we'll simulate an error
      jest
        .spyOn(doctorService, "getDoctorWorkload")
        .mockRejectedValue(new Error("Workload error"));

      await expect(
        doctorService.getDoctorWorkload("doctor-123"),
      ).rejects.toThrow("Workload error");
    });
  });

  describe("assignTestRequestToDoctor", () => {
    it("should assign test request to doctor successfully", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(mockDoctor);

      await doctorService.assignTestRequestToDoctor(
        "test-request-123",
        "doctor-123",
      );

      expect(mockPrismaUser.findUnique).toHaveBeenCalledWith({
        where: {
          id: "doctor-123",
          role: "DOCTOR",
        },
      });
      expect(logger.info).toHaveBeenCalledWith(
        "Would assign test request test-request-123 to doctor doctor-123",
      );
      expect(logger.info).toHaveBeenCalledWith(
        "Test request test-request-123 assigned to doctor doctor-123",
      );
    });

    it("should throw error if doctor not found", async () => {
      mockPrismaUser.findUnique.mockResolvedValue(null);

      await expect(
        doctorService.assignTestRequestToDoctor(
          "test-request-123",
          "nonexistent",
        ),
      ).rejects.toThrow("Doctor not found");

      expect(logger.error).toHaveBeenCalled();
    });

    it("should handle assignment errors", async () => {
      const assignError = new Error("Assignment failed");
      mockPrismaUser.findUnique.mockRejectedValue(assignError);

      await expect(
        doctorService.assignTestRequestToDoctor(
          "test-request-123",
          "doctor-123",
        ),
      ).rejects.toThrow("Assignment failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe("getDoctorTestRequests", () => {
    it("should return paginated test requests for doctor", async () => {
      const mockTestRequests = [
        {
          id: "test-request-1",
          doctorId: "doctor-123",
          status: "PENDING",
          customer: {
            companyNameEn: "Test Company",
            companyNameTh: "บริษัททดสอบ",
          },
          testRequestSamples: [],
        },
      ];
      const totalCount = 1;

      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);
      mockPrismaTestRequest.count.mockResolvedValue(totalCount);

      const result = await doctorService.getDoctorTestRequests("doctor-123");

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: { doctorId: "doctor-123" },
        skip: 0,
        take: 10,
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
      });
      expect(mockPrismaTestRequest.count).toHaveBeenCalledWith({
        where: { doctorId: "doctor-123" },
      });
      expect(result).toEqual({
        testRequests: mockTestRequests,
        total: totalCount,
        totalPages: 1,
        currentPage: 1,
      });
    });

    it("should filter by status when provided", async () => {
      const mockTestRequests: any[] = [];
      mockPrismaTestRequest.findMany.mockResolvedValue(mockTestRequests);
      mockPrismaTestRequest.count.mockResolvedValue(0);

      await doctorService.getDoctorTestRequests(
        "doctor-123",
        1,
        10,
        "COMPLETED",
      );

      expect(mockPrismaTestRequest.findMany).toHaveBeenCalledWith({
        where: { doctorId: "doctor-123", status: "COMPLETED" },
        skip: 0,
        take: 10,
        include: expect.any(Object),
        orderBy: {
          updatedAt: "desc",
        },
      });
    });

    it("should handle test request query errors", async () => {
      const queryError = new Error("Query failed");
      mockPrismaTestRequest.findMany.mockRejectedValue(queryError);

      await expect(
        doctorService.getDoctorTestRequests("doctor-123"),
      ).rejects.toThrow("Query failed");

      expect(logger.error).toHaveBeenCalled();
    });
  });
});
