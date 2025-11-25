import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import logger from '../utils/logger';

const userService = new UserService();

export class UserController {
    /**
     * Get current user's profile (works for all roles)
     * Returns user data with profile and role-specific information
     */
    async getProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

            const profile = await userService.getUserProfile(userId);

            if (!profile) {
                res.status(404).json({
                    success: false,
                    message: 'User profile not found'
                });
                return;
            }

            res.json({
                success: true,
                data: profile,
            });
        } catch (error) {
            logger.error(`Error getting user profile: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update current user's profile
     */
    async updateProfile(req: Request, res: Response): Promise<void> {
        try {
            const userId = (req as any).user?.userId;

            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'Unauthorized'
                });
                return;
            }

            const updatedProfile = await userService.updateUserProfile(userId, req.body);

            res.json({
                success: true,
                data: updatedProfile,
                message: 'Profile updated successfully',
            });
        } catch (error) {
            logger.error(`Error updating user profile: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Get user profile by ID (for RBAC protected routes)
     */
    async getUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const profile = await userService.getUserProfile(userId);

            if (!profile) {
                res.status(404).json({
                    success: false,
                    message: 'User profile not found'
                });
                return;
            }

            res.json({
                success: true,
                data: profile,
            });
        } catch (error) {
            logger.error(`Error getting user by ID: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    /**
     * Update user profile by ID (for RBAC protected routes)
     */
    async updateUserById(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.params.id;

            if (!userId) {
                res.status(400).json({
                    success: false,
                    message: 'User ID is required'
                });
                return;
            }

            const updatedProfile = await userService.updateUserProfile(userId, req.body);

            res.json({
                success: true,
                data: updatedProfile,
                message: 'Profile updated successfully',
            });
        } catch (error) {
            logger.error(`Error updating user by ID: ${error}`);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
