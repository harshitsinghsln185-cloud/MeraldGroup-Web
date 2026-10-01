import mongoose from 'mongoose';

export const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ [Database] FATAL: MONGODB_URI environment variable is missing in server environment.');
    throw new Error('MONGODB_URI environment variable is required to start the database connection.');
  }

  // Setup connection event listeners
  mongoose.connection.on('error', (err) => {
    console.error('⚠️ [Database] MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️ [Database] MongoDB disconnected. Attempting automatic reconnection...');
  });

  mongoose.connection.on('reconnected', () => {
    console.log('✅ [Database] MongoDB reconnected successfully.');
  });

  try {
    // Configured for MongoDB Atlas & high concurrency production loads
    await mongoose.connect(mongoUri, {
      maxPoolSize: 50,
      minPoolSize: 10,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`✅ [Database] MongoDB Connected to host: ${mongoose.connection.host} (DB: ${mongoose.connection.name})`);
  } catch (error) {
    console.error('❌ [Database] Failed to establish MongoDB connection:', error);
    throw error;
  }
};
