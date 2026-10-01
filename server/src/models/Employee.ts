import mongoose, { Schema, Document } from 'mongoose';

export interface IDocumentItem {
  documentType: 'Passport' | 'Visa / Work Permit' | 'National ID / Tax PIN' | 'Educational Certificate' | 'HSE Certification' | 'Employment Contract';
  documentNumber: string;
  expiryDate?: Date;
  status: 'SAFE' | 'ATTENTION' | 'URGENT' | 'EXPIRED';
  fileUrl?: string;
}

export interface IEmployee extends Document {
  employeeCode: string;
  fullName: string;
  email: string;
  phone: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  department: 'EPC' | 'MEP' | 'HVAC' | 'Facility Management' | 'Logistics' | 'Corporate';
  designation: string;
  siteLocation: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'ONBOARDING';
  joiningDate: Date;
  avatar?: string;
  // Sensitive financial fields (Role-gated)
  basicSalary?: number;
  currency?: 'INR' | 'NGN';
  bankName?: string;
  accountNumber?: string;
  taxPin?: string;
  documents: IDocumentItem[];
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema = new Schema<IDocumentItem>({
  documentType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  expiryDate: { type: Date },
  status: { type: String, enum: ['SAFE', 'ATTENTION', 'URGENT', 'EXPIRED'], default: 'SAFE' },
  fileUrl: { type: String },
});

const EmployeeSchema: Schema = new Schema(
  {
    employeeCode: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true, enum: ['Nigeria', 'India', 'UAE', 'Ghana', 'Uganda'] },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    siteLocation: { type: String, required: true },
    status: { type: String, enum: ['ACTIVE', 'ON_LEAVE', 'TERMINATED', 'ONBOARDING'], default: 'ACTIVE' },
    joiningDate: { type: Date, default: Date.now },
    avatar: { type: String },
    // Sensitive financial info
    basicSalary: { type: Number },
    currency: { type: String, enum: ['INR', 'NGN'], default: 'NGN' },
    bankName: { type: String },
    accountNumber: { type: String },
    taxPin: { type: String },
    documents: [DocumentSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IEmployee>('Employee', EmployeeSchema);
