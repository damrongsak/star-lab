import { z } from "zod";

// For customer registration
export const registerCustomerSchema = z
  .object({
    email: z.string().email("Invalid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long.")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character.",
      ),
    confirmPassword: z.string(), // Frontend will handle comparison

    // Company Information
    companyNameEn: z.string().min(1, "Company English name is required."),
    companyNameTh: z.string().min(1, "Company Thai name is required."),
    legalEntityId: z.string().min(1, "Legal Entity ID is required."),
    companyDescription: z.string().optional(),
    companyAddressLine1: z.string().min(1, "Company address is required."),
    companyProvince: z.string().min(1, "Company province is required."),
    companyDistrict: z.string().min(1, "Company district is required."),
    companySubDistrict: z.string().min(1, "Company sub-district is required."),
    companyZipCode: z.string().min(1, "Company postal code is required."),
    companyPhone: z.string().min(1, "Company phone number is required."),
    companyFax: z.string().optional(),

    // Operator Information
    operatorIdCard: z.string().min(1, "Operator ID Card number is required."),
    operatorPrefix: z.string().min(1, "Operator prefix is required."),
    operatorFirstName: z.string().min(1, "Operator first name is required."),
    operatorLastName: z.string().min(1, "Operator last name is required."),
    operatorMobilePhone: z
      .string()
      .min(1, "Operator mobile phone is required."),
    operatorPhone: z.string().optional(),

    // Receipt Shipping Address
    receiptAddressBuildingFloorNumber: z
      .string()
      .min(1, "Receipt address is required."),
    receiptProvince: z.string().min(1, "Receipt province is required."),
    receiptDistrict: z.string().min(1, "Receipt district is required."),
    receiptSubDistrict: z.string().min(1, "Receipt sub-district is required."),
    receiptZipCode: z.string().min(1, "Receipt postal code is required."),
    receiptPhone: z.string().min(1, "Receipt phone number is required."),
    receiptFax: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

// For login
export const loginSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(1, "Password is required."),
});

// For changing password
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters long.")
      .regex(
        /[A-Z]/,
        "New password must contain at least one uppercase letter.",
      )
      .regex(
        /[a-z]/,
        "New password must contain at least one lowercase letter.",
      )
      .regex(/[0-9]/, "New password must contain at least one number.")
      .regex(
        /[^A-Za-z0-9]/,
        "New password must contain at least one special character.",
      ),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "New passwords don't match.",
    path: ["confirmNewPassword"],
  });
