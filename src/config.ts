import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
export const MONGO_URL = process.env.MONGO_URL;

if (!JWT_USER_PASSWORD) {
    console.error("FATAL ERROR: JWT_USER_PASSWORD is not defined in environment variables.");
    process.exit(1); // Exit the application with an error code
}