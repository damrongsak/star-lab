
/**
 * @fileoverview Zod schemas for authentication-related request body validation.
 */

import { z } from 'zod';

/**
 * Zod schema for validating the user registration and login request body.
 * It ensures that the email is a valid format and the password is at least 8 characters long.
 */
export const authSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
});
