import mongoose, { Schema, Document } from 'mongoose';

export interface IContactInquiry extends Document {
  inquiryType: 'RFP' | 'VendorRegistration';
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  targetCountry: string;
  serviceCategory: string;
  message: string;
  status: 'New' | 'InReview' | 'Contacted' | 'Closed';
  createdAt: Date;
}

const ContactInquirySchema: Schema = new Schema(
  {
    inquiryType: {
      type: String,
      enum: ['RFP', 'VendorRegistration'],
      required: true,
    },
    fullName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    targetCountry: { type: String, required: true },
    serviceCategory: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['New', 'InReview', 'Contacted', 'Closed'],
      default: 'New',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
