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
// When new PrismaClient() is called, it will return our mockPrisma object
const MockPrismaClient = jest.fn(() => mockPrisma);

// When @prisma/client is required, provide our mock PrismaClient constructor
// and any other original exports if needed.
module.exports = {
  __esModule: true, // This is important for ESM interop
  // ...jest.requireActual('@prisma/client'), // No need to spread actual if fully mocking
  PrismaClient: MockPrismaClient,
  // Export the mock objects for direct import in test files
  mockPrismaAuditTrail: mockPrismaAuditTrail,
  mockPrisma: mockPrisma,
};
