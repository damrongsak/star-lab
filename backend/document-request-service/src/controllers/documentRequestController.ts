import { Request, Response } from "express";
import { DocumentRequestService } from "../services/documentRequestService";
import DocumentRequestModdel from "../models/documentRequestModel";
import logger from "../utils/logger";

export class DocumentRequestController {
  async createDocumentRequest(req: Request, res: Response): Promise<void> {
    try {
      const documentRequestData: DocumentRequestModdel = req.body;
      const newDocumentRequest =
        await DocumentRequestService.createDocumentRequest(documentRequestData);
      res.status(201).json(newDocumentRequest);
    } catch (error) {
      logger.error("Error creating document request:", error);
      res.status(500).json({ error: "Failed to create document request" });
    }
  }

  async getDocumentRequests(req: Request, res: Response): Promise<void> {
    try {
      const companyId: number = parseInt(req.params.companyId, 10);
      const documentRequests =
        await DocumentRequestService.getDocumentRequestsByCompanyId(companyId);
      res.status(200).json(documentRequests);
    } catch (error) {
      logger.error("Error getting document requests:", error);
      res.status(500).json({ error: "Failed to get document requests" });
    }
  }

  async getDocumentRequestById(req: Request, res: Response): Promise<void> {
    try {
      const documentRequestId: number = parseInt(req.params.id, 10);
      logger.info(`Document request ID: ${documentRequestId}`);
      const documentRequest =
        await DocumentRequestService.getDocumentRequestById(documentRequestId);
      if (documentRequest) {
        res.status(200).json(documentRequest);
      } else {
        res.status(404).json({ error: "Document request not found" });
      }
    } catch (error) {
      logger.error("Error getting document request:", error);
      res.status(500).json({ error: "Failed to get document request" });
    }
  }

  async updateDocumentRequest(req: Request, res: Response): Promise<void> {
    try {
      const documentRequestId: number = parseInt(req.params.id, 10);
      const updatedData = req.body;
      const updatedDocumentRequest =
        await DocumentRequestService.updateDocumentRequestStatus(
          documentRequestId,
          updatedData,
        );
      if (updatedDocumentRequest) {
        res.status(200).json(updatedDocumentRequest);
      } else {
        res.status(404).json({ error: "Document request not found" });
      }
    } catch (error) {
      logger.error("Error updating document request:", error);
      res.status(500).json({ error: "Failed to update document request" });
    }
  }
  async deleteDocumentRequest(req: Request, res: Response): Promise<void> {
    try {
      const documentRequestId: number = parseInt(req.params.id, 10);
      const deletedDocumentRequest =
        await DocumentRequestService.deleteDocumentRequest(documentRequestId);
      if (deletedDocumentRequest) {
        res.status(200).json(deletedDocumentRequest);
      } else {
        res.status(404).json({ error: "Document request not found" });
      }
    } catch (error) {
      logger.error("Error deleting document request:", error);
      res.status(500).json({ error: "Failed to delete document request" });
    }
  }
  // Find by comapy id
  async getDocumentRequestsByCompanyId(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const companyId: number = parseInt(req.params.id, 10);
      const documentRequests =
        await DocumentRequestService.getDocumentRequestsByCompanyId(companyId);
      res.status(200).json(documentRequests);
    } catch (error) {
      logger.error("Error getting document requests by company ID:", error);
      res.status(500).json({ error: "Failed to get document requests" });
    }
  }
}
