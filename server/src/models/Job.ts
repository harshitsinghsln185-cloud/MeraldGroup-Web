import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  department: string;
  country: string;
  type: 'Full-time' | 'Contract' | 'Site-based';
  experienceYears: string;
  description: string;
  requirements: string[];
  isActive: boolean;
  createdAt: Date;
}

const JobSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    country: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Contract', 'Site-based'], default: 'Full-time' },
    experienceYears: { type: String, required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<IJob>('Job', JobSchema);
