
/**
 * @fileoverview JWT authentication middleware for protecting routes.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config';

// Extend the Request interface to include the user property
declare global {
    namespace Express {
        interface Request {
            user?: { userId: string; email: string };
        }
    }
}

/**
 * Middleware to protect routes by verifying the JWT from the Authorization header.
 * If the token is valid, it attaches the user payload to the request object.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token not provided or is invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, config.jwtSecret) as { userId: string; email: string };
        req.user = payload;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
