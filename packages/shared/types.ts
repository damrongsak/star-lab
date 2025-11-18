import { z } from "zod";

// Zod Schemas for validation
export const customerRegistrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  companyName: z.string().min(1, "Company name is required"),
  taxIdOrIdCard: z.string().optional(),
  addressLine1: z.string().min(1, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  shippingAddressLine1: z.string().optional(),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZipCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

export const customerLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const customerProfileUpdateSchema = z.object({
  companyName: z.string().min(1, "Company name is required").optional(),
  taxIdOrIdCard: z.string().optional(),
  addressLine1: z.string().min(1, "Address Line 1 is required").optional(),
  addressLine2: z.string().optional(),
  city: z.string().min(1, "City is required").optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().min(1, "Country is required").optional(),
  shippingAddressLine1: z.string().optional(),
  shippingAddressLine2: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingState: z.string().optional(),
  shippingZipCode: z.string().optional(),
  shippingCountry: z.string().optional(),
});

// Enum Types (matching Prisma schema)
export type UserRole =
  | "ADMIN"
  | "LAB_ADMIN"
  | "CUSTOMER"
  | "TECHNICIAN"
  | "DOCTOR"
  | "APPROVAL";

export type TestRequestDocumentStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "PENDING_PAYMENT"
  | "RESULT_READY"
  | "APPROVED"
  | "REJECTED"
  | "CANCELLED";

export type LabInternalStatus =
  | "WAITING_APPROVAL_LAB"
  | "RECEIVED_SAMPLES"
  | "ASSIGNED_TECHNICIAN"
  | "IN_PROGRESS"
  | "RESULTS_UPLOADED"
  | "REVIEWED_BY_DOCTOR"
  | "READY_FOR_APPROVAL"
  | "COMPLETED"
  | "RE_SCHEDULED"
  | "HOLD";

export type TestRequestSampleStatus =
  | "RECEIVED"
  | "REJECTED"
  | "IN_STORAGE"
  | "IN_TESTING"
  | "CONSUMED"
  | "DISPOSED";

export type InvoicePaymentStatus =
  | "PENDING"
  | "PAID"
  | "OVERDUE"
  | "CANCELLED"
  | "REFUNDED";

export type LabResultStatus =
  | "PENDING"
  | "PARTIAL"
  | "COMPLETED"
  | "REVIEWED"
  | "APPROVED"
  | "REJECTED";

// TypeScript Interfaces for data models
export interface User {
  id: string;
  email: string;
  role: UserRole;
  isEmailConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  companyNameEn: string;
  companyNameTh: string;
  legalEntityId: string;
  companyDescription?: string;
  companyAddressLine1: string;
  companyProvince: string;
  companyDistrict: string;
  companySubDistrict: string;
  companyZipCode: string;
  companyPhone: string;
  companyFax?: string;
  companyRegistrationAttachmentsIds?: any;
  operatorIdCard: string;
  operatorPrefix: string;
  operatorFirstName: string;
  operatorLastName: string;
  operatorMobilePhone: string;
  operatorPhone?: string;
  operatorIdCardAttachmentsIds?: any;
  receiptAddressBuildingFloorNumber: string;
  receiptProvince: string;
  receiptDistrict: string;
  receiptSubDistrict: string;
  receiptZipCode: string;
  receiptPhone: string;
  receiptFax?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User; // Optional, for when user relation is included
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  customerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestRequestSample {
  id: string;
  testRequestId: string;
  customerSampleId: string;
  sentSampleDate?: Date;
  animalType?: string;
  sampleSpecimen?: string;
  panel?: string;
  method?: string;
  requestedQty: number;
  receivedQty?: number;
  unit?: string;
  currentStatus: TestRequestSampleStatus;
  storageLocationId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestRequest {
  id: string;
  requestNo: string;
  customerId: string;
  requesterName: string;
  objective?: string;
  requestDate: Date;
  documentStatus: TestRequestDocumentStatus;
  labInternalStatus: LabInternalStatus;
  projectId?: string;
  doctorId?: string;
  notes?: string;
  approvedAt?: Date;
  approvedById?: string;
  rejectedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  testRequestSamples: TestRequestSample[];
  customer: Customer;
  project?: Project;
  doctor?: Doctor;
  approvedBy?: User;
}

// API Response Types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface TestRequestListResponse
  extends PaginatedResponse<TestRequest> {}

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
  token?: string;
}

// API Request Types
export interface CreateTestRequestData {
  customerId: string;
  requesterName: string;
  objective?: string;
  projectId?: string;
  notes?: string;
  samples: CreateTestRequestSampleData[];
}

export interface CreateTestRequestSampleData {
  customerSampleId: string;
  sentSampleDate?: Date;
  animalType?: string;
  sampleSpecimen?: string;
  panel?: string;
  method?: string;
  requestedQty: number;
  unit?: string;
  notes?: string;
}

export interface UpdateTestRequestData {
  requesterName?: string;
  objective?: string;
  projectId?: string;
  notes?: string;
  documentStatus?: TestRequestDocumentStatus;
  labInternalStatus?: LabInternalStatus;
}

// Frontend-specific types
export interface TestRequestTableItem {
  id: string;
  requestNo: string;
  requesterName: string;
  companyName: string;
  requestDate: string;
  documentStatus: TestRequestDocumentStatus;
  labInternalStatus: LabInternalStatus;
  sampleCount: number;
  canEdit: boolean;
  canDelete: boolean;
}

export interface StatusCount {
  status: TestRequestDocumentStatus;
  count: number;
}

export interface TestRequestFilters {
  status?: TestRequestDocumentStatus | "all";
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Utility type for API responses
export type ApiResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      error: ApiError;
      message: string;
    };

// Additional Prisma Schema Interfaces
export interface Doctor {
  id: string;
  userId: string;
  licenseNumber: string;
  specialization?: string;
  qualifications?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface UserProfile {
  id: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
}

export interface DocumentAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  mimeType?: string;
  entityType: string;
  entityId: string;
  uploadedById?: string;
  uploadedAt: Date;
  uploadedBy?: User;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  testRequestId: string;
  customerId: string;
  invoiceDate: Date;
  dueDate?: Date;
  labTaxInfo?: any;
  subTotal: number;
  taxRate: number;
  taxAmount: number;
  netTotal: number;
  paymentStatus: InvoicePaymentStatus;
  paymentSlipAttachmentUrl?: string;
  issuedById?: string;
  createdAt: Date;
  updatedAt: Date;
  invoiceLineItems: InvoiceLineItem[];
  customer?: Customer;
  testRequest?: TestRequest;
  issuedBy?: User;
}

export interface InvoiceLineItem {
  id: string;
  invoiceId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface LabTest {
  id: string;
  testRequestSampleId: string;
  caseNo?: string;
  caseDate?: Date;
  assignedLabTechnicianId?: string;
  testPanel?: string;
  testMethod?: string;
  labResultStatus: LabResultStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  labResults: LabResult[];
  assignedLabTechnician?: User;
  testRequestSample?: TestRequestSample;
}

export interface LabResult {
  id: string;
  labTestId: string;
  parameter?: string;
  value?: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal?: boolean;
  notes?: string;
  recordedById?: string;
  recordedAt: Date;
  labTest?: LabTest;
  recordedBy?: User;
}

export interface StorageLocation {
  id: string;
  name: string;
  type: string;
  parentId?: string;
  capacity?: number;
  currentOccupancy?: number;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  parent?: StorageLocation;
  subLocations: StorageLocation[];
}

export interface AuditTrail {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: any;
  timestamp: Date;
  user?: User;
}

// Extended auth interfaces
export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest {
  user?: AuthenticatedUser;
}

export interface CustomerWithUser extends Customer {
  user: Omit<User, "passwordHash">;
}

// Sample interface for legacy compatibility (keeping existing interface)
export interface Sample {
  id: string;
  testRequestId: string;
  sampleId: string;
  animalType: string;
  panel: string;
  quantity: number;
}
