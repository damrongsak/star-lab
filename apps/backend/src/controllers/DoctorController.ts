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
   * Create a new doctor
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
   * Get doctor by ID
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
   * Get current doctor's profile
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
   * Get all doctors with pagination
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
   * Update doctor
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
   * Update doctor profile (for doctor's own profile)
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
   * Delete/Deactivate doctor
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
   * Search doctors
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
   * Get doctor workload
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
   * Get current doctor's workload
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
   * Assign test request to doctor
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
   * Get doctor's test requests
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
   * Get current doctor's test requests
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
