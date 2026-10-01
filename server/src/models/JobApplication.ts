import mongoose, { Schema, Document } from 'mongoose';

export interface IPreviousCTC {
  amount: number;
  currency: 'INR' | 'NGN';
}

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  jobTitle: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  passportNumber: string;
  experienceYears: number;
  email: string;
  phone: string;
  whatsAppNumber?: string;
  passportDocumentUrl: string;
  previousCompany: string;
  previousRole: string;
  previousCTC: IPreviousCTC;
  resumeUrl: string;
  status: 'NEW' | 'SHORTLISTED' | 'REJECTED' | 'HIRED';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PreviousCTCSchema = new Schema<IPreviousCTC>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['INR', 'NGN'], required: true },
  },
  { _id: false }
);

const JobApplicationSchema: Schema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'JobVacancy', required: true },
    jobTitle: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    passportNumber: { type: String, required: true, uppercase: true, trim: true },
    experienceYears: { type: Number, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    whatsAppNumber: { type: String },
    passportDocumentUrl: { type: String, required: true },
    previousCompany: { type: String, required: true },
    previousRole: { type: String, required: true },
    previousCTC: { type: PreviousCTCSchema, required: true },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['NEW', 'SHORTLISTED', 'REJECTED', 'HIRED'],
      default: 'NEW',
    },
    notes: { type: String },
  },
  { timestamps: true }
);

JobApplicationSchema.index({ jobId: 1, passportNumber: 1 }, { unique: true });
JobApplicationSchema.index({ status: 1 });

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
