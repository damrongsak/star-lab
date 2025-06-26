import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Star Lab API",
      version: "1.0.0",
      description: "Laboratory Management System API",
      contact: {
        name: "Star Lab Support",
        email: "support@starlab.com",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Development server",
      },
      {
        url: "https://lab.orignx.dev",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            message: {
              type: "string",
              example: "Error message",
            },
            error: {
              type: "string",
              example: "Detailed error information",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "123e4567-e89b-12d3-a456-426614174000",
            },
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
            },
            role: {
              type: "string",
              enum: [
                "ADMIN",
                "LAB_ADMIN",
                "CUSTOMER",
                "TECHNICIAN",
                "DOCTOR",
                "APPROVAL",
              ],
              example: "CUSTOMER",
            },
            isEmailConfirmed: {
              type: "boolean",
              example: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Customer: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            companyNameEn: {
              type: "string",
              example: "StarLab Company Ltd.",
            },
            companyNameTh: {
              type: "string",
              example: "บริษัท สตาร์แล็บ จำกัด",
            },
            legalEntityId: {
              type: "string",
              example: "0123456789012",
            },
            companyAddressLine1: {
              type: "string",
              example: "123 Main Street",
            },
            companyProvince: {
              type: "string",
              example: "Bangkok",
            },
            companyPhone: {
              type: "string",
              example: "+66-2-123-4567",
            },
            operatorFirstName: {
              type: "string",
              example: "John",
            },
            operatorLastName: {
              type: "string",
              example: "Doe",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
          },
        },
        Doctor: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            userId: {
              type: "string",
              format: "uuid",
            },
            licenseNumber: {
              type: "string",
              example: "MD123456789",
            },
            specialization: {
              type: "string",
              example: "Pathology",
            },
            qualifications: {
              type: "string",
              example: "MD, PhD in Pathology",
            },
            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },
        TestRequest: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            requestNo: {
              type: "string",
              example: "TR-2025-001234",
            },
            customerId: {
              type: "string",
              format: "uuid",
            },
            requesterName: {
              type: "string",
              example: "John Doe",
            },
            objective: {
              type: "string",
              example: "Quality control testing",
            },
            requestDate: {
              type: "string",
              format: "date",
            },
            documentStatus: {
              type: "string",
              enum: [
                "DRAFT",
                "SUBMITTED",
                "PENDING_PAYMENT",
                "APPROVED",
                "REJECTED",
                "CANCELLED",
              ],
            },
            labInternalStatus: {
              type: "string",
              enum: [
                "WAITING_APPROVAL_LAB",
                "RECEIVED_SAMPLES",
                "ASSIGNED_TECHNICIAN",
                "IN_PROGRESS",
                "RESULTS_UPLOADED",
                "REVIEWED_BY_DOCTOR",
                "READY_FOR_APPROVAL",
                "COMPLETED",
                "RE_SCHEDULED",
                "HOLD",
              ],
            },
          },
        },
        Invoice: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            invoiceNo: {
              type: "string",
              example: "INV-2025-001234",
            },
            testRequestId: {
              type: "string",
              format: "uuid",
            },
            customerId: {
              type: "string",
              format: "uuid",
            },
            invoiceDate: {
              type: "string",
              format: "date",
            },
            subTotal: {
              type: "number",
              format: "decimal",
              example: 1000.0,
            },
            taxRate: {
              type: "number",
              format: "decimal",
              example: 0.07,
            },
            taxAmount: {
              type: "number",
              format: "decimal",
              example: 70.0,
            },
            netTotal: {
              type: "number",
              format: "decimal",
              example: 1070.0,
            },
            paymentStatus: {
              type: "string",
              enum: ["PENDING", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"],
            },
          },
        },
        LabTest: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            testRequestSampleId: {
              type: "string",
              format: "uuid",
            },
            caseNo: {
              type: "string",
              example: "LAB-2025-001234",
            },
            assignedLabTechnicianId: {
              type: "string",
              format: "uuid",
            },
            testPanel: {
              type: "string",
              example: "Complete Blood Count",
            },
            testMethod: {
              type: "string",
              example: "Automated Hematology Analyzer",
            },
            labResultStatus: {
              type: "string",
              enum: [
                "PENDING",
                "PARTIAL",
                "COMPLETED",
                "REVIEWED",
                "APPROVED",
                "REJECTED",
              ],
            },
          },
        },
        PaginatedResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            data: {
              type: "array",
              items: {},
            },
            pagination: {
              type: "object",
              properties: {
                page: {
                  type: "integer",
                  example: 1,
                },
                limit: {
                  type: "integer",
                  example: 10,
                },
                total: {
                  type: "integer",
                  example: 100,
                },
                totalPages: {
                  type: "integer",
                  example: 10,
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to the API docs
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("📚 Swagger UI available at http://localhost:5002/api-docs");
};

export default specs;
