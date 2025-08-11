import { z } from 'zod';

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

// TypeScript Interfaces for data models
export interface User {
  id: string;
  email: string;
  role: string;
  isEmailConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  id: string;
  userId: string;
  companyName: string;
  taxIdOrIdCard?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode?: string;
  country: string;
  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingZipCode?: string;
  shippingCountry?: string;
  registrationAttachments?: string[]; // Assuming this will be an array of URLs
  createdAt: Date;
  updatedAt: Date;
  user?: User; // Optional, for when user relation is included
}

export interface TestRequest {
  id: string;
  requestNo: string;
  customerId: string;
  status: 'submitted' | 'acknowledged' | 'approved' | 'rejected';
  requestDate: string;
}

export interface Sample {
  id: string;
  testRequestId: string;
  sampleId: string;
  animalType: string;
  panel: string;
  quantity: number;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
