import { Request, Response } from "express";
import {
  TestRequestService,
  CreateTestRequestData,
  UpdateTestRequestData,
  UpdateTestRequestSampleData,
} from "../services/TestRequestService";
import logger from "../utils/logger";
import { TestRequestDocumentStatus, LabInternalStatus } from "@prisma/client";

const testRequestService = new TestRequestService();

export class TestRequestController {
  async createTestRequest(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      // Get customer ID from user ID (assuming customer relationship)
      // In a real implementation, you'd fetch this from the user service
      const requestData: CreateTestRequestData = {
        ...req.body,
        customerId: userId, // This should be resolved to actual customer ID
      };

      if (
        !requestData.requesterName ||
        !requestData.samples ||
        requestData.samples.length === 0
      ) {
        res.status(400).json({
          message: "Requester name and at least one sample are required",
        });
        return;
      }

      const testRequest =
        await testRequestService.createTestRequest(requestData);

      res.status(201).json({
        message: "Test request created successfully",
        testRequest,
      });
    } catch (error) {
      logger.error(`Error creating test request: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getTestRequestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;
      const userRole = (req as any).user?.role;

      if (!id) {
        res.status(400).json({ message: "Test request ID is required" });
        return;
      }

      const testRequest = await testRequestService.getTestRequestById(id);

      if (!testRequest) {
        res.status(404).json({ message: "Test request not found" });
        return;
      }

      // Check access rights - customers can only view their own requests
      if (userRole === "CUSTOMER" && testRequest.customer?.userId !== userId) {
        res.status(403).json({ message: "Access denied" });
        return;
      }

      res.json(testRequest);
    } catch (error) {
      logger.error(`Error getting test request by ID: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getMyTestRequests(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      // This should resolve userId to customerId
      const result = await testRequestService.getTestRequestsByCustomer(
        userId,
        page,
        limit,
      );
      res.json(result);
    } catch (error) {
      logger.error(`Error getting customer test requests: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllTestRequests(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as LabInternalStatus;
      const documentStatus = req.query
        .documentStatus as TestRequestDocumentStatus;

      const result = await testRequestService.getAllTestRequests(
        page,
        limit,
        status,
        documentStatus,
      );
      res.json(result);
    } catch (error) {
      logger.error(`Error getting all test requests: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateTestRequest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTestRequestData = req.body;

      if (!id) {
        res.status(400).json({ message: "Test request ID is required" });
        return;
      }

      const testRequest = await testRequestService.updateTestRequest(
        id,
        updateData,
      );

      res.json({
        message: "Test request updated successfully",
        testRequest,
      });
    } catch (error) {
      logger.error(`Error updating test request: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateTestRequestSample(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateTestRequestSampleData = req.body;

      if (!id) {
        res.status(400).json({ message: "Sample ID is required" });
        return;
      }

      const sample = await testRequestService.updateTestRequestSample(
        id,
        updateData,
      );

      res.json({
        message: "Sample updated successfully",
        sample,
      });
    } catch (error) {
      logger.error(`Error updating test request sample: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async assignTechnicianToSample(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { technicianId } = req.body;

      if (!id) {
        res.status(400).json({ message: "Sample ID is required" });
        return;
      }

      if (!technicianId) {
        res.status(400).json({ message: "Technician ID is required" });
        return;
      }

      const labTest = await testRequestService.assignTechnicianToSample(
        id,
        technicianId,
      );

      res.json({
        message: "Technician assigned successfully",
        labTest,
      });
    } catch (error) {
      logger.error(`Error assigning technician to sample: ${error}`);

      if (error instanceof Error && error.message === "Sample not found") {
        res.status(404).json({ message: error.message });
        return;
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getTestRequestStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await testRequestService.getTestRequestStatistics();
      res.json(statistics);
    } catch (error) {
      logger.error(`Error getting test request statistics: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async searchTestRequests(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const testRequests = await testRequestService.searchTestRequests(q);
      res.json(testRequests);
    } catch (error) {
      logger.error(`Error searching test requests: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
