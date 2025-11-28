
/**
 * @fileoverview Service layer for user-related database operations.
 * It interacts with the Prisma client to perform CRUD operations on the User model.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userService = {
    /**
     * Finds a user by their email address.
     * @param email The email of the user to find.
     * @returns The user object if found, otherwise null.
     */
    findByEmail: async (email: string) => {
        return prisma.user.findUnique({ where: { email } });
    },

    /**
     * Finds a user by their ID.
     * @param id The ID of the user to find.
     * @returns The user object if found, otherwise null.
     */
    findById: async (id: string) => {
        return prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                createdAt: true,
            },
        });
    },

    /**
     * Creates a new user in the database.
     * @param data The data for the new user (email and hashed password).
     * @returns The newly created user object.
     */
    create: async (data: { email: string; password: string }) => {
        return prisma.user.create({ data });
    },
};
