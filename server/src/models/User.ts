import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../middleware/roleMiddleware';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  department?: string;
  siteId?: string;
  phone?: string;
  avatar?: string;
  isApproved: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: mongoose.Types.ObjectId | string;
  approvedAt?: Date;
  resetOtp?: string;
  resetOtpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['HR', 'ACCOUNTS', 'ADMIN', 'SITE_SUPERVISOR'],
      required: true,
      default: 'SITE_SUPERVISOR',
    },
    department: { type: String, default: 'General' },
    siteId: { type: String, default: null },
    phone: { type: String, default: '' },
    avatar: { type: String, default: '' },
    isApproved: { type: Boolean, default: false },
    approvalStatus: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    resetOtp: { type: String, default: null },
    resetOtpExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);
