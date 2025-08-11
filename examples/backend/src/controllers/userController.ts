
/**
 * @fileoverview Controller for user-related routes (e.g., fetching user profile).
 * It handles fetching user data after authentication.
 */

import { Request, Response } from 'express';
import { userService } from '../services/userService';

export const userController = {
    /**
     * Handles fetching the authenticated user's profile.
     * Requires a valid JWT.
     * @param req Express request object (with user payload attached by authMiddleware).
     * @param res Express response object.
     */
    getProfile: async (req: Request, res: Response) => {
        const userPayload = req.user;

        if (!userPayload) {
            // This case should ideally not be reached if authMiddleware is properly applied
            return res.status(401).json({ message: 'User not authenticated' });
        }

        try {
            const userProfile = await userService.findById(userPayload.userId);

            if (!userProfile) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json({ message: 'Welcome to your profile!', user: userProfile });
        } catch (error) {
            console.error('Profile route error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};
