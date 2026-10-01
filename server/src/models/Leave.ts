import mongoose, { Schema, Document } from 'mongoose';

export interface ILeave extends Document {
  employeeId: mongoose.Types.ObjectId;
  employeeCode: string;
  employeeName: string;
  leaveType: 'ANNUAL' | 'SICK' | 'EMERGENCY' | 'UNPAID';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const LeaveSchema: Schema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeCode: { type: String, required: true },
    employeeName: { type: String, required: true },
    leaveType: {
      type: String,
      enum: ['ANNUAL', 'SICK', 'EMERGENCY', 'UNPAID'],
      default: 'ANNUAL',
    },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    approvedBy: { type: String },
    rejectionReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ILeave>('Leave', LeaveSchema);
