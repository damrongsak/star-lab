import logger from "../utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * DocumentRequestModel class to handle document request operations.
 */
class DocumentRequestModel {
  id: number;
  request_no: string;
  request_date: Date;
  user_id: number;
  company_id: number;
  document_type: string;
  description: string | null;
  status: string | null;
  paid_status: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;

  constructor(data: {
    id: number;
    request_no: string;
    request_date: Date;
    user_id: number;
    company_id: number;
    document_type: string;
    description: string | null;
    status: string | null;
    paid_status: boolean | null;
    created_at: Date | null;
    updated_at: Date | null;
  }) {
    this.id = data.id;
    this.request_no = data.request_no;
    this.request_date = data.request_date;
    this.user_id = data.user_id;
    this.company_id = data.company_id;
    this.document_type = data.document_type;
    this.description = data.description;
    this.status = data.status;
    this.paid_status = data.paid_status;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  private static mapToModel(data: any): DocumentRequestModel {
    return new DocumentRequestModel(data);
  }

  static async createDocumentRequest(data: {
    request_no: string;
    request_date: Date;
    user_id: number;
    company_id: number;
    document_type: string;
    description: string | null;
  }): Promise<DocumentRequestModel | null> {
    try {
      const result = await prisma.document_request.create({ data });
      return this.mapToModel(result);
    } catch (error) {
      logger.error("Error creating document request:", error);
      return null;
    }
  }

  static async updateField(
    id: number,
    fields: Partial<{
      status: string;
      paid_status: boolean;
      document_type: string;
      description: string | null;
    }>,
  ): Promise<DocumentRequestModel | null> {
    try {
      const updated_at = new Date();
      const result = await prisma.document_request.update({
        where: { id },
        data: { ...fields, updated_at },
      });
      return this.mapToModel(result);
    } catch (error) {
      logger.error("Error updating document request:", error);
      return null;
    }
  }

  static async getAllByField(
    field: keyof DocumentRequestModel,
    value: number,
  ): Promise<DocumentRequestModel[] | null> {
    try {
      const result = await prisma.document_request.findMany({
        where: { [field]: value },
      });
      return result.map(this.mapToModel);
    } catch (error) {
      logger.error(`Error getting document requests by ${field}:`, error);
      return null;
    }
  }

  static async findById(id: number): Promise<DocumentRequestModel | null> {
    try {
      const result = await prisma.document_request.findUnique({
        where: { id },
      });
      return result ? this.mapToModel(result) : null;
    } catch (error) {
      logger.error("Error finding document request by ID:", error);
      return null;
    }
  }

  static async findByIdAndDelete(
    id: number,
  ): Promise<DocumentRequestModel | null> {
    try {
      const result = await prisma.document_request.delete({ where: { id } });
      return this.mapToModel(result);
    } catch (error) {
      logger.error("Error finding and deleting document request by ID:", error);
      return null;
    }
  }

  // Get document requests by company ID
  static async getDocumentRequestsByCompanyId(
    company_id: number,
  ): Promise<DocumentRequestModel[] | null> {
    try {
      const result = await prisma.document_request.findMany({
        where: { company_id },
      });
      return result.map(this.mapToModel);
    } catch (error) {
      logger.error("Error getting document requests by company ID:", error);
      return null;
    }
  }

  // Update document request status
  static async updateDocumentRequestStatus(
    id: number,
    status: string,
  ): Promise<DocumentRequestModel | null> {
    try {
      const updated_at = new Date();
      const result = await prisma.document_request.update({
        where: { id },
        data: { status, updated_at },
      });
      return this.mapToModel(result);
    } catch (error) {
      logger.error("Error updating document request status:", error);
      return null;
    }
  }

  // Update document request paid status
  static async updateDocumentRequestPaidStatus(
    id: number,
    paid_status: boolean,
  ): Promise<DocumentRequestModel | null> {
    try {
      const updated_at = new Date();
      const result = await prisma.document_request.update({
        where: { id },
        data: { paid_status, updated_at },
      });
      return this.mapToModel(result);
    } catch (error) {
      logger.error("Error updating document request paid status:", error);
      return null;
    }
  }
}

export default DocumentRequestModel;
