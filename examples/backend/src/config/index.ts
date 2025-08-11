
/**
 * @fileoverview Configuration file for the application.
 * It exports environment variables and other constants.
 */

const config = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your_very_secret_key_here',
};

export default config;
