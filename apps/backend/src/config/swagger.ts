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
    tags: [
      {
        name: "Test Requests",
        description: "Test request management endpoints",
      },
      {
        name: "Test Request Samples",
        description: "Sample management endpoints for test requests",
      },
      {
        name: "Authentication",
        description: "User authentication and authorization",
      },
      {
        name: "Customers",
        description: "Customer management",
      },
      {
        name: "Lab Management",
        description: "Laboratory operations and management",
      },
      {
        name: "Lab Results",
        description: "Lab result creation and management",
      },
      {
        name: "Invoices",
        description: "Invoice and billing management",
      },
      {
        name: "Doctors",
        description: "Doctor and medical professional management",
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
      responses: {
        Unauthorized: {
          description: "Authentication required",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Unauthorized - invalid or missing token",
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: "Access forbidden - insufficient permissions",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Access denied - insufficient permissions",
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal server error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Internal server error",
                  },
                  error: {
                    type: "string",
                    example: "Detailed error information",
                  },
                },
              },
            },
          },
        },
        ValidationError: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  success: {
                    type: "boolean",
                    example: false,
                  },
                  message: {
                    type: "string",
                    example: "Validation failed",
                  },
                  errors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        field: {
                          type: "string",
                          example: "email",
                        },
                        message: {
                          type: "string",
                          example: "Invalid email format",
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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
            companyDescription: {
              type: "string",
              example: "Leading laboratory testing services",
              nullable: true,
            },
            companyAddressLine1: {
              type: "string",
              example: "123 Main Street",
            },
            companyProvince: {
              type: "string",
              example: "Bangkok",
            },
            companyDistrict: {
              type: "string",
              example: "Chatuchak",
            },
            companySubDistrict: {
              type: "string",
              example: "Chatuchak",
            },
            companyZipCode: {
              type: "string",
              example: "10900",
            },
            companyPhone: {
              type: "string",
              example: "+66-2-123-4567",
            },
            companyFax: {
              type: "string",
              example: "+66-2-123-4568",
              nullable: true,
            },
            operatorIdCard: {
              type: "string",
              example: "1234567890123",
            },
            operatorPrefix: {
              type: "string",
              example: "Mr.",
            },
            operatorFirstName: {
              type: "string",
              example: "John",
            },
            operatorLastName: {
              type: "string",
              example: "Doe",
            },
            operatorMobilePhone: {
              type: "string",
              example: "+66-81-234-5678",
            },
            operatorPhone: {
              type: "string",
              example: "+66-2-123-4569",
              nullable: true,
            },
            receiptAddressBuildingFloorNumber: {
              type: "string",
              example: "456 Business Center, 5th Floor",
            },
            receiptProvince: {
              type: "string",
              example: "Bangkok",
            },
            receiptDistrict: {
              type: "string",
              example: "Watthana",
            },
            receiptSubDistrict: {
              type: "string",
              example: "Khlong Toei Nuea",
            },
            receiptZipCode: {
              type: "string",
              example: "10110",
            },
            receiptPhone: {
              type: "string",
              example: "+66-2-234-5678",
            },
            receiptFax: {
              type: "string",
              example: "+66-2-234-5679",
              nullable: true,
            },
            isActive: {
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
              description: "Unique doctor identifier",
            },
            userId: {
              type: "string",
              format: "uuid",
              description: "Associated user account ID",
            },
            licenseNumber: {
              type: "string",
              example: "MD123456789",
              description: "Medical license number",
            },
            specialization: {
              type: "string",
              example: "Pathology",
              description: "Medical specialization",
            },
            qualifications: {
              type: "string",
              example: "MD, PhD in Pathology",
              description: "Educational qualifications and certifications",
            },
            experience: {
              type: "integer",
              example: 10,
              description: "Years of experience",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether doctor is active",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Record creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Record last update timestamp",
            },
          },
          required: [
            "id",
            "userId",
            "licenseNumber",
            "specialization",
            "isActive",
          ],
        },
        DoctorWorkload: {
          type: "object",
          properties: {
            doctorId: {
              type: "string",
              format: "uuid",
              description: "Doctor ID",
            },
            totalTestRequests: {
              type: "integer",
              example: 25,
              description: "Total test requests assigned",
            },
            pendingTestRequests: {
              type: "integer",
              example: 8,
              description: "Pending test requests",
            },
            completedTestRequests: {
              type: "integer",
              example: 17,
              description: "Completed test requests",
            },
            workloadPercentage: {
              type: "number",
              format: "float",
              example: 75.5,
              description: "Current workload percentage",
            },
          },
          required: [
            "doctorId",
            "totalTestRequests",
            "pendingTestRequests",
            "completedTestRequests",
          ],
        },
        CreateDoctorRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "doctor@example.com",
              description: "Doctor's email address",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePassword123!",
              description: "Account password",
            },
            firstName: {
              type: "string",
              example: "John",
              description: "First name",
            },
            lastName: {
              type: "string",
              example: "Doe",
              description: "Last name",
            },
            licenseNumber: {
              type: "string",
              example: "MD123456789",
              description: "Medical license number",
            },
            specialization: {
              type: "string",
              example: "Pathology",
              description: "Medical specialization",
            },
            qualifications: {
              type: "string",
              example: "MD, PhD in Pathology",
              description: "Educational qualifications",
            },
            experience: {
              type: "integer",
              example: 10,
              description: "Years of experience",
            },
          },
          required: [
            "email",
            "password",
            "firstName",
            "lastName",
            "licenseNumber",
            "specialization",
          ],
        },
        UpdateDoctorRequest: {
          type: "object",
          properties: {
            firstName: {
              type: "string",
              example: "John",
              description: "First name",
            },
            lastName: {
              type: "string",
              example: "Doe",
              description: "Last name",
            },
            licenseNumber: {
              type: "string",
              example: "MD123456789",
              description: "Medical license number",
            },
            specialization: {
              type: "string",
              example: "Pathology",
              description: "Medical specialization",
            },
            qualifications: {
              type: "string",
              example: "MD, PhD in Pathology",
              description: "Educational qualifications",
            },
            experience: {
              type: "integer",
              example: 10,
              description: "Years of experience",
            },
            isActive: {
              type: "boolean",
              example: true,
              description: "Whether doctor is active",
            },
          },
        },
        AssignTestRequestRequest: {
          type: "object",
          properties: {
            testRequestId: {
              type: "string",
              format: "uuid",
              description: "Test request ID to assign",
            },
            doctorId: {
              type: "string",
              format: "uuid",
              description: "Doctor ID to assign to",
            },
          },
          required: ["testRequestId", "doctorId"],
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
              example: "REQ-20250627-123456",
            },
            customerId: {
              type: "string",
              format: "uuid",
            },
            requesterName: {
              type: "string",
              example: "Dr. John Doe",
            },
            objective: {
              type: "string",
              example: "Quality control testing for production batch",
            },
            projectId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            notes: {
              type: "string",
              example: "Handle samples with care",
              nullable: true,
            },
            requestDate: {
              type: "string",
              format: "date-time",
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
              example: "SUBMITTED",
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
              example: "WAITING_APPROVAL_LAB",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            testRequestSamples: {
              type: "array",
              items: {
                $ref: "#/components/schemas/TestRequestSample",
              },
            },
            customer: {
              $ref: "#/components/schemas/Customer",
            },
            project: {
              type: "object",
              nullable: true,
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                name: {
                  type: "string",
                },
              },
            },
          },
        },
        TestRequestSample: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            testRequestId: {
              type: "string",
              format: "uuid",
            },
            customerSampleId: {
              type: "string",
              example: "SAMPLE-001",
            },
            sentSampleDate: {
              type: "string",
              format: "date",
              nullable: true,
            },
            animalType: {
              type: "string",
              example: "Bovine",
              nullable: true,
            },
            sampleSpecimen: {
              type: "string",
              example: "Blood serum",
              nullable: true,
            },
            panel: {
              type: "string",
              example: "Complete Blood Count",
              nullable: true,
            },
            method: {
              type: "string",
              example: "Automated Hematology Analyzer",
              nullable: true,
            },
            requestedQty: {
              type: "number",
              example: 5,
            },
            receivedQty: {
              type: "number",
              example: 5,
              nullable: true,
            },
            unit: {
              type: "string",
              example: "mL",
              nullable: true,
            },
            currentStatus: {
              type: "string",
              enum: [
                "PENDING",
                "RECEIVED",
                "IN_TESTING",
                "COMPLETED",
                "REJECTED",
              ],
              example: "PENDING",
            },
            storageLocationId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            notes: {
              type: "string",
              example: "Store at -20°C",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            labTests: {
              type: "array",
              items: {
                $ref: "#/components/schemas/LabTest",
              },
            },
            storageLocation: {
              type: "object",
              nullable: true,
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                name: {
                  type: "string",
                },
                location: {
                  type: "string",
                },
              },
            },
          },
        },
        LabResult: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
            },
            labTestId: {
              type: "string",
              format: "uuid",
            },
            parameter: {
              type: "string",
              example: "Hemoglobin",
              description: "Test parameter name",
            },
            value: {
              type: "string",
              example: "14.2",
              description: "Test result value",
            },
            unit: {
              type: "string",
              example: "g/dL",
              description: "Unit of measurement",
              nullable: true,
            },
            referenceRange: {
              type: "string",
              example: "12.0-16.0",
              description: "Normal reference range",
              nullable: true,
            },
            isAbnormal: {
              type: "boolean",
              example: false,
              description: "Whether the result is abnormal",
              nullable: true,
            },
            notes: {
              type: "string",
              example: "Result within normal limits",
              description: "Additional notes about the result",
              nullable: true,
            },
            recordedById: {
              type: "string",
              format: "uuid",
              description: "ID of the user who recorded the result",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            recordedBy: {
              type: "object",
              nullable: true,
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                email: {
                  type: "string",
                  format: "email",
                },
              },
            },
          },
        },
        Invoice: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              description: "Unique invoice identifier",
            },
            invoiceNo: {
              type: "string",
              example: "INV-2025-001234",
              description: "Invoice number",
            },
            testRequestId: {
              type: "string",
              format: "uuid",
              description: "Associated test request ID",
            },
            customerId: {
              type: "string",
              format: "uuid",
              description: "Customer ID who owns this invoice",
            },
            invoiceDate: {
              type: "string",
              format: "date",
              description: "Invoice issue date",
            },
            dueDate: {
              type: "string",
              format: "date",
              description: "Payment due date",
              nullable: true,
            },
            subTotal: {
              type: "number",
              format: "decimal",
              example: 1000.0,
              description: "Subtotal amount before tax",
            },
            taxRate: {
              type: "number",
              format: "decimal",
              example: 0.07,
              description: "Tax rate applied (e.g., 0.07 for 7%)",
            },
            taxAmount: {
              type: "number",
              format: "decimal",
              example: 70.0,
              description: "Tax amount calculated",
            },
            netTotal: {
              type: "number",
              format: "decimal",
              example: 1070.0,
              description: "Final total amount including tax",
            },
            paymentStatus: {
              type: "string",
              enum: ["PENDING", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"],
              example: "PENDING",
              description: "Current payment status",
            },
            paymentDate: {
              type: "string",
              format: "date-time",
              description: "Date when payment was received",
              nullable: true,
            },
            paymentSlipUrl: {
              type: "string",
              format: "uri",
              description: "URL to payment slip/proof",
              nullable: true,
            },
            notes: {
              type: "string",
              description: "Additional notes or comments",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "Invoice creation timestamp",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "Last update timestamp",
            },
            customer: {
              $ref: "#/components/schemas/Customer",
            },
            testRequest: {
              $ref: "#/components/schemas/TestRequest",
            },
          },
          required: [
            "id",
            "invoiceNo",
            "testRequestId",
            "customerId",
            "invoiceDate",
            "subTotal",
            "netTotal",
            "paymentStatus",
          ],
        },
        InvoiceStatistics: {
          type: "object",
          properties: {
            totalInvoices: {
              type: "integer",
              example: 150,
              description: "Total number of invoices",
            },
            totalRevenue: {
              type: "number",
              format: "decimal",
              example: 125000.5,
              description: "Total revenue from all invoices",
            },
            paidInvoices: {
              type: "integer",
              example: 120,
              description: "Number of paid invoices",
            },
            pendingInvoices: {
              type: "integer",
              example: 25,
              description: "Number of pending invoices",
            },
            overdueInvoices: {
              type: "integer",
              example: 5,
              description: "Number of overdue invoices",
            },
            averageInvoiceValue: {
              type: "number",
              format: "decimal",
              example: 833.33,
              description: "Average invoice amount",
            },
            monthlyRevenue: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  month: {
                    type: "string",
                    example: "2025-06",
                    description: "Month in YYYY-MM format",
                  },
                  revenue: {
                    type: "number",
                    format: "decimal",
                    example: 15000.0,
                    description: "Revenue for the month",
                  },
                  count: {
                    type: "integer",
                    example: 18,
                    description: "Number of invoices in the month",
                  },
                },
              },
            },
          },
        },
        UpdateInvoiceRequest: {
          type: "object",
          properties: {
            dueDate: {
              type: "string",
              format: "date",
              description: "Payment due date",
            },
            notes: {
              type: "string",
              description: "Additional notes or comments",
            },
            paymentStatus: {
              type: "string",
              enum: ["PENDING", "PAID", "OVERDUE", "CANCELLED", "REFUNDED"],
              description: "Payment status",
            },
          },
        },
        MarkAsPaidRequest: {
          type: "object",
          properties: {
            paymentSlipUrl: {
              type: "string",
              format: "uri",
              description: "URL to payment slip or proof of payment",
            },
          },
        },
        RegisterRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "SecurePassword123!",
              description: "User's password (minimum 8 characters)",
            },
            companyNameEn: {
              type: "string",
              example: "StarLab Company Ltd.",
              description: "Company name in English",
            },
            companyNameTh: {
              type: "string",
              example: "บริษัท สตาร์แล็บ จำกัด",
              description: "Company name in Thai",
            },
            legalEntityId: {
              type: "string",
              example: "0123456789012",
              description: "Legal entity ID/Tax ID",
            },
            companyDescription: {
              type: "string",
              example: "Leading laboratory testing services",
              description: "Company description",
              nullable: true,
            },
            companyAddressLine1: {
              type: "string",
              example: "123 Main Street",
              description: "Company address line 1",
            },
            companyProvince: {
              type: "string",
              example: "Bangkok",
              description: "Company province",
            },
            companyDistrict: {
              type: "string",
              example: "Chatuchak",
              description: "Company district",
            },
            companySubDistrict: {
              type: "string",
              example: "Chatuchak",
              description: "Company sub-district",
            },
            companyZipCode: {
              type: "string",
              example: "10900",
              description: "Company zip code",
            },
            companyPhone: {
              type: "string",
              example: "+66-2-123-4567",
              description: "Company phone number",
            },
            companyFax: {
              type: "string",
              example: "+66-2-123-4568",
              description: "Company fax number",
              nullable: true,
            },
            operatorIdCard: {
              type: "string",
              example: "1234567890123",
              description: "Operator ID card number",
            },
            operatorPrefix: {
              type: "string",
              example: "Mr.",
              description: "Operator name prefix",
            },
            operatorFirstName: {
              type: "string",
              example: "John",
              description: "Operator first name",
            },
            operatorLastName: {
              type: "string",
              example: "Doe",
              description: "Operator last name",
            },
            operatorMobilePhone: {
              type: "string",
              example: "+66-81-234-5678",
              description: "Operator mobile phone",
            },
            operatorPhone: {
              type: "string",
              example: "+66-2-123-4569",
              description: "Operator phone number",
              nullable: true,
            },
            receiptAddressBuildingFloorNumber: {
              type: "string",
              example: "456 Business Center, 5th Floor",
              description: "Receipt address building and floor",
            },
            receiptProvince: {
              type: "string",
              example: "Bangkok",
              description: "Receipt address province",
            },
            receiptDistrict: {
              type: "string",
              example: "Watthana",
              description: "Receipt address district",
            },
            receiptSubDistrict: {
              type: "string",
              example: "Khlong Toei Nuea",
              description: "Receipt address sub-district",
            },
            receiptZipCode: {
              type: "string",
              example: "10110",
              description: "Receipt address zip code",
            },
            receiptPhone: {
              type: "string",
              example: "+66-2-234-5678",
              description: "Receipt address phone",
            },
            receiptFax: {
              type: "string",
              example: "+66-2-234-5679",
              description: "Receipt address fax",
              nullable: true,
            },
          },
          required: [
            "email",
            "password",
            "companyNameEn",
            "companyNameTh",
            "legalEntityId",
            "companyAddressLine1",
            "companyProvince",
            "companyDistrict",
            "companySubDistrict",
            "companyZipCode",
            "companyPhone",
            "operatorIdCard",
            "operatorPrefix",
            "operatorFirstName",
            "operatorLastName",
            "operatorMobilePhone",
            "receiptAddressBuildingFloorNumber",
            "receiptProvince",
            "receiptDistrict",
            "receiptSubDistrict",
            "receiptZipCode",
            "receiptPhone",
          ],
        },
        LoginRequest: {
          type: "object",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "user@example.com",
              description: "User's email address",
            },
            password: {
              type: "string",
              format: "password",
              example: "SecurePassword123!",
              description: "User's password",
            },
          },
          required: ["email", "password"],
        },
        AuthResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
              description: "Success status",
            },
            message: {
              type: "string",
              example: "Login successful",
              description: "Response message",
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            customer: {
              $ref: "#/components/schemas/Customer",
              nullable: true,
              description: "Customer profile (only for customer users)",
            },
            token: {
              type: "string",
              example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
              description: "JWT authentication token",
            },
          },
          required: ["success", "message", "user"],
        },
        ChangePasswordRequest: {
          type: "object",
          properties: {
            currentPassword: {
              type: "string",
              format: "password",
              example: "OldPassword123!",
              description: "Current password",
            },
            newPassword: {
              type: "string",
              format: "password",
              minLength: 8,
              example: "NewSecurePassword456!",
              description: "New password (minimum 8 characters)",
            },
          },
          required: ["currentPassword", "newPassword"],
        },
        UserProfile: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            user: {
              $ref: "#/components/schemas/User",
            },
            customer: {
              $ref: "#/components/schemas/Customer",
              nullable: true,
              description: "Customer profile (only for customer users)",
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
              example: "CASE-20250627-123456",
            },
            caseDate: {
              type: "string",
              format: "date-time",
            },
            assignedLabTechnicianId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            testPanel: {
              type: "string",
              example: "Complete Blood Count",
              nullable: true,
            },
            testMethod: {
              type: "string",
              example: "Automated Hematology Analyzer",
              nullable: true,
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
              example: "PENDING",
            },
            testStartDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            testEndDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            reviewedByDoctorId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            reviewDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            approvedByLabAdminId: {
              type: "string",
              format: "uuid",
              nullable: true,
            },
            approvalDate: {
              type: "string",
              format: "date-time",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
            assignedLabTechnician: {
              type: "object",
              nullable: true,
              properties: {
                id: {
                  type: "string",
                  format: "uuid",
                },
                email: {
                  type: "string",
                  format: "email",
                },
              },
            },
            labResults: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    format: "uuid",
                  },
                  parameter: {
                    type: "string",
                    example: "Hemoglobin",
                  },
                  value: {
                    type: "string",
                    example: "14.5",
                  },
                  unit: {
                    type: "string",
                    example: "g/dL",
                  },
                  referenceRange: {
                    type: "string",
                    example: "12.0-16.0",
                  },
                  status: {
                    type: "string",
                    enum: ["NORMAL", "ABNORMAL", "CRITICAL"],
                    example: "NORMAL",
                  },
                },
              },
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
  console.log("📚 Swagger UI available at http://localhost:5001/api-docs");
};

export default specs;
