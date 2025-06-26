import { Request, Response } from "express";
import {
  LabService,
  CreateLabTestData,
  UpdateLabTestData,
  CreateLabResultData,
  UpdateLabResultData,
} from "../services/LabService";
import logger from "../utils/logger";
import { LabResultStatus } from "@prisma/client";

const labService = new LabService();

export class LabController {
  // Lab Test Management
  async createLabTest(req: Request, res: Response): Promise<void> {
    try {
      const testData: CreateLabTestData = req.body;

      if (!testData.testRequestSampleId || !testData.assignedLabTechnicianId) {
        res.status(400).json({
          message: "Sample ID and technician ID are required",
        });
        return;
      }

      const labTest = await labService.createLabTest(testData);

      res.status(201).json({
        message: "Lab test created successfully",
        labTest,
      });
    } catch (error) {
      logger.error(`Error creating lab test: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getLabTestById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Lab test ID is required" });
        return;
      }

      const labTest = await labService.getLabTestById(id);

      if (!labTest) {
        res.status(404).json({ message: "Lab test not found" });
        return;
      }

      res.json(labTest);
    } catch (error) {
      logger.error(`Error getting lab test by ID: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getMyLabTests(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as LabResultStatus;

      const result = await labService.getLabTestsByTechnician(
        userId,
        page,
        limit,
        status,
      );
      res.json(result);
    } catch (error) {
      logger.error(`Error getting technician lab tests: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllLabTests(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as LabResultStatus;

      const result = await labService.getAllLabTests(page, limit, status);
      res.json(result);
    } catch (error) {
      logger.error(`Error getting all lab tests: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateLabTest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateLabTestData = req.body;

      if (!id) {
        res.status(400).json({ message: "Lab test ID is required" });
        return;
      }

      const labTest = await labService.updateLabTest(id, updateData);

      res.json({
        message: "Lab test updated successfully",
        labTest,
      });
    } catch (error) {
      logger.error(`Error updating lab test: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async completeLabTest(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.userId;

      if (!id) {
        res.status(400).json({ message: "Lab test ID is required" });
        return;
      }

      if (!userId) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }

      const labTest = await labService.completeLabTest(id, userId);

      res.json({
        message: "Lab test completed successfully",
        labTest,
      });
    } catch (error) {
      logger.error(`Error completing lab test: ${error}`);

      if (error instanceof Error) {
        if (error.message.includes("not found")) {
          res.status(404).json({ message: error.message });
          return;
        }
        if (error.message.includes("without any results")) {
          res.status(400).json({ message: error.message });
          return;
        }
      }

      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Lab Result Management
  async createLabResult(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const resultData: CreateLabResultData = {
        ...req.body,
        recordedById: userId,
      };

      if (!resultData.labTestId || !resultData.parameter || !resultData.value) {
        res.status(400).json({
          message: "Lab test ID, parameter, and value are required",
        });
        return;
      }

      const labResult = await labService.createLabResult(resultData);

      res.status(201).json({
        message: "Lab result created successfully",
        labResult,
      });
    } catch (error) {
      logger.error(`Error creating lab result: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateLabResult(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData: UpdateLabResultData = req.body;

      if (!id) {
        res.status(400).json({ message: "Lab result ID is required" });
        return;
      }

      const labResult = await labService.updateLabResult(id, updateData);

      res.json({
        message: "Lab result updated successfully",
        labResult,
      });
    } catch (error) {
      logger.error(`Error updating lab result: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async deleteLabResult(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({ message: "Lab result ID is required" });
        return;
      }

      const success = await labService.deleteLabResult(id);

      if (success) {
        res.json({ message: "Lab result deleted successfully" });
      }
    } catch (error) {
      logger.error(`Error deleting lab result: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  // Statistics and Search
  async getLabStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await labService.getLabStatistics();
      res.json(statistics);
    } catch (error) {
      logger.error(`Error getting lab statistics: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async searchLabTests(req: Request, res: Response): Promise<void> {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({ message: "Search query is required" });
        return;
      }

      const labTests = await labService.searchLabTests(q);
      res.json(labTests);
    } catch (error) {
      logger.error(`Error searching lab tests: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAvailableTechnicians(req: Request, res: Response): Promise<void> {
    try {
      const technicians = await labService.getAvailableTechnicians();
      res.json(technicians);
    } catch (error) {
      logger.error(`Error getting available technicians: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
