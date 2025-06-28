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
  /**
   * @swagger
   * /api/v1/lab/tests:
   *   post:
   *     tags:
   *       - Lab Management
   *     summary: Create a new lab test
   *     description: Create a new lab test for a test request sample (Admin/Lab Admin only)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - testRequestSampleId
   *               - assignedLabTechnicianId
   *             properties:
   *               testRequestSampleId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the test request sample
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               assignedLabTechnicianId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the assigned lab technician
   *                 example: "456e7890-e89b-12d3-a456-426614174000"
   *               testPanel:
   *                 type: string
   *                 example: "Complete Blood Count"
   *                 description: Test panel name
   *               testMethod:
   *                 type: string
   *                 example: "Automated Hematology Analyzer"
   *                 description: Testing method
   *               notes:
   *                 type: string
   *                 example: "Priority test - rush processing required"
   *                 description: Additional notes for the test
   *     responses:
   *       201:
   *         description: Lab test created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lab test created successfully"
   *                 labTest:
   *                   $ref: '#/components/schemas/LabTest'
   *       400:
   *         description: Bad request - missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/tests/{id}:
   *   get:
   *     tags:
   *       - Lab Management
   *     summary: Get lab test by ID
   *     description: Retrieve detailed information about a specific lab test
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Lab test ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Lab test details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/LabTest'
   *                 - type: object
   *                   properties:
   *                     testRequestSample:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         customerSampleId:
   *                           type: string
   *                         testRequest:
   *                           type: object
   *                           properties:
   *                             requestNo:
   *                               type: string
   *                             customer:
   *                               type: object
   *                               properties:
   *                                 companyNameEn:
   *                                   type: string
   *                     assignedLabTechnician:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: string
   *                           format: uuid
   *                         email:
   *                           type: string
   *                           format: email
   *                     labResults:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/LabResult'
   *       400:
   *         description: Bad request - invalid lab test ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Lab test not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/my-tests:
   *   get:
   *     tags:
   *       - Lab Management
   *     summary: Get technician's assigned lab tests
   *     description: Retrieve paginated list of lab tests assigned to the authenticated technician
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *         example: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: ["PENDING", "PARTIAL", "COMPLETED", "REVIEWED", "APPROVED", "REJECTED"]
   *         description: Filter by lab result status
   *         example: "PENDING"
   *     responses:
   *       200:
   *         description: Technician's lab tests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 labTests:
   *                   type: array
   *                   items:
   *                     allOf:
   *                       - $ref: '#/components/schemas/LabTest'
   *                       - type: object
   *                         properties:
   *                           testRequestSample:
   *                             type: object
   *                             properties:
   *                               customerSampleId:
   *                                 type: string
   *                               testRequest:
   *                                 type: object
   *                                 properties:
   *                                   requestNo:
   *                                     type: string
   *                                   customer:
   *                                     type: object
   *                                     properties:
   *                                       companyNameEn:
   *                                         type: string
   *                 total:
   *                   type: integer
   *                   example: 25
   *                 totalPages:
   *                   type: integer
   *                   example: 3
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - technician role required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/tests:
   *   get:
   *     tags:
   *       - Lab Management
   *     summary: Get all lab tests (Admin/Lab Admin only)
   *     description: Retrieve paginated list of all lab tests with optional filtering
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Number of items per page
   *         example: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: ["PENDING", "PARTIAL", "COMPLETED", "REVIEWED", "APPROVED", "REJECTED"]
   *         description: Filter by lab result status
   *         example: "PENDING"
   *     responses:
   *       200:
   *         description: Lab tests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 labTests:
   *                   type: array
   *                   items:
   *                     allOf:
   *                       - $ref: '#/components/schemas/LabTest'
   *                       - type: object
   *                         properties:
   *                           testRequestSample:
   *                             type: object
   *                             properties:
   *                               customerSampleId:
   *                                 type: string
   *                               testRequest:
   *                                 type: object
   *                                 properties:
   *                                   requestNo:
   *                                     type: string
   *                                   customer:
   *                                     type: object
   *                                     properties:
   *                                       companyNameEn:
   *                                         type: string
   *                           assignedLabTechnician:
   *                             type: object
   *                             properties:
   *                               email:
   *                                 type: string
   *                                 format: email
   *                 total:
   *                   type: integer
   *                   example: 150
   *                 totalPages:
   *                   type: integer
   *                   example: 15
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/tests/{id}:
   *   put:
   *     tags:
   *       - Lab Management
   *     summary: Update lab test
   *     description: Update lab test details and status
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Lab test ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               assignedLabTechnicianId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the assigned technician
   *                 example: "456e7890-e89b-12d3-a456-426614174000"
   *               testPanel:
   *                 type: string
   *                 example: "Complete Blood Count"
   *                 description: Test panel name
   *               testMethod:
   *                 type: string
   *                 example: "Automated Hematology Analyzer"
   *                 description: Testing method
   *               labResultStatus:
   *                 type: string
   *                 enum: ["PENDING", "PARTIAL", "COMPLETED", "REVIEWED", "APPROVED", "REJECTED"]
   *                 example: "IN_PROGRESS"
   *                 description: Current status of lab results
   *               notes:
   *                 type: string
   *                 example: "Updated test parameters"
   *                 description: Additional notes
   *     responses:
   *       200:
   *         description: Lab test updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lab test updated successfully"
   *                 labTest:
   *                   $ref: '#/components/schemas/LabTest'
   *       400:
   *         description: Bad request - invalid lab test ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/tests/{id}/complete:
   *   post:
   *     tags:
   *       - Lab Management
   *     summary: Complete lab test
   *     description: Mark a lab test as completed and update its status
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Lab test ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Lab test completed successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lab test completed successfully"
   *                 labTest:
   *                   $ref: '#/components/schemas/LabTest'
   *       400:
   *         description: Bad request - cannot complete test without results
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Cannot complete lab test without any results"
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Lab test not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
  /**
   * @swagger
   * /api/v1/lab/results:
   *   post:
   *     tags:
   *       - Lab Results
   *     summary: Create lab result
   *     description: Create a new lab result for a lab test
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - labTestId
   *               - parameter
   *               - value
   *             properties:
   *               labTestId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the lab test
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *               parameter:
   *                 type: string
   *                 example: "Hemoglobin"
   *                 description: Test parameter name
   *               value:
   *                 type: string
   *                 example: "14.2"
   *                 description: Test result value
   *               unit:
   *                 type: string
   *                 example: "g/dL"
   *                 description: Unit of measurement
   *               referenceRange:
   *                 type: string
   *                 example: "12.0-16.0"
   *                 description: Normal reference range
   *               isAbnormal:
   *                 type: boolean
   *                 example: false
   *                 description: Whether the result is abnormal
   *               notes:
   *                 type: string
   *                 example: "Result within normal limits"
   *                 description: Additional notes about the result
   *     responses:
   *       201:
   *         description: Lab result created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lab result created successfully"
   *                 labResult:
   *                   $ref: '#/components/schemas/LabResult'
   *       400:
   *         description: Bad request - missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/results/{id}:
   *   put:
   *     tags:
   *       - Lab Results
   *     summary: Update lab result
   *     description: Update an existing lab result
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Lab result ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               parameter:
   *                 type: string
   *                 example: "Hemoglobin"
   *                 description: Test parameter name
   *               value:
   *                 type: string
   *                 example: "14.5"
   *                 description: Updated test result value
   *               unit:
   *                 type: string
   *                 example: "g/dL"
   *                 description: Unit of measurement
   *               referenceRange:
   *                 type: string
   *                 example: "12.0-16.0"
   *                 description: Normal reference range
   *               isAbnormal:
   *                 type: boolean
   *                 example: false
   *                 description: Whether the result is abnormal
   *               notes:
   *                 type: string
   *                 example: "Corrected value after re-analysis"
   *                 description: Additional notes about the result
   *     responses:
   *       200:
   *         description: Lab result updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lab result updated successfully"
   *                 labResult:
   *                   $ref: '#/components/schemas/LabResult'
   *       400:
   *         description: Bad request - invalid lab result ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/results/{id}:
   *   delete:
   *     tags:
   *       - Lab Results
   *     summary: Delete lab result
   *     description: Delete a lab result (Admin/Lab Admin only)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Lab result ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Lab result deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Lab result deleted successfully"
   *       400:
   *         description: Bad request - invalid lab result ID
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
  /**
   * @swagger
   * /api/v1/lab/statistics:
   *   get:
   *     tags:
   *       - Lab Management
   *     summary: Get lab statistics
   *     description: Retrieve laboratory statistics and metrics (Admin/Lab Admin only)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lab statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalLabTests:
   *                   type: integer
   *                   example: 250
   *                   description: Total number of lab tests
   *                 pendingTests:
   *                   type: integer
   *                   example: 35
   *                   description: Number of pending lab tests
   *                 inProgressTests:
   *                   type: integer
   *                   example: 45
   *                   description: Number of tests in progress
   *                 completedTests:
   *                   type: integer
   *                   example: 170
   *                   description: Number of completed tests
   *                 totalResults:
   *                   type: integer
   *                   example: 850
   *                   description: Total number of lab results
   *                 abnormalResults:
   *                   type: integer
   *                   example: 125
   *                   description: Number of abnormal results
   *                 averageCompletionTime:
   *                   type: number
   *                   format: decimal
   *                   example: 24.5
   *                   description: Average completion time in hours
   *                 activeTechnicians:
   *                   type: integer
   *                   example: 12
   *                   description: Number of active technicians
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getLabStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await labService.getLabStatistics();
      res.json(statistics);
    } catch (error) {
      logger.error(`Error getting lab statistics: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /api/v1/lab/search:
   *   get:
   *     tags:
   *       - Lab Management
   *     summary: Search lab tests
   *     description: Search lab tests by various criteria including case number, customer name, or sample ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query string
   *         example: "CASE-2025"
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/LabTest'
   *                   - type: object
   *                     properties:
   *                       testRequestSample:
   *                         type: object
   *                         properties:
   *                           customerSampleId:
   *                             type: string
   *                           testRequest:
   *                             type: object
   *                             properties:
   *                               requestNo:
   *                                 type: string
   *                               customer:
   *                                 type: object
   *                                 properties:
   *                                   companyNameEn:
   *                                     type: string
   *                       assignedLabTechnician:
   *                         type: object
   *                         properties:
   *                           email:
   *                             type: string
   *                             format: email
   *       400:
   *         description: Bad request - search query is required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - insufficient permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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

  /**
   * @swagger
   * /api/v1/lab/technicians:
   *   get:
   *     tags:
   *       - Lab Management
   *     summary: Get available technicians
   *     description: Retrieve list of available lab technicians for assignment (Admin/Lab Admin only)
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Available technicians retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: string
   *                     format: uuid
   *                     example: "123e4567-e89b-12d3-a456-426614174000"
   *                   email:
   *                     type: string
   *                     format: email
   *                     example: "technician@starlab.com"
   *                   role:
   *                     type: string
   *                     enum: ["TECHNICIAN"]
   *                     example: "TECHNICIAN"
   *                   isEmailConfirmed:
   *                     type: boolean
   *                     example: true
   *                   createdAt:
   *                     type: string
   *                     format: date-time
   *                   workload:
   *                     type: object
   *                     properties:
   *                       activeTests:
   *                         type: integer
   *                         example: 5
   *                         description: Number of active tests assigned
   *                       pendingTests:
   *                         type: integer
   *                         example: 3
   *                         description: Number of pending tests
   *                       completedToday:
   *                         type: integer
   *                         example: 8
   *                         description: Number of tests completed today
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - admin privileges required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
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
