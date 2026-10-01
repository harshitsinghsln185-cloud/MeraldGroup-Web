import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import User from '../models/User';
import Employee from '../models/Employee';
import Payroll from '../models/Payroll';
import Manpower from '../models/Manpower';

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

const sampleEmployees = [
  {
    employeeCode: 'MGD-NIG-1001',
    fullName: 'Chidi Okonkwo',
    email: 'chidi.o@meraldgroup.com',
    phone: '+234 803 111 2233',
    country: 'Nigeria',
    department: 'MEP',
    designation: 'Senior MEP Project Engineer',
    siteLocation: 'Victoria Island Tower Site',
    joiningDate: new Date('2022-03-15'),
    basicSalary: 850000,
    currency: 'NGN',
    bankName: 'First Bank Nigeria',
    accountNumber: '0123456789',
    taxPin: 'NGN-TAX-887123',
    status: 'ACTIVE',
    documents: [
      {
        documentType: 'Passport',
        documentNumber: 'A98217342',
        expiryDate: new Date('2028-11-15'),
        status: 'SAFE',
      },
      {
        documentType: 'Visa / Work Permit',
        documentNumber: 'WP-NIG-2024-88',
        expiryDate: new Date('2026-10-30'),
        status: 'ATTENTION',
      },
    ],
  },
  {
    employeeCode: 'MGD-IND-2004',
    fullName: 'Rajesh Sharma',
    email: 'rajesh.s@meraldgroup.com',
    phone: '+91 98765 12345',
    country: 'India',
    department: 'HVAC',
    designation: 'HVAC Specialist Technician',
    siteLocation: 'Mumbai Airport Maintenance Depot',
    joiningDate: new Date('2023-01-10'),
    basicSalary: 65000,
    currency: 'INR',
    bankName: 'HDFC Bank India',
    accountNumber: '98765432101',
    taxPin: 'IND-TAX-445192',
    status: 'ACTIVE',
    documents: [
      {
        documentType: 'Passport',
        documentNumber: 'Z1092837',
        expiryDate: new Date('2030-05-20'),
        status: 'SAFE',
      },
    ],
  },
];

const samplePayrollsData = [
  {
    employeeCode: 'MGD-NIG-1001',
    employeeName: 'Chidi Okonkwo',
    country: 'Nigeria',
    month: '2026-09',
    currency: 'NGN',
    basicSalary: 850000,
    housingAllowance: 300000,
    transportAllowance: 150000,
    otherAllowances: 50000,
    grossSalary: 1350000,
    taxDeduction: 135000,
    pensionDeduction: 67500,
    otherDeductions: 0,
    totalDeductions: 202500,
    netSalary: 1147500,
    paymentStatus: 'PROCESSED',
    processedBy: 'hr@meraldgroup.com',
    paymentDate: new Date('2026-09-25'),
  },
  {
    employeeCode: 'MGD-IND-2004',
    employeeName: 'Rajesh Sharma',
    country: 'India',
    month: '2026-09',
    currency: 'INR',
    basicSalary: 65000,
    housingAllowance: 20000,
    transportAllowance: 10000,
    otherAllowances: 5000,
    grossSalary: 100000,
    taxDeduction: 8000,
    pensionDeduction: 4000,
    otherDeductions: 0,
    totalDeductions: 12000,
    netSalary: 88000,
    paymentStatus: 'PROCESSED',
    processedBy: 'accounts@meraldgroup.com',
    paymentDate: new Date('2026-09-25'),
  },
];

const sampleManpower = [
  {
    siteName: 'Lagos Commercial Tower Site A',
    country: 'Nigeria',
    tradeCategory: 'MEP Engineers',
    contractedHeadcount: 15,
    actualDeployedHeadcount: 12,
  },
  {
    siteName: 'Abuja Corporate Hub',
    country: 'Nigeria',
    tradeCategory: 'HVAC Technicians',
    contractedHeadcount: 20,
    actualDeployedHeadcount: 20,
  },
  {
    siteName: 'Mumbai Metro Line MEP',
    country: 'India',
    tradeCategory: 'HSE Inspectors',
    contractedHeadcount: 8,
    actualDeployedHeadcount: 6,
  },
];

export const seedAll = async () => {
  try {
    console.log('🔄 Connecting to MongoDB database...');
    await connectDB();

    // Clear old indices if any stale ones exist
    try { await Employee.collection.dropIndexes(); } catch (e) {}
    try { await Payroll.collection.dropIndexes(); } catch (e) {}
    try { await Manpower.collection.dropIndexes(); } catch (e) {}

    // 1. Seed Admin Users
    const defaultPassword = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    for (const userData of defaultUsers) {
      await User.findOneAndUpdate(
        { email: userData.email },
        { ...userData, password: hashedPassword },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Admin Users seeded (Default Password: Password123!)');

    // 2. Seed Employees
    const seededEmpMap: Record<string, mongoose.Types.ObjectId> = {};
    for (const emp of sampleEmployees) {
      const createdEmp = await Employee.findOneAndUpdate(
        { employeeCode: emp.employeeCode },
        emp,
        { upsert: true, new: true }
      );
      seededEmpMap[emp.employeeCode] = createdEmp._id as mongoose.Types.ObjectId;
    }
    console.log('✅ Sample Employees seeded.');

    // 3. Seed Payrolls
    for (const pay of samplePayrollsData) {
      const empId = seededEmpMap[pay.employeeCode];
      if (empId) {
        await Payroll.findOneAndUpdate(
          { employeeCode: pay.employeeCode, month: pay.month },
          { ...pay, employeeId: empId },
          { upsert: true, new: true }
        );
      }
    }
    console.log('✅ Sample Payroll records seeded.');

    // 4. Seed Manpower
    for (const mp of sampleManpower) {
      const shortfall = Math.max(0, mp.contractedHeadcount - mp.actualDeployedHeadcount);
      const fulfillmentRate = Math.round((mp.actualDeployedHeadcount / mp.contractedHeadcount) * 100);
      let status = 'OPTIMAL';
      if (fulfillmentRate < 70) status = 'CRITICAL';
      else if (fulfillmentRate < 90) status = 'SHORTFALL';

      await Manpower.findOneAndUpdate(
        { siteName: mp.siteName, tradeCategory: mp.tradeCategory },
        { ...mp, shortfall, fulfillmentRate, status },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Sample Manpower site metrics seeded.');

    console.log('\n🎉 ALL SEED DATA SUCCESSFULLY INSERTED INTO MONGO DATABASE!');
    console.log('===========================================================');
    console.log('Test Credentials for Admin Panel:');
    console.log('  HR Manager:  hr@meraldgroup.com / Password123!');
    console.log('  Accounts:    accounts@meraldgroup.com / Password123!');
    console.log('  Admin:       admin@meraldgroup.com / Password123!');
    console.log('  Supervisor:  supervisor@meraldgroup.com / Password123!');
    console.log('===========================================================');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  seedAll();
}
