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
  /**
   * @swagger
   * /api/v1/test-requests:
   *   post:
   *     tags:
   *       - Test Requests
   *     summary: Create a new test request
   *     description: Create a new test request with samples (Customer only)
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - requesterName
   *               - samples
   *             properties:
   *               requesterName:
   *                 type: string
   *                 example: "Dr. John Smith"
   *                 description: Name of the person requesting the test
   *               objective:
   *                 type: string
   *                 example: "Quality control testing for batch ABC123"
   *                 description: Purpose or objective of the test request
   *               projectId:
   *                 type: string
   *                 format: uuid
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *                 description: Associated project ID (optional)
   *               notes:
   *                 type: string
   *                 example: "Handle with care - temperature sensitive samples"
   *                 description: Additional notes or instructions
   *               samples:
   *                 type: array
   *                 minItems: 1
   *                 items:
   *                   type: object
   *                   required:
   *                     - customerSampleId
   *                     - requestedQty
   *                   properties:
   *                     customerSampleId:
   *                       type: string
   *                       example: "SAMPLE-001"
   *                       description: Customer's unique sample identifier
   *                     sentSampleDate:
   *                       type: string
   *                       format: date
   *                       example: "2025-06-27"
   *                       description: Date when sample was sent
   *                     animalType:
   *                       type: string
   *                       example: "Bovine"
   *                       description: Type of animal (if applicable)
   *                     sampleSpecimen:
   *                       type: string
   *                       example: "Blood serum"
   *                       description: Type of specimen
   *                     panel:
   *                       type: string
   *                       example: "Complete Blood Count"
   *                       description: Test panel to be performed
   *                     method:
   *                       type: string
   *                       example: "Automated Hematology Analyzer"
   *                       description: Testing method
   *                     requestedQty:
   *                       type: number
   *                       example: 5
   *                       description: Requested quantity
   *                     unit:
   *                       type: string
   *                       example: "mL"
   *                       description: Unit of measurement
   *                     notes:
   *                       type: string
   *                       example: "Store at -20°C"
   *                       description: Sample-specific notes
   *     responses:
   *       201:
   *         description: Test request created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Test request created successfully"
   *                 testRequest:
   *                   $ref: '#/components/schemas/TestRequest'
   *       400:
   *         description: Bad request - missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized - invalid or missing token
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

  /**
   * @swagger
   * /api/v1/test-requests/{id}:
   *   get:
   *     tags:
   *       - Test Requests
   *     summary: Get test request by ID
   *     description: Retrieve a specific test request by its ID. Customers can only view their own requests.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Test request ID
   *         example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Test request details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/TestRequest'
   *                 - type: object
   *                   properties:
   *                     testRequestSamples:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                             format: uuid
   *                           customerSampleId:
   *                             type: string
   *                           currentStatus:
   *                             type: string
   *                             enum: ["PENDING", "RECEIVED", "IN_TESTING", "COMPLETED", "REJECTED"]
   *                           receivedQty:
   *                             type: number
   *                           labTests:
   *                             type: array
   *                             items:
   *                               $ref: '#/components/schemas/LabTest'
   *                     customer:
   *                       $ref: '#/components/schemas/Customer'
   *                     invoices:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Invoice'
   *       400:
   *         description: Bad request - invalid ID format
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
   *         description: Access denied - cannot view this test request
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Test request not found
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

  /**
   * @swagger
   * /api/v1/test-requests/my-requests:
   *   get:
   *     tags:
   *       - Test Requests
   *     summary: Get customer's own test requests
   *     description: Retrieve paginated list of test requests for the authenticated customer
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
   *     responses:
   *       200:
   *         description: Customer test requests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 testRequests:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TestRequest'
   *                 total:
   *                   type: integer
   *                   example: 25
   *                   description: Total number of test requests
   *                 totalPages:
   *                   type: integer
   *                   example: 3
   *                   description: Total number of pages
   *                 currentPage:
   *                   type: integer
   *                   example: 1
   *                   description: Current page number
   *       401:
   *         description: Unauthorized
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       403:
   *         description: Forbidden - customer role required
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

  /**
   * @swagger
   * /api/v1/test-requests:
   *   get:
   *     tags:
   *       - Test Requests
   *     summary: Get all test requests (Admin/Lab Admin only)
   *     description: Retrieve paginated list of all test requests with optional filtering
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
   *           enum: [
   *             "WAITING_APPROVAL_LAB",
   *             "RECEIVED_SAMPLES",
   *             "ASSIGNED_TECHNICIAN",
   *             "IN_PROGRESS",
   *             "RESULTS_UPLOADED",
   *             "REVIEWED_BY_DOCTOR",
   *             "READY_FOR_APPROVAL",
   *             "COMPLETED",
   *             "RE_SCHEDULED",
   *             "HOLD"
   *           ]
   *         description: Filter by lab internal status
   *         example: "IN_PROGRESS"
   *       - in: query
   *         name: documentStatus
   *         schema:
   *           type: string
   *           enum: ["DRAFT", "SUBMITTED", "PENDING_PAYMENT", "APPROVED", "REJECTED", "CANCELLED"]
   *         description: Filter by document status
   *         example: "APPROVED"
   *     responses:
   *       200:
   *         description: Test requests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 testRequests:
   *                   type: array
   *                   items:
   *                     allOf:
   *                       - $ref: '#/components/schemas/TestRequest'
   *                       - type: object
   *                         properties:
   *                           customer:
   *                             type: object
   *                             properties:
   *                               companyNameEn:
   *                                 type: string
   *                               companyNameTh:
   *                                 type: string
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

  /**
   * @swagger
   * /api/v1/test-requests/{id}:
   *   put:
   *     tags:
   *       - Test Requests
   *     summary: Update test request (Admin/Lab Admin only)
   *     description: Update test request details including status
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Test request ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               requesterName:
   *                 type: string
   *                 example: "Dr. Jane Smith"
   *               objective:
   *                 type: string
   *                 example: "Updated testing objective"
   *               projectId:
   *                 type: string
   *                 format: uuid
   *               notes:
   *                 type: string
   *                 example: "Additional notes"
   *               documentStatus:
   *                 type: string
   *                 enum: ["DRAFT", "SUBMITTED", "PENDING_PAYMENT", "APPROVED", "REJECTED", "CANCELLED"]
   *               labInternalStatus:
   *                 type: string
   *                 enum: ["WAITING_APPROVAL_LAB", "RECEIVED_SAMPLES", "ASSIGNED_TECHNICIAN", "IN_PROGRESS", "RESULTS_UPLOADED", "REVIEWED_BY_DOCTOR", "READY_FOR_APPROVAL", "COMPLETED", "RE_SCHEDULED", "HOLD"]
   *     responses:
   *       200:
   *         description: Test request updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Test request updated successfully"
   *                 testRequest:
   *                   $ref: '#/components/schemas/TestRequest'
   *       400:
   *         description: Bad request
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

  /**
   * @swagger
   * /api/v1/test-requests/samples/{id}:
   *   put:
   *     tags:
   *       - Test Request Samples
   *     summary: Update test request sample
   *     description: Update sample details such as received quantity and status
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sample ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               receivedQty:
   *                 type: number
   *                 example: 5
   *                 description: Quantity received in the lab
   *               currentStatus:
   *                 type: string
   *                 enum: ["PENDING", "RECEIVED", "IN_TESTING", "COMPLETED", "REJECTED"]
   *                 example: "RECEIVED"
   *               storageLocationId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of storage location
   *               notes:
   *                 type: string
   *                 example: "Sample stored in freezer A1"
   *     responses:
   *       200:
   *         description: Sample updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Sample updated successfully"
   *                 sample:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     customerSampleId:
   *                       type: string
   *                     receivedQty:
   *                       type: number
   *                     currentStatus:
   *                       type: string
   *                     testRequest:
   *                       type: object
   *                       properties:
   *                         requestNo:
   *                           type: string
   *       400:
   *         description: Bad request - invalid sample ID
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

  /**
   * @swagger
   * /api/v1/test-requests/samples/{id}/assign-technician:
   *   post:
   *     tags:
   *       - Test Request Samples
   *     summary: Assign technician to sample
   *     description: Assign a lab technician to a specific sample for testing
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Sample ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - technicianId
   *             properties:
   *               technicianId:
   *                 type: string
   *                 format: uuid
   *                 description: ID of the technician to assign
   *                 example: "123e4567-e89b-12d3-a456-426614174000"
   *     responses:
   *       200:
   *         description: Technician assigned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: "Technician assigned successfully"
   *                 labTest:
   *                   $ref: '#/components/schemas/LabTest'
   *       400:
   *         description: Bad request - missing sample ID or technician ID
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
   *       404:
   *         description: Sample not found
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

  /**
   * @swagger
   * /api/v1/test-requests/statistics:
   *   get:
   *     tags:
   *       - Test Requests
   *     summary: Get test request statistics
   *     description: Retrieve dashboard statistics for test requests and samples
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Statistics retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalRequests:
   *                   type: integer
   *                   example: 150
   *                   description: Total number of test requests
   *                 pendingApproval:
   *                   type: integer
   *                   example: 12
   *                   description: Requests waiting for lab approval
   *                 inProgress:
   *                   type: integer
   *                   example: 25
   *                   description: Requests currently in progress
   *                 completed:
   *                   type: integer
   *                   example: 98
   *                   description: Completed requests
   *                 samplesReceived:
   *                   type: integer
   *                   example: 45
   *                   description: Number of samples received
   *                 samplesInTesting:
   *                   type: integer
   *                   example: 18
   *                   description: Number of samples currently being tested
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
  async getTestRequestStatistics(req: Request, res: Response): Promise<void> {
    try {
      const statistics = await testRequestService.getTestRequestStatistics();
      res.json(statistics);
    } catch (error) {
      logger.error(`Error getting test request statistics: ${error}`);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  /**
   * @swagger
   * /api/v1/test-requests/search:
   *   get:
   *     tags:
   *       - Test Requests
   *     summary: Search test requests
   *     description: Search test requests by various criteria including request number, requester name, customer name, and sample ID
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search query string
   *         example: "REQ-2025"
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/TestRequest'
   *                   - type: object
   *                     properties:
   *                       testRequestSamples:
   *                         type: array
   *                         items:
   *                           type: object
   *                           properties:
   *                             id:
   *                               type: string
   *                               format: uuid
   *                             customerSampleId:
   *                               type: string
   *                       customer:
   *                         type: object
   *                         properties:
   *                           companyNameEn:
   *                             type: string
   *                           companyNameTh:
   *                             type: string
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
