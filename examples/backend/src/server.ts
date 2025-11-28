/**
 * @fileoverview This is the main Express server file.
 * It initializes the Express application, applies middleware, and sets up routes.
 */

import express, { Request, Response, NextFunction } from 'express';
import config from './config';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Create the Express application.
const app = express();

// Middleware to parse JSON bodies.
app.use(express.json());

// =========================================================================
// API Routes
// =========================================================================

// Authentication routes
app.use('/api/auth', authRoutes);

// User routes (protected)
app.use('/api/user', userRoutes);

/**
 * Catch-all error handling middleware.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});


// =========================================================================
// Start the Server
// =========================================================================

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});