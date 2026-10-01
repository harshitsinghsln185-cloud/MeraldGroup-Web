import mongoose, { Schema, Document } from 'mongoose';

export interface IClearanceItem {
  departmentKey: 'IT' | 'HR' | 'ACCOUNTS' | 'SITE';
  departmentName: string;
  cleared: boolean;
  remarks?: string;
  clearedBy?: string;
  clearedAt?: Date;
}

export interface IClearance extends Document {
  employeeCode: string;
  employeeName: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  department: string;
  designation: string;
  exitReason: string;
  lastWorkingDay: Date;
  status: 'IN_PROGRESS' | 'CLEARED' | 'REJECTED';
  clearanceItems: IClearanceItem[];
  nocIssued: boolean;
  nocIssuedDate?: Date;
  nocReferenceNo?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClearanceItemSchema = new Schema<IClearanceItem>({
  departmentKey: { type: String, required: true },
  departmentName: { type: String, required: true },
  cleared: { type: Boolean, default: false },
  remarks: { type: String },
  clearedBy: { type: String },
  clearedAt: { type: Date },
});

const ClearanceSchema: Schema = new Schema(
  {
    employeeCode: { type: String, required: true },
    employeeName: { type: String, required: true },
    country: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    exitReason: { type: String, required: true },
    lastWorkingDay: { type: Date, required: true },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'CLEARED', 'REJECTED'],
      default: 'IN_PROGRESS',
    },
    clearanceItems: [ClearanceItemSchema],
    nocIssued: { type: Boolean, default: false },
    nocIssuedDate: { type: Date },
    nocReferenceNo: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IClearance>('Clearance', ClearanceSchema);
