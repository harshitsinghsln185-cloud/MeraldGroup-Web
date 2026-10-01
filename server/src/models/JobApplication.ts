import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplication extends Document {
  jobId?: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  country: string;
  experienceYears: number;
  resumeUrl: string;
  status: 'Pending' | 'Reviewed' | 'Shortlisted' | 'Rejected';
  appliedAt: Date;
}

const JobApplicationSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    experienceYears: { type: Number, required: true },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Reviewed', 'Shortlisted', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: { createdAt: 'appliedAt', updatedAt: true } }
);

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
