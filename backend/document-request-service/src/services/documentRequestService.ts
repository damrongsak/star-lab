import DocumentRequestModel from "../models/documentRequestModel";

export class DocumentRequestService {
  public static async createDocumentRequest(data: {
    request_no: string;
    request_date: Date;
    user_id: number;
    company_id: number;
    document_type: string;
    description: string | null;
  }): Promise<any> {
    try {
      return await DocumentRequestModel.createDocumentRequest(data);
    } catch (error) {
      throw new Error(`Error creating document request: ${error}`);
    }
  }

  public static async getDocumentRequestById(id: number): Promise<any> {
    try {
      return await DocumentRequestModel.findById(id);
    } catch (error) {
      throw new Error(
        `Error fetching document request with ID ${id}: ${error}`,
      );
    }
  }

  // Get document requests by company ID
  public static async getDocumentRequestsByCompanyId(
    company_id: number,
  ): Promise<any> {
    try {
      return await DocumentRequestModel.getDocumentRequestsByCompanyId(
        company_id,
      );
    } catch (error) {
      throw new Error(
        `Error fetching document requests for user ID ${company_id}: ${error}`,
      );
    }
  }

  public static async updateDocumentRequestStatus(
    id: number,
    data: any,
  ): Promise<any> {
    try {
      const status: string = data.status;
      return await DocumentRequestModel.updateDocumentRequestStatus(id, status);
    } catch (error) {
      throw new Error(
        `Error updating document request with ID ${id}: ${error}`,
      );
    }
  }

  // update document paid status
  public static async updateDocumentRequestPaidStatus(
    id: number,
    data: any,
  ): Promise<any> {
    try {
      const paid_status: boolean = data.paid_status;
      return await DocumentRequestModel.updateDocumentRequestPaidStatus(
        id,
        paid_status,
      );
    } catch (error) {
      throw new Error(
        `Error updating document request paid status with ID ${id}: ${error}`,
      );
    }
  }

  public static async deleteDocumentRequest(id: number): Promise<any> {
    try {
      return await DocumentRequestModel.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(
        `Error deleting document request with ID ${id}: ${error}`,
      );
    }
  }
}
