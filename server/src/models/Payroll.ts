import mongoose, { Schema, Document } from 'mongoose';

export interface IPayroll extends Document {
  employeeId: mongoose.Types.ObjectId;
  employeeCode: string;
  employeeName: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  month: string; // YYYY-MM
  currency: 'INR' | 'NGN'; // Strictly restricted to INR or NGN
  basicSalary: number;
  housingAllowance: number;
  transportAllowance: number;
  otherAllowances: number;
  grossSalary: number;
  taxDeduction: number;
  pensionDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  paymentStatus: 'PENDING' | 'PROCESSED' | 'PAID';
  paymentDate?: Date;
  processedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayrollSchema: Schema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeCode: { type: String, required: true },
    employeeName: { type: String, required: true },
    country: { type: String, required: true },
    month: { type: String, required: true }, // e.g. "2026-09"
    currency: { type: String, enum: ['INR', 'NGN'], required: true, default: 'NGN' },
    basicSalary: { type: Number, required: true },
    housingAllowance: { type: Number, default: 0 },
    transportAllowance: { type: Number, default: 0 },
    otherAllowances: { type: Number, default: 0 },
    grossSalary: { type: Number, required: true },
    taxDeduction: { type: Number, default: 0 },
    pensionDeduction: { type: Number, default: 0 },
    otherDeductions: { type: Number, default: 0 },
    totalDeductions: { type: Number, default: 0 },
    netSalary: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'PROCESSED', 'PAID'],
      default: 'PENDING',
    },
    paymentDate: { type: Date },
    processedBy: { type: String },
  },
  { timestamps: true }
);

// Compound index to ensure 1 payroll record per employee per month
PayrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });

export default mongoose.model<IPayroll>('Payroll', PayrollSchema);
