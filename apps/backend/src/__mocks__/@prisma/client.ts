import { PrismaClient } from '@prisma/client';

export const mockPrismaAuditTrail = {
  create: jest.fn(),
  findMany: jest.fn(),
  count: jest.fn(),
};

export const mockPrisma = {
  auditTrail: mockPrismaAuditTrail,
  // Add any other Prisma models you need to mock here
};

// Mock the PrismaClient constructor
const MockPrismaClient = jest.fn(() => mockPrisma);

// Explicitly define UserRole since requireActual might fail in some jest environments
export const UserRole = {
  ADMIN: 'ADMIN',
  LAB_ADMIN: 'LAB_ADMIN',
  CUSTOMER: 'CUSTOMER',
  TECHNICIAN: 'TECHNICIAN',
  DOCTOR: 'DOCTOR',
  APPROVAL: 'APPROVAL'
};

module.exports = {
  __esModule: true,
  PrismaClient: MockPrismaClient,
  UserRole: UserRole,
  // Export the mock objects for direct import in test files
  mockPrismaAuditTrail: mockPrismaAuditTrail,
  mockPrisma: mockPrisma,
};
