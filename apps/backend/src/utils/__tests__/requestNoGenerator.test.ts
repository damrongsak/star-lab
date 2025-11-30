import { generateRequestNumber } from "../requestNoGenerator";
import { prisma } from "../db";

// Mock prisma
jest.mock("../db", () => ({
  prisma: {
    requestSequence: {
      upsert: jest.fn(),
    },
  },
}));

describe("generateRequestNumber", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a new request number when no sequence exists", async () => {
    (prisma.requestSequence.upsert as jest.Mock).mockResolvedValue({
      sequence: 1,
    });

    const result = await generateRequestNumber("ABC");

    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const expectedDate = `${now.getFullYear()}${month}${day}`;

    expect(result).toBe(`ABC-${expectedDate}-001`);
    expect(prisma.requestSequence.upsert).toHaveBeenCalledWith({
      where: {
        companyCode_date: {
          companyCode: "ABC",
          date: expectedDate,
        },
      },
      create: {
        companyCode: "ABC",
        date: expectedDate,
        sequence: 1,
      },
      update: {
        sequence: { increment: 1 },
      },
      select: {
        sequence: true,
      },
    });
  });

  it("should increment sequence when one exists", async () => {
    (prisma.requestSequence.upsert as jest.Mock).mockResolvedValue({
      sequence: 6,
    });

    const result = await generateRequestNumber("ABC");

    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const expectedDate = `${now.getFullYear()}${month}${day}`;

    expect(result).toBe(`ABC-${expectedDate}-006`);
    expect(prisma.requestSequence.upsert).toHaveBeenCalledWith({
      where: {
        companyCode_date: {
          companyCode: "ABC",
          date: expectedDate,
        },
      },
      create: {
        companyCode: "ABC",
        date: expectedDate,
        sequence: 1,
      },
      update: {
        sequence: { increment: 1 },
      },
      select: {
        sequence: true,
      },
    });
  });

  it("should throw error for invalid company code", async () => {
    await expect(generateRequestNumber("A")).rejects.toThrow(
      "Invalid company code",
    );
    await expect(generateRequestNumber("Invalid@Code")).rejects.toThrow(
      "Invalid company code",
    );
  });

  it("should throw error if limit reached", async () => {
    (prisma.requestSequence.upsert as jest.Mock).mockResolvedValue({
      sequence: 10000,
    }); // Simulate sequence going above limit

    await expect(generateRequestNumber("ABC")).rejects.toThrow(
      "Request sequence limit of 9999 reached",
    );
  });
});
