
/**
 * @fileoverview Controller for authentication-related routes (register, login).
 * It handles request validation, user creation, password hashing, and JWT generation.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

import { authSchema } from '../validation/authValidation';
import { userService } from '../services/userService';
import config from '../config';

export const authController = {
    /**
     * Handles user registration.
     * @param req Express request object.
     * @param res Express response object.
     */
    register: async (req: Request, res: Response) => {
        try {
            const { email, password } = authSchema.parse(req.body);

            const existingUser = await userService.findByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'User with this email already exists' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await userService.create({ email, password: hashedPassword });

            const token = jwt.sign({ userId: newUser.id, email: newUser.email }, config.jwtSecret, { expiresIn: '1h' });

            res.status(201).json({ message: 'User registered successfully', token });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    /**
     * Handles user login.
     * @param req Express request object.
     * @param res Express response object.
     */
    login: async (req: Request, res: Response) => {
        try {
            const { email, password } = authSchema.parse(req.body);

            const user = await userService.findByEmail(email);
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id, email: user.email }, config.jwtSecret, { expiresIn: '1h' });

            res.status(200).json({ message: 'Logged in successfully', token });

        } catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ errors: error.errors });
            }
            console.error('Login error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
};
