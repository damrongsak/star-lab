import { generateRequestNumber } from "../requestNoGenerator";
import { prisma } from "../db";

// Mock prisma
jest.mock("../db", () => ({
  prisma: {
    $transaction: jest.fn((callback) => callback({
      requestSequence: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    })),
  },
}));

describe("generateRequestNumber", () => {
  const mockTx = {
    requestSequence: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (prisma.$transaction as jest.Mock).mockImplementation((callback) => callback(mockTx));
  });

  it("should generate a new request number when no sequence exists", async () => {
    mockTx.requestSequence.findUnique.mockResolvedValue(null);
    mockTx.requestSequence.create.mockResolvedValue({ sequence: 1 });

    const result = await generateRequestNumber("ABC");

    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const expectedDate = `${now.getFullYear()}${month}${day}`;

    expect(result).toBe(`ABC-${expectedDate}-001`);
    expect(mockTx.requestSequence.create).toHaveBeenCalled();
  });

  it("should increment sequence when one exists", async () => {
    mockTx.requestSequence.findUnique.mockResolvedValue({ id: "seq-1", sequence: 5 });
    mockTx.requestSequence.update.mockResolvedValue({ sequence: 6 });

    const result = await generateRequestNumber("ABC");

    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const expectedDate = `${now.getFullYear()}${month}${day}`;

    expect(result).toBe(`ABC-${expectedDate}-006`);
    expect(mockTx.requestSequence.update).toHaveBeenCalled();
  });

  it("should throw error for invalid company code", async () => {
    await expect(generateRequestNumber("A")).rejects.toThrow("Invalid company code");
    await expect(generateRequestNumber("Invalid@Code")).rejects.toThrow("Invalid company code");
  });

  it("should throw error if limit reached", async () => {
    mockTx.requestSequence.findUnique.mockResolvedValue({ id: "seq-1", sequence: 9999 });

    await expect(generateRequestNumber("ABC")).rejects.toThrow("limit of 9999 reached");
  });
});
