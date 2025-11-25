import { UserRole } from "@prisma/client";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id?: string; // mirrors userId for convenience across controllers
                userId: string;
                email: string;
                role: UserRole;
            };
        }
    }
}

export { };
