import mongoose, { Schema, Document } from 'mongoose';

export interface IManpowerRequirement extends Document {
  siteName: string;
  country: 'Nigeria' | 'India' | 'UAE' | 'Ghana' | 'Uganda';
  tradeCategory: 'MEP Engineers' | 'HVAC Technicians' | 'HSE Inspectors' | 'Logistics Drivers' | 'General Labor';
  contractedHeadcount: number;
  actualDeployedHeadcount: number;
  shortfall: number;
  fulfillmentRate: number;
  status: 'OPTIMAL' | 'SHORTFALL' | 'CRITICAL';
  updatedAt: Date;
}

const ManpowerSchema: Schema = new Schema(
  {
    siteName: { type: String, required: true },
    country: { type: String, enum: ['Nigeria', 'India', 'UAE', 'Ghana', 'Uganda'], required: true },
    tradeCategory: { type: String, required: true },
    contractedHeadcount: { type: Number, required: true },
    actualDeployedHeadcount: { type: Number, required: true },
    shortfall: { type: Number, required: true },
    fulfillmentRate: { type: Number, required: true },
    status: { type: String, enum: ['OPTIMAL', 'SHORTFALL', 'CRITICAL'], default: 'OPTIMAL' },
  },
  { timestamps: true }
);

export default mongoose.model<IManpowerRequirement>('Manpower', ManpowerSchema);
