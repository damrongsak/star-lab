import { prisma } from "./db";

const COMPANY_CODE_PATTERN = /^[A-Za-z0-9]{2,50}$/;
const MAX_SEQUENCE = 9999;
const SEQUENCE_PAD_LENGTH = 3;

/**
 * Generate a unique request number for the provided company code.
 *
 * Format: {COMPANY_CODE}-{YYYYMMDD}-{SEQUENCE}
 * Example: ABC-20251024-001
 *
 * Transactions enforce atomic sequence increments scoped by company and day.
 *
 * @param companyCode - Alphanumeric identifier (2-50 chars) for the company.
 * @returns Promise resolving to the generated request number string.
 * @throws Error if validation fails, the sequence limit is exceeded, or persistence fails.
 */
export async function generateRequestNumber(
  companyCode: string,
): Promise<string> {
  try {
    const normalizedCode = companyCode.trim().toUpperCase();

    if (!COMPANY_CODE_PATTERN.test(normalizedCode)) {
      throw new Error(
        "Invalid company code. It must be 2-50 alphanumeric characters.",
      );
    }

    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, "0");
    const day = `${now.getDate()}`.padStart(2, "0");
    const formattedDate = `${now.getFullYear()}${month}${day}`;

    const { sequence } = await prisma.$transaction(async (tx) => {
      const existingSequence = await tx.requestSequence.findUnique({
        where: {
          companyCode_date: {
            companyCode: normalizedCode,
            date: formattedDate,
          },
        },
      });

      if (!existingSequence) {
        const created = await tx.requestSequence.create({
          data: {
            companyCode: normalizedCode,
            date: formattedDate,
          },
          select: {
            sequence: true,
          },
        });

        return created;
      }

      if (existingSequence.sequence >= MAX_SEQUENCE) {
        throw new Error(
          `Request sequence limit of ${MAX_SEQUENCE} reached for ${formattedDate}.`,
        );
      }

      return tx.requestSequence.update({
        where: { id: existingSequence.id },
        data: { sequence: { increment: 1 } },
        select: { sequence: true },
      });
    });

    const paddedSequence = sequence
      .toString()
      .padStart(SEQUENCE_PAD_LENGTH, "0");

    return `${normalizedCode}-${formattedDate}-${paddedSequence}`;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to generate request number: ${error.message}`);
    }

    throw new Error(
      "Failed to generate request number due to an unknown error",
    );
  }
}
