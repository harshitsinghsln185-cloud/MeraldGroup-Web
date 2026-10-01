import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User';
import { connectDB } from '../config/db';

dotenv.config();

const defaultUsers = [
  {
    name: 'Merald HR Manager',
    email: 'hr@meraldgroup.com',
    role: 'HR',
    department: 'Human Resources',
    phone: '+234 800 123 4567',
  },
  {
    name: 'Accounts Executive',
    email: 'accounts@meraldgroup.com',
    role: 'ACCOUNTS',
    department: 'Finance & Payroll',
    phone: '+91 98765 43210',
  },
  {
    name: 'System Administrator',
    email: 'admin@meraldgroup.com',
    role: 'ADMIN',
    department: 'IT & Infrastructure',
    phone: '+971 50 123 4567',
  },
  {
    name: 'Site Supervisor Lagos',
    email: 'supervisor@meraldgroup.com',
    role: 'SITE_SUPERVISOR',
    department: 'Lagos Island Site A',
    siteId: 'SITE-NIG-01',
    phone: '+234 802 345 6789',
  },
];

export const seedAdminUsers = async () => {
  try {
    await connectDB();
    const defaultPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    for (const userData of defaultUsers) {
      const existing = await User.findOne({ email: userData.email });
      if (!existing) {
        await User.create({
          ...userData,
          password: hashedPassword,
        });
        console.log(`[SeedUsers] Created user: ${userData.email} (${userData.role})`);
      } else {
        console.log(`[SeedUsers] User already exists: ${userData.email}`);
      }
    }

    console.log('[SeedUsers] Admin users seeded successfully.');
  } catch (error) {
    console.error('[SeedUsers] Error seeding admin users:', error);
  }
};

// Run directly if invoked from CLI
if (require.main === module) {
  seedAdminUsers().then(() => mongoose.connection.close());
}
