import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import { connectDB } from '../config/db';

dotenv.config();

export const seedHRAccount = async (): Promise<boolean> => {
  const email = process.env.SEED_HR_EMAIL;
  const password = process.env.SEED_HR_PASSWORD;

  if (!email || !password) {
    console.warn(
      '⚠️ [SeedHR] SEED_HR_EMAIL or SEED_HR_PASSWORD environment variable is missing. Skipping HR account creation.'
    );
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    console.log(`HR account already exists, skipping`);
    return false;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await User.create({
    name: 'Merald HR Manager',
    email: normalizedEmail,
    password: hashedPassword,
    role: 'HR',
    department: 'Human Resources',
    isApproved: true,
    approvalStatus: 'APPROVED',
  });

  console.log(`✅ [SeedHR] HR account created successfully: ${normalizedEmail}`);
  return true;
};

export const runSeedHR = async (): Promise<void> => {
  try {
    await connectDB();
    await seedHRAccount();
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ [SeedHR] Error during HR account seeding:', error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  }
};

if (require.main === module) {
  runSeedHR();
}
