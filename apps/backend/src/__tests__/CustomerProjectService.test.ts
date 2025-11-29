const mockPrismaProject = {
  findUnique: jest.fn(),
  findMany: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  count: jest.fn(),
};

const mockPrismaInvoice = {
  findMany: jest.fn(),
};

const mockPrismaTestRequest = {
  count: jest.fn(),
};

jest.mock("@prisma/client", () => {
  const actual = jest.requireActual("@prisma/client");
  return {
    ...actual,
    PrismaClient: jest.fn().mockImplementation(() => ({
      project: mockPrismaProject,
      invoice: mockPrismaInvoice,
      testRequest: mockPrismaTestRequest,
    })),
  };
});

jest.mock("../utils/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
}));

import { Prisma } from "@prisma/client";
import {
  CustomerProjectService,
  type CreateProjectData,
  type UpdateProjectData,
} from "../services/CustomerProjectService";

describe("CustomerProjectService", () => {
  let service: CustomerProjectService;

  const baseProject = {
    id: "proj-1",
    customerId: "cust-1",
    projectCode: "PR-001",
    name: "Water Analysis",
    description: "Testing project",
    isActive: true,
    createdById: "user-1",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const createPayload: CreateProjectData = {
    customerId: "cust-1",
    projectCode: "PR-001",
    name: "Water Analysis",
    description: "Testing project",
    createdById: "user-1",
  };

  const updatePayload: UpdateProjectData = {
    name: "Updated Name",
    description: "Updated description",
    isActive: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    service = new CustomerProjectService();
  });

  describe("createProject", () => {
    it("creates a project when code is unique", async () => {
      mockPrismaProject.findUnique.mockResolvedValue(null);
      mockPrismaProject.create.mockResolvedValue(baseProject);

      const result = await service.createProject(createPayload);

      expect(mockPrismaProject.findUnique).toHaveBeenCalledWith({
        where: {
          customerId_projectCode: {
            customerId: createPayload.customerId,
            projectCode: createPayload.projectCode,
          },
        },
      });
      expect(mockPrismaProject.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          customerId: createPayload.customerId,
          projectCode: createPayload.projectCode,
          name: createPayload.name,
          description: createPayload.description,
          createdById: createPayload.createdById,
          isActive: true,
        }),
      });
      expect(result).toEqual(baseProject);
    });

    it("throws when project code already exists for customer", async () => {
      mockPrismaProject.findUnique.mockResolvedValue(baseProject);

      await expect(service.createProject(createPayload)).rejects.toThrow(
        `Project code '${createPayload.projectCode}' already exists for this customer`,
      );
      expect(mockPrismaProject.create).not.toHaveBeenCalled();
    });
  });

  describe("getProjectsByCustomer", () => {
    it("returns paginated active projects by default", async () => {
      mockPrismaProject.count.mockResolvedValue(1);
      mockPrismaProject.findMany.mockResolvedValue([baseProject]);

      const result = await service.getProjectsByCustomer("cust-1", {});

      expect(mockPrismaProject.count).toHaveBeenCalledWith({
        where: { customerId: "cust-1", isActive: true },
      });
      expect(mockPrismaProject.findMany).toHaveBeenCalledWith({
        where: { customerId: "cust-1", isActive: true },
        skip: 0,
        take: 10,
        orderBy: { updatedAt: "desc" },
      });
      expect(result).toEqual({
        data: [baseProject],
        total: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 10,
      });
    });

    it("supports pagination, includeInactive flag, and search filter", async () => {
      mockPrismaProject.count.mockResolvedValue(12);
      mockPrismaProject.findMany.mockResolvedValue([baseProject]);

      const result = await service.getProjectsByCustomer("cust-1", {
        page: 2,
        limit: 5,
        includeInactive: true,
        search: "water ",
      });

      const expectedWhere = {
        customerId: "cust-1",
        OR: [
          { projectCode: { contains: "water", mode: "insensitive" } },
          { name: { contains: "water", mode: "insensitive" } },
          { description: { contains: "water", mode: "insensitive" } },
        ],
      };

      expect(mockPrismaProject.count).toHaveBeenCalledWith({
        where: expectedWhere,
      });
      expect(mockPrismaProject.findMany).toHaveBeenCalledWith({
        where: expectedWhere,
        skip: 5,
        take: 5,
        orderBy: { updatedAt: "desc" },
      });
      expect(result).toEqual({
        data: [baseProject],
        total: 12,
        totalPages: 3,
        currentPage: 2,
        limit: 5,
      });
    });
  });

  describe("updateProject", () => {
    it("updates project fields", async () => {
      mockPrismaProject.update.mockResolvedValue({
        ...baseProject,
        ...updatePayload,
      });

      const result = await service.updateProject("proj-1", updatePayload);

      expect(mockPrismaProject.update).toHaveBeenCalledWith({
        where: { id: "proj-1" },
        data: updatePayload,
      });
      expect(result).toMatchObject(updatePayload);
    });
  });

  describe("deleteProject", () => {
    it("soft deletes the project", async () => {
      mockPrismaProject.update.mockResolvedValue({
        ...baseProject,
        isActive: false,
      });

      const result = await service.deleteProject("proj-1");

      expect(mockPrismaProject.update).toHaveBeenCalledWith({
        where: { id: "proj-1" },
        data: { isActive: false },
      });
      expect(result.isActive).toBe(false);
    });
  });

  describe("getProjectStats", () => {
    it("aggregates request count and total invoice amounts", async () => {
      mockPrismaTestRequest.count.mockResolvedValue(3);
      mockPrismaInvoice.findMany.mockResolvedValue([
        { netTotal: new Prisma.Decimal(100.25) },
        { netTotal: null },
        { netTotal: 50 },
      ]);

      const stats = await service.getProjectStats("proj-1");

      expect(mockPrismaTestRequest.count).toHaveBeenCalledWith({
        where: { projectId: "proj-1" },
      });
      expect(mockPrismaInvoice.findMany).toHaveBeenCalledWith({
        where: {
          testRequest: { projectId: "proj-1" },
          paymentStatus: { not: "CANCELLED" },
        },
        select: { netTotal: true },
      });
      expect(stats).toEqual({
        requestCount: 3,
        totalAmount: 150.25,
      });
    });
  });
});
