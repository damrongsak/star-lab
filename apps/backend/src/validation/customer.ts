import { z } from "zod";

// For updating customer profile (all fields optional, but validation applies if present)
export const updateCustomerProfileSchema = z.object({
  companyNameEn: z
    .string()
    .min(1, "Company English name is required.")
    .optional(),
  companyNameTh: z.string().min(1, "Company Thai name is required.").optional(),
  legalEntityId: z.string().min(1, "Legal Entity ID is required.").optional(),
  companyDescription: z.string().optional(),
  companyAddressLine1: z
    .string()
    .min(1, "Company address is required.")
    .optional(),
  companyProvince: z
    .string()
    .min(1, "Company province is required.")
    .optional(),
  companyDistrict: z
    .string()
    .min(1, "Company district is required.")
    .optional(),
  companySubDistrict: z
    .string()
    .min(1, "Company sub-district is required.")
    .optional(),
  companyZipCode: z
    .string()
    .min(1, "Company postal code is required.")
    .optional(),
  companyPhone: z
    .string()
    .min(1, "Company phone number is required.")
    .optional(),
  companyFax: z.string().optional(),

  operatorIdCard: z
    .string()
    .min(1, "Operator ID Card number is required.")
    .optional(),
  operatorPrefix: z.string().min(1, "Operator prefix is required.").optional(),
  operatorFirstName: z
    .string()
    .min(1, "Operator first name is required.")
    .optional(),
  operatorLastName: z
    .string()
    .min(1, "Operator last name is required.")
    .optional(),
  operatorMobilePhone: z
    .string()
    .min(1, "Operator mobile phone is required.")
    .optional(),
  operatorPhone: z.string().optional(),

  receiptAddressBuildingFloorNumber: z
    .string()
    .min(1, "Receipt address is required.")
    .optional(),
  receiptProvince: z
    .string()
    .min(1, "Receipt province is required.")
    .optional(),
  receiptDistrict: z
    .string()
    .min(1, "Receipt district is required.")
    .optional(),
  receiptSubDistrict: z
    .string()
    .min(1, "Receipt sub-district is required.")
    .optional(),
  receiptZipCode: z
    .string()
    .min(1, "Receipt postal code is required.")
    .optional(),
  receiptPhone: z
    .string()
    .min(1, "Receipt phone number is required.")
    .optional(),
  receiptFax: z.string().optional(),
});
