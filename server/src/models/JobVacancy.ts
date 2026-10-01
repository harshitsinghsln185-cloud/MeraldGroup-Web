// Auto-closure by closingDate is enforced at query-time in the controller (read-filter), with periodic status flip via background job - NOT via Mongoose middleware. See Step 3 for implementation.

import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryPackage {
  amount: number;
  currency: 'INR' | 'NGN';
}

export interface IRecruitmentStep {
  stepNumber: number;
  title: string;
  description: string;
}

export interface IJobVacancy extends Document {
  title: string;
  department: string;
  salaryPackage: ISalaryPackage;
  location: 'India' | 'UAE' | 'Uganda' | 'Nigeria' | 'Ghana';
  experienceRequired: string;
  ageRequirement: string;
  facilitiesProvided: string[];
  recruitmentProcess: IRecruitmentStep[];
  degreeRequired: string;
  skillsRequired: string[];
  documentsRequired: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
  openingsCount: number;
  hiredCount: number;
  postedDate?: Date;
  closingDate?: Date;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SalaryPackageSchema = new Schema<ISalaryPackage>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, enum: ['INR', 'NGN'], required: true },
  },
  { _id: false }
);

const RecruitmentStepSchema = new Schema<IRecruitmentStep>(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const JobVacancySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    department: { type: String, required: true },
    salaryPackage: { type: SalaryPackageSchema, required: true },
    location: {
      type: String,
      enum: ['India', 'UAE', 'Uganda', 'Nigeria', 'Ghana'],
      required: true,
    },
    experienceRequired: { type: String, required: true },
    ageRequirement: { type: String, required: true },
    facilitiesProvided: [{ type: String, required: true }],
    recruitmentProcess: [{ type: RecruitmentStepSchema, required: true }],
    degreeRequired: { type: String, required: true },
    skillsRequired: [{ type: String, required: true }],
    documentsRequired: [{ type: String, required: true }],
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'CLOSED'],
      default: 'DRAFT',
    },
    openingsCount: { type: Number, required: true, min: 1, default: 1 },
    hiredCount: { type: Number, required: true, min: 0, default: 0 },
    postedDate: { type: Date },
    closingDate: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

JobVacancySchema.index({ status: 1, location: 1 });
JobVacancySchema.index({ department: 1 });

export default mongoose.model<IJobVacancy>('JobVacancy', JobVacancySchema);
