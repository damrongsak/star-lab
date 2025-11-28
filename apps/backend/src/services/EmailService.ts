import nodemailer, { Transporter } from "nodemailer";
import { prisma } from "../utils/db";
import logger from "../utils/logger";

/**
 * Service responsible for sending transactional emails for the STAR-LAB platform.
 */
class EmailService {
  private transporter: Transporter | null;

  private readonly fromAddress: string;

  private readonly frontendUrl: string;

  constructor() {
    const host = process.env.SMTP_HOST;
    const portRaw = process.env.SMTP_PORT;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS ?? process.env.SMTP_PASSWORD;
    const secureRaw = process.env.SMTP_SECURE ?? process.env.SMTP_SECURE_MODE;

    this.fromAddress =
      process.env.SMTP_FROM ?? "STAR-LAB <noreply@starlab.com>";
    this.frontendUrl = process.env.FRONTEND_URL ?? "http://localhost:3000";

    if (!host || !portRaw || !user || !pass) {
      logger.warn(
        "Email service disabled: incomplete SMTP configuration. Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS are defined.",
      );
      this.transporter = null;
      return;
    }

    const port = Number(portRaw);

    if (Number.isNaN(port)) {
      logger.warn(
        `Email service disabled: SMTP_PORT must be a valid number. Received "${portRaw}".`,
      );
      this.transporter = null;
      return;
    }

    const secure =
      typeof secureRaw === "string"
        ? secureRaw.toLowerCase() === "true"
        : Boolean(secureRaw);

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }

  /**
   * Sends an HTML email to the specified recipient with retry logic.
   *
   * @param to - Recipient email address.
   * @param subject - Email subject line.
   * @param html - HTML body content to send.
   * @throws When the transporter is not configured or all retry attempts fail.
   */
  private async sendEmail(
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    if (!this.transporter) {
      const errorMessage = "Email transporter is not configured.";
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }

    const maxAttempts = 3;
    const retryDelayMs = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        await this.transporter.sendMail({
          from: this.fromAddress,
          to,
          subject,
          html,
        });
        logger.info(
          `Email sent to ${to} with subject "${subject}" on attempt ${attempt}.`,
        );
        return;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        logger.error(
          `Failed to send email to ${to} (attempt ${attempt}/${maxAttempts}): ${errorMessage}`,
        );

        if (attempt === maxAttempts) {
          throw error instanceof Error ? error : new Error(errorMessage);
        }

        await this.delay(retryDelayMs);
      }
    }
  }

  /**
   * Sends an email verification message containing a tokenized link.
   *
   * @param email - Recipient email address.
   * @param token - Verification token to embed in the link.
   */
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    try {
      const verificationUrl = `${this.frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
      const subject = "Verify Your Email - STAR-LAB";
      const html = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h1 style="color: #0b3d91;">Welcome to STAR-LAB</h1>
          <p>Thank you for registering with STAR-LAB. Please verify your email address by clicking the button below.</p>
          <p style="text-align: center;">
            <a href="${verificationUrl}" style="background-color: #0b3d91; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Verify Email</a>
          </p>
          <p>If the button does not work, copy and paste the following link into your browser:</p>
          <p><a href="${verificationUrl}" style="color: #0b3d91;">${verificationUrl}</a></p>
          <p style="margin-top: 24px;">Regards,<br/>The STAR-LAB Team</p>
        </div>
      `;
      await this.sendEmail(email, subject, html);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        `Failed to send verification email to ${email}: ${errorMessage}`,
      );
      throw error;
    }
  }

  /**
   * Sends an approval notification when a test request is approved.
   *
   * @param customerId - Identifier of the customer to notify.
   * @param requestId - Identifier of the approved test request.
   */
  async sendApprovalNotification(
    customerId: string,
    requestId: string,
  ): Promise<void> {
    try {
      const [customer, request] = await Promise.all([
        prisma.customer.findUnique({
          where: { id: customerId },
          include: {
            user: {
              select: {
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
        }),
        prisma.testRequest.findUnique({
          where: { id: requestId },
          select: {
            id: true,
            requestNo: true,
          },
        }),
      ]);

      if (!customer || !customer.user?.email) {
        logger.warn(
          `Approval notification skipped: customer ${customerId} or their email address was not found.`,
        );
        return;
      }

      if (!request) {
        logger.warn(
          `Approval notification skipped: test request ${requestId} was not found.`,
        );
        return;
      }

      const userProfile = customer.user?.userProfile;
      const firstName = userProfile?.firstName;
      const lastName = userProfile?.lastName;
      const recipientName =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || "Customer";

      const subject = "Test Request Approved - STAR-LAB";
      const resultsLink = `${this.frontendUrl}/test-requests/${request.id}/results`;
      const html = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h1 style="color: #0b3d91;">Test Request Approved</h1>
          <p>Dear ${recipientName},</p>
          <p>Your test request <strong>${request.requestNo}</strong> has been approved.</p>
          <p>You can review the status and results using the link below:</p>
          <p style="text-align: center;">
            <a href="${resultsLink}" style="background-color: #0b3d91; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px;">View Results</a>
          </p>
          <p>If the button does not work, copy and paste this link into your browser:</p>
          <p><a href="${resultsLink}" style="color: #0b3d91;">${resultsLink}</a></p>
          <p style="margin-top: 24px;">Thank you for choosing STAR-LAB.</p>
          <p>Regards,<br/>The STAR-LAB Team</p>
        </div>
      `;
      await this.sendEmail(customer.user.email, subject, html);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        `Failed to send approval notification for request ${requestId} to customer ${customerId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  /**
   * Sends a rejection notification when a test request is rejected.
   *
   * @param customerId - Identifier of the customer to notify.
   * @param requestId - Identifier of the rejected test request.
   * @param reason - Explanation for the rejection.
   */
  async sendRejectionNotification(
    customerId: string,
    requestId: string,
    reason: string,
  ): Promise<void> {
    try {
      const [customer, request] = await Promise.all([
        prisma.customer.findUnique({
          where: { id: customerId },
          include: {
            user: {
              select: {
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
        }),
        prisma.testRequest.findUnique({
          where: { id: requestId },
          select: {
            requestNo: true,
          },
        }),
      ]);

      if (!customer || !customer.user?.email) {
        logger.warn(
          `Rejection notification skipped: customer ${customerId} or their email address was not found.`,
        );
        return;
      }

      if (!request) {
        logger.warn(
          `Rejection notification skipped: test request ${requestId} was not found.`,
        );
        return;
      }

      const userProfile = customer.user?.userProfile;
      const firstName = userProfile?.firstName;
      const lastName = userProfile?.lastName;
      const recipientName =
        firstName && lastName
          ? `${firstName} ${lastName}`
          : firstName || lastName || "Customer";

      const subject = "Test Request Rejected - STAR-LAB";
      const supportEmail =
        this.extractEmailAddress(this.fromAddress) ?? "support@starlab.com";
      const html = `
        <div style="font-family: Arial, sans-serif; font-size: 16px; color: #333;">
          <h1 style="color: #c0392b;">Test Request Rejected</h1>
          <p>Dear ${recipientName},</p>
          <p>We regret to inform you that your test request <strong>${request.requestNo}</strong> was not approved.</p>
          <p><strong>Reason:</strong> ${reason}</p>
          <p>If you have any questions or require further assistance, please contact our support team at <a href="mailto:${supportEmail}" style="color: #0b3d91;">${supportEmail}</a>.</p>
          <p style="margin-top: 24px;">We appreciate your understanding and are here to help.</p>
          <p>Regards,<br/>The STAR-LAB Team</p>
        </div>
      `;
      await this.sendEmail(customer.user.email, subject, html);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      logger.error(
        `Failed to send rejection notification for request ${requestId} to customer ${customerId}: ${errorMessage}`,
      );
      throw error;
    }
  }

  /**
   * Extracts the email address component from a formatted "Name <email@domain>" string.
   *
   * @param value - The value to parse.
   * @returns The extracted email address, or null if parsing fails.
   */
  private extractEmailAddress(value: string): string | null {
    const match = value.match(/<(.+)>/);
    return match ? match[1] : value.includes("@") ? value : null;
  }

  /**
   * Pauses execution for the specified number of milliseconds.
   *
   * @param durationMs - Time to wait in milliseconds.
   */
  private async delay(durationMs: number): Promise<void> {
    await new Promise((resolve) => {
      setTimeout(resolve, durationMs);
    });
  }
}

export default EmailService;

export const emailService = new EmailService();
