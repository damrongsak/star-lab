import { Response } from "express";
import { DoctorService } from "../services/DoctorService";
import { AuthenticatedRequest } from "../types";
import logger from "../utils/logger";

export class DoctorController {
  private doctorService: DoctorService;

  constructor() {
    this.doctorService = new DoctorService();
  }

  /**
   * @swagger
   * /api/v1/doctors:
   *   post:
   *     summary: Create a new doctor
   *     description: Create a new doctor account with user credentials and medical information. Only accessible by admin and lab admin users.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateDoctorRequest'
   *           examples:
   *             pathologist:
   *               summary: Pathologist Example
   *               value:
   *                 email: "dr.smith@hospital.com"
   *                 password: "SecurePass123!"
   *                 firstName: "John"
   *                 lastName: "Smith"
   *                 licenseNumber: "MD789012345"
   *                 specialization: "Pathology"
   *                 qualifications: "MD, PhD in Pathology, Board Certified"
   *                 experience: 8
   *             radiologist:
   *               summary: Radiologist Example
   *               value:
   *                 email: "dr.johnson@clinic.com"
   *                 password: "RadDoc456!"
   *                 firstName: "Sarah"
   *                 lastName: "Johnson"
   *                 licenseNumber: "MD345678901"
   *                 specialization: "Radiology"
   *                 qualifications: "MD, Radiology Residency"
   *                 experience: 12
   *     responses:
   *       201:
   *         description: Doctor created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Doctor created successfully"
   *                 data:
   *                   type: object
   *                   properties:
   *                     id:
   *                       type: string
   *                       format: uuid
   *                     email:
   *                       type: string
   *                       format: email
   *                     role:
   *                       type: string
   *                       enum: [DOCTOR]
   *       400:
   *         $ref: '#/components/responses/BadRequest'
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       409:
   *         description: Doctor with this email or license number already exists
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  createDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const doctorData = req.body;
      const doctor = await this.doctorService.createDoctor(doctorData);

      logger.info("Doctor created successfully", {
        doctorId: doctor.id,
        email: doctor.email,
      });

      res.status(201).json({
        success: true,
        message: "Doctor created successfully",
        data: {
          id: doctor.id,
          email: doctor.email,
          role: doctor.role,
        },
      });
    } catch (error) {
      logger.error("Error creating doctor", { error });
      res.status(500).json({
        success: false,
        message: "Failed to create doctor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/{doctorId}:
   *   get:
   *     summary: Get doctor by ID
   *     description: Retrieve detailed information about a specific doctor by their ID. Only accessible by admin and lab admin users.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Doctor's unique identifier
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Doctor information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Doctor'
   *             examples:
   *               pathologist:
   *                 summary: Pathologist Example
   *                 value:
   *                   success: true
   *                   data:
   *                     id: "550e8400-e29b-41d4-a716-446655440000"
   *                     userId: "123e4567-e89b-12d3-a456-426614174000"
   *                     licenseNumber: "MD789012345"
   *                     specialization: "Pathology"
   *                     qualifications: "MD, PhD in Pathology"
   *                     experience: 8
   *                     isActive: true
   *                     user:
   *                       id: "123e4567-e89b-12d3-a456-426614174000"
   *                       email: "dr.smith@hospital.com"
   *                       firstName: "John"
   *                       lastName: "Smith"
   *                       role: "DOCTOR"
   *                     createdAt: "2024-01-15T10:30:00Z"
   *                     updatedAt: "2024-06-27T14:20:00Z"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const doctor = await this.doctorService.getDoctorById(doctorId);

      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
        return;
      }

      res.json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      logger.error("Error fetching doctor", {
        error,
        doctorId: req.params.doctorId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/profile:
   *   get:
   *     summary: Get current doctor's profile
   *     description: Retrieve the authenticated doctor's own profile information. Only accessible by doctors.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Doctor profile retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Doctor'
   *             examples:
   *               doctor_profile:
   *                 summary: Doctor Profile Example
   *                 value:
   *                   success: true
   *                   data:
   *                     id: "550e8400-e29b-41d4-a716-446655440000"
   *                     userId: "123e4567-e89b-12d3-a456-426614174000"
   *                     licenseNumber: "MD789012345"
   *                     specialization: "Pathology"
   *                     qualifications: "MD, PhD in Pathology, Board Certified"
   *                     experience: 8
   *                     isActive: true
   *                     user:
   *                       id: "123e4567-e89b-12d3-a456-426614174000"
   *                       email: "dr.smith@hospital.com"
   *                       firstName: "John"
   *                       lastName: "Smith"
   *                       role: "DOCTOR"
   *                     createdAt: "2024-01-15T10:30:00Z"
   *                     updatedAt: "2024-06-27T14:20:00Z"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor profile not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor profile not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getProfile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const doctor = await this.doctorService.getDoctorById(userId);

      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
        return;
      }

      res.json({
        success: true,
        data: doctor,
      });
    } catch (error) {
      logger.error("Error fetching doctor profile", {
        error,
        userId: req.user!.id,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctor profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors:
   *   get:
   *     summary: Get all doctors with pagination
   *     description: Retrieve a paginated list of all doctors in the system. Accessible by admin, lab admin, and technician users.
   *     tags: [Doctors]
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
   *         description: Number of doctors per page
   *         example: 10
   *     responses:
   *       200:
   *         description: Doctors list retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Doctor'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 10
   *                     total:
   *                       type: integer
   *                       example: 25
   *                     totalPages:
   *                       type: integer
   *                       example: 3
   *             examples:
   *               doctors_list:
   *                 summary: Doctors List Example
   *                 value:
   *                   success: true
   *                   data:
   *                     - id: "550e8400-e29b-41d4-a716-446655440000"
   *                       licenseNumber: "MD789012345"
   *                       specialization: "Pathology"
   *                       qualifications: "MD, PhD in Pathology"
   *                       experience: 8
   *                       isActive: true
   *                       user:
   *                         email: "dr.smith@hospital.com"
   *                         firstName: "John"
   *                         lastName: "Smith"
   *                     - id: "660f9511-f30c-52e5-b827-557766551111"
   *                       licenseNumber: "MD345678901"
   *                       specialization: "Radiology"
   *                       qualifications: "MD, Radiology Residency"
   *                       experience: 12
   *                       isActive: true
   *                       user:
   *                         email: "dr.johnson@clinic.com"
   *                         firstName: "Sarah"
   *                         lastName: "Johnson"
   *                   pagination:
   *                     page: 1
   *                     limit: 10
   *                     total: 25
   *                     totalPages: 3
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getDoctors = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { page = "1", limit = "10" } = req.query;

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);

      const result = await this.doctorService.getAllDoctors(
        pageNumber,
        pageSize,
      );

      res.json({
        success: true,
        data: result.doctors,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error("Error fetching doctors", { error });
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/{doctorId}:
   *   put:
   *     summary: Update doctor information
   *     description: Update a doctor's profile information. Only accessible by admin and lab admin users.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Doctor's unique identifier
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateDoctorRequest'
   *           examples:
   *             update_doctor:
   *               summary: Update Doctor Example
   *               value:
   *                 licenseNumber: "MD789012345"
   *                 specialization: "Pathology"
   *                 qualifications: "MD, PhD in Pathology, Board Certified"
   *                 experience: 10
   *                 isActive: true
   *     responses:
   *       200:
   *         description: Doctor updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Doctor updated successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Doctor'
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid doctor data"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  updateDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const updateData = req.body;

      const doctor = await this.doctorService.updateDoctor(
        doctorId,
        updateData,
      );

      logger.info("Doctor updated", { doctorId, userId: req.user!.id });

      res.json({
        success: true,
        message: "Doctor updated successfully",
        data: doctor,
      });
    } catch (error) {
      logger.error("Error updating doctor", {
        error,
        doctorId: req.params.doctorId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to update doctor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/profile:
   *   put:
   *     summary: Update current doctor's profile
   *     description: Update the authenticated doctor's own profile information. Only accessible by doctors updating their own profile.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateDoctorRequest'
   *           examples:
   *             update_profile:
   *               summary: Update Profile Example
   *               value:
   *                 specialization: "Clinical Pathology"
   *                 qualifications: "MD, PhD in Pathology, Board Certified in Clinical Pathology"
   *                 experience: 10
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Profile updated successfully"
   *                 data:
   *                   $ref: '#/components/schemas/Doctor'
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid profile data"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor profile not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor profile not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  updateProfile = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const doctor = await this.doctorService.getDoctorByUserId(userId);

      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
        return;
      }

      const updateData = req.body;
      const updatedDoctor = await this.doctorService.updateDoctor(
        doctor.id,
        updateData,
      );

      logger.info("Doctor profile updated", { doctorId: doctor.id, userId });

      res.json({
        success: true,
        message: "Profile updated successfully",
        data: updatedDoctor,
      });
    } catch (error) {
      logger.error("Error updating doctor profile", {
        error,
        userId: req.user!.id,
      });
      res.status(500).json({
        success: false,
        message: "Failed to update profile",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/{doctorId}:
   *   delete:
   *     summary: Deactivate doctor
   *     description: Deactivate a doctor account (soft delete). Only accessible by admin users.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Doctor's unique identifier
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Doctor deactivated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Doctor deactivated successfully"
   *             examples:
   *               deactivated:
   *                 summary: Doctor Deactivated
   *                 value:
   *                   success: true
   *                   message: "Doctor deactivated successfully"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  deleteDoctor = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;

      await this.doctorService.deleteDoctor(doctorId);

      logger.info("Doctor deactivated", { doctorId, userId: req.user!.id });

      res.json({
        success: true,
        message: "Doctor deactivated successfully",
      });
    } catch (error) {
      logger.error("Error deleting doctor", {
        error,
        doctorId: req.params.doctorId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to delete doctor",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/search:
   *   get:
   *     summary: Search doctors
   *     description: Search for doctors by name, specialization, or license number. Accessible by admin, lab admin, and technician users.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *           minLength: 1
   *         description: Search query (name, specialization, or license number)
   *         example: "pathology"
   *     responses:
   *       200:
   *         description: Search results retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Doctor'
   *             examples:
   *               search_results:
   *                 summary: Search Results Example
   *                 value:
   *                   success: true
   *                   data:
   *                     - id: "550e8400-e29b-41d4-a716-446655440000"
   *                       licenseNumber: "MD789012345"
   *                       specialization: "Pathology"
   *                       qualifications: "MD, PhD in Pathology"
   *                       experience: 8
   *                       isActive: true
   *                       user:
   *                         email: "dr.smith@hospital.com"
   *                         firstName: "John"
   *                         lastName: "Smith"
   *                     - id: "660f9511-f30c-52e5-b827-557766551111"
   *                       licenseNumber: "MD567890123"
   *                       specialization: "Clinical Pathology"
   *                       qualifications: "MD, Pathology Residency"
   *                       experience: 6
   *                       isActive: true
   *                       user:
   *                         email: "dr.brown@clinic.com"
   *                         firstName: "Maria"
   *                         lastName: "Brown"
   *       400:
   *         description: Invalid search query
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Search query is required"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  searchDoctors = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q || typeof q !== "string") {
        res.status(400).json({
          success: false,
          message: "Search query is required",
        });
        return;
      }

      const doctors = await this.doctorService.searchDoctors(q);

      res.json({
        success: true,
        data: doctors,
      });
    } catch (error) {
      logger.error("Error searching doctors", { error });
      res.status(500).json({
        success: false,
        message: "Failed to search doctors",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/{doctorId}/workload:
   *   get:
   *     summary: Get doctor's workload statistics
   *     description: Retrieve workload statistics for a specific doctor including assigned test requests and completion rates. Accessible by admin, lab admin, and the doctor themselves.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Doctor's unique identifier
   *         example: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Doctor workload retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/DoctorWorkload'
   *             examples:
   *               workload:
   *                 summary: Doctor Workload Example
   *                 value:
   *                   success: true
   *                   data:
   *                     doctorId: "550e8400-e29b-41d4-a716-446655440000"
   *                     totalAssigned: 45
   *                     completed: 38
   *                     pending: 7
   *                     overdue: 2
   *                     completionRate: 84.4
   *                     averageCompletionTime: 2.3
   *                     currentWeekAssigned: 8
   *                     currentWeekCompleted: 6
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getDoctorWorkload = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const workload = await this.doctorService.getDoctorWorkload(doctorId);

      res.json({
        success: true,
        data: workload,
      });
    } catch (error) {
      logger.error("Error fetching doctor workload", {
        error,
        doctorId: req.params.doctorId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch doctor workload",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/workload:
   *   get:
   *     summary: Get current doctor's workload statistics
   *     description: Retrieve workload statistics for the authenticated doctor including assigned test requests and completion rates. Only accessible by doctors.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Doctor workload retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/DoctorWorkload'
   *             examples:
   *               my_workload:
   *                 summary: My Workload Example
   *                 value:
   *                   success: true
   *                   data:
   *                     doctorId: "550e8400-e29b-41d4-a716-446655440000"
   *                     totalAssigned: 32
   *                     completed: 28
   *                     pending: 4
   *                     overdue: 1
   *                     completionRate: 87.5
   *                     averageCompletionTime: 1.8
   *                     currentWeekAssigned: 6
   *                     currentWeekCompleted: 5
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor profile not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor profile not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getMyWorkload = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const doctor = await this.doctorService.getDoctorByUserId(userId);

      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
        return;
      }

      const workload = await this.doctorService.getDoctorWorkload(doctor.id);

      res.json({
        success: true,
        data: workload,
      });
    } catch (error) {
      logger.error("Error fetching my workload", {
        error,
        userId: req.user!.id,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch workload",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/assign-test-request:
   *   post:
   *     summary: Assign test request to doctor
   *     description: Assign a test request to a specific doctor for review and analysis. Only accessible by admin and lab admin users.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/AssignTestRequestRequest'
   *           examples:
   *             assign_request:
   *               summary: Assign Test Request Example
   *               value:
   *                 testRequestId: "123e4567-e89b-12d3-a456-426614174000"
   *                 doctorId: "550e8400-e29b-41d4-a716-446655440000"
   *     responses:
   *       200:
   *         description: Test request assigned successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Test request assigned successfully"
   *             examples:
   *               assigned:
   *                 summary: Assignment Success
   *                 value:
   *                   success: true
   *                   message: "Test request assigned successfully"
   *       400:
   *         description: Invalid request data
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Invalid assignment data"
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Test request or doctor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Test request or doctor not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  assignTestRequest = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { testRequestId, doctorId } = req.body;

      await this.doctorService.assignTestRequestToDoctor(
        testRequestId,
        doctorId,
      );

      logger.info("Test request assigned to doctor", {
        testRequestId,
        doctorId,
        assignedBy: req.user!.id,
      });

      res.json({
        success: true,
        message: "Test request assigned successfully",
      });
    } catch (error) {
      logger.error("Error assigning test request", { error });
      res.status(500).json({
        success: false,
        message: "Failed to assign test request",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/{doctorId}/test-requests:
   *   get:
   *     summary: Get doctor's assigned test requests
   *     description: Retrieve a paginated list of test requests assigned to a specific doctor. Accessible by admin, lab admin, and the doctor themselves.
   *     tags: [Doctors]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: doctorId
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: Doctor's unique identifier
   *         example: "550e8400-e29b-41d4-a716-446655440000"
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
   *         description: Number of test requests per page
   *         example: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
   *         description: Filter by test request status
   *         example: "PENDING"
   *     responses:
   *       200:
   *         description: Test requests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TestRequest'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 10
   *                     total:
   *                       type: integer
   *                       example: 15
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getDoctorTestRequests = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const { doctorId } = req.params;
      const { page = "1", limit = "10", status } = req.query;

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);

      const result = await this.doctorService.getDoctorTestRequests(
        doctorId,
        pageNumber,
        pageSize,
        status as string,
      );

      res.json({
        success: true,
        data: result.testRequests,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error("Error fetching doctor test requests", {
        error,
        doctorId: req.params.doctorId,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch test requests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  /**
   * @swagger
   * /api/v1/doctors/my-test-requests:
   *   get:
   *     summary: Get current doctor's assigned test requests
   *     description: Retrieve a paginated list of test requests assigned to the authenticated doctor. Only accessible by doctors.
   *     tags: [Doctors]
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
   *         description: Number of test requests per page
   *         example: 10
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, IN_PROGRESS, COMPLETED, CANCELLED]
   *         description: Filter by test request status
   *         example: "PENDING"
   *     responses:
   *       200:
   *         description: Test requests retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TestRequest'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 10
   *                     total:
   *                       type: integer
   *                       example: 12
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *             examples:
   *               my_test_requests:
   *                 summary: My Test Requests Example
   *                 value:
   *                   success: true
   *                   data:
   *                     - id: "123e4567-e89b-12d3-a456-426614174000"
   *                       requestNumber: "TR-2024-001"
   *                       customerId: "customer-uuid"
   *                       status: "PENDING"
   *                       priority: "HIGH"
   *                       createdAt: "2024-01-15T10:30:00Z"
   *                       customer:
   *                         firstName: "John"
   *                         lastName: "Doe"
   *                   pagination:
   *                     page: 1
   *                     limit: 10
   *                     total: 12
   *                     totalPages: 2
   *       401:
   *         $ref: '#/components/responses/Unauthorized'
   *       403:
   *         $ref: '#/components/responses/Forbidden'
   *       404:
   *         description: Doctor profile not found
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Doctor profile not found"
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   */
  getMyTestRequests = async (
    req: AuthenticatedRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const userId = req.user!.id;
      const doctor = await this.doctorService.getDoctorByUserId(userId);

      if (!doctor) {
        res.status(404).json({
          success: false,
          message: "Doctor profile not found",
        });
        return;
      }

      const { page = "1", limit = "10", status } = req.query;

      const pageNumber = parseInt(page as string);
      const pageSize = parseInt(limit as string);

      const result = await this.doctorService.getDoctorTestRequests(
        doctor.id,
        pageNumber,
        pageSize,
        status as string,
      );

      res.json({
        success: true,
        data: result.testRequests,
        pagination: {
          page: pageNumber,
          limit: pageSize,
          total: result.total,
          totalPages: result.totalPages,
        },
      });
    } catch (error) {
      logger.error("Error fetching my test requests", {
        error,
        userId: req.user!.id,
      });
      res.status(500).json({
        success: false,
        message: "Failed to fetch test requests",
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };
}
