import mongoose from 'mongoose';
import { config } from 'dotenv';
import { promise } from 'zod';

config(); // Load environment variables from .env file

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/yckf'; // fallback for dev

export const connectDB = async () => { promise<void> => {
    try {
        await mongoose.connect(DB_URI);
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1); // Exit process with failure   
    }
}