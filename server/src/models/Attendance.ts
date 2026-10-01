import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  employeeId: mongoose.Types.ObjectId;
  employeeCode: string;
  employeeName: string;
  date: string; // Format: YYYY-MM-DD
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'OVERTIME';
  overtimeHours: number;
  siteLocation: string;
  recordedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema: Schema = new Schema(
  {
    employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
    employeeCode: { type: String, required: true },
    employeeName: { type: String, required: true },
    date: { type: String, required: true }, // e.g. "2026-09-26"
    status: {
      type: String,
      enum: ['PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE', 'OVERTIME'],
      default: 'PRESENT',
    },
    overtimeHours: { type: Number, default: 0 },
    siteLocation: { type: String, required: true },
    recordedBy: { type: String },
  },
  { timestamps: true }
);

// Compound index to ensure 1 attendance entry per employee per date
AttendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
AttendanceSchema.index({ date: -1, siteLocation: 1 });

export default mongoose.model<IAttendance>('Attendance', AttendanceSchema);
