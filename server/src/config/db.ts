import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/merald_group_db';
    
    // Configured for 500 concurrent users scalability requirement
    await mongoose.connect(connStr, {
      maxPoolSize: 50, // Connection pool size 30-50 for high concurrency
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`[Database] MongoDB Connected cleanly: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('[Database] MongoDB connection error:', error);
    process.exit(1);
  }
};
