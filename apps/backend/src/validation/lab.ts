import { z } from "zod";

// Lab Test Validation Schemas
export const createLabTestSchema = z.object({
  testRequestSampleId: z.string().uuid("Invalid sample ID format"),
  assignedLabTechnicianId: z.string().uuid("Invalid technician ID format"),
  testPanel: z.string().optional(),
  testMethod: z.string().optional(),
  notes: z.string().optional(),
});

export const updateLabTestSchema = z.object({
  assignedLabTechnicianId: z
    .string()
    .uuid("Invalid technician ID format")
    .optional(),
  testPanel: z.string().optional(),
  testMethod: z.string().optional(),
  labResultStatus: z
    .enum([
      "PENDING",
      "PARTIAL",
      "COMPLETED",
      "REVIEWED",
      "APPROVED",
      "REJECTED",
    ])
    .optional(),
  notes: z.string().optional(),
});

// Lab Result Validation Schemas
export const createLabResultSchema = z.object({
  labTestId: z.string().uuid("Invalid lab test ID format"),
  parameter: z.string().min(1, "Parameter is required"),
  value: z.string().min(1, "Value is required"),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  isAbnormal: z.boolean().optional(),
  notes: z.string().optional(),
});

export const updateLabResultSchema = z.object({
  parameter: z.string().min(1, "Parameter is required").optional(),
  value: z.string().min(1, "Value is required").optional(),
  unit: z.string().optional(),
  referenceRange: z.string().optional(),
  isAbnormal: z.boolean().optional(),
  notes: z.string().optional(),
});

// Test Request Validation Schemas
export const createTestRequestSchema = z.object({
  requesterName: z.string().min(1, "Requester name is required"),
  objective: z.string().optional(),
  projectId: z.string().uuid("Invalid project ID format").optional(),
  notes: z.string().optional(),
  samples: z
    .array(
      z.object({
        customerSampleId: z.string().min(1, "Customer sample ID is required"),
        sentSampleDate: z
          .string()
          .transform((str) => new Date(str))
          .optional(),
        animalType: z.string().optional(),
        sampleSpecimen: z.string().optional(),
        panel: z.string().optional(),
        method: z.string().optional(),
        requestedQty: z
          .number()
          .positive("Requested quantity must be positive"),
        unit: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .min(1, "At least one sample is required"),
});

export const updateTestRequestSchema = z.object({
  requesterName: z.string().min(1, "Requester name is required").optional(),
  objective: z.string().optional(),
  projectId: z.string().uuid("Invalid project ID format").optional(),
  notes: z.string().optional(),
  documentStatus: z
    .enum([
      "DRAFT",
      "SUBMITTED",
      "PENDING_PAYMENT",
      "APPROVED",
      "REJECTED",
      "CANCELLED",
    ])
    .optional(),
  labInternalStatus: z
    .enum([
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
    ])
    .optional(),
});

export const updateTestRequestSampleSchema = z.object({
  receivedQty: z
    .number()
    .positive("Received quantity must be positive")
    .optional(),
  currentStatus: z
    .enum([
      "RECEIVED",
      "REJECTED",
      "IN_STORAGE",
      "IN_TESTING",
      "CONSUMED",
      "DISPOSED",
    ])
    .optional(),
  storageLocationId: z
    .string()
    .uuid("Invalid storage location ID format")
    .optional(),
  notes: z.string().optional(),
});

export const assignTechnicianSchema = z.object({
  technicianId: z.string().uuid("Invalid technician ID format"),
});
