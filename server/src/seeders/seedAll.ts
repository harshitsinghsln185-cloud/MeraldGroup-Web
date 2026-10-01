import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import { seedHRAccount } from './seedHR';

dotenv.config();

export const seedAll = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();

    console.log('🌱 Executing Production Seed Script...');
    const hrCreated = await seedHRAccount();

    if (hrCreated) {
      console.log('✅ HR Account initialized from environment credentials.');
    } else {
      console.log('ℹ️ HR Account already exists or environment credentials skipped.');
    }

    console.log('\n🎉 Production Database Seed Complete!');
    console.log('===========================================================');
    console.log(`  Target DB Cluster: ${mongoose.connection.name}`);
    console.log(`  Host: ${mongoose.connection.host}`);
    console.log('===========================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during production database seed:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}
