import { User, Customer } from "@prisma/client";
import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userId: string;
    email: string;
    role: string;
  };
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: string;
}

export interface CustomerWithUser extends Customer {
  user: Omit<User, "passwordHash">;
}

export interface ApiResponse<T = any> {
  message: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
