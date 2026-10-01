import mongoose, { Schema, Document } from 'mongoose';

export interface ICountry extends Document {
  name: string;
  slug: string;
  flag: string;
  capital: string;
  currency: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  overviewText: string;
  keyProjects: { title: string; category: string; description: string }[];
  localOffice: { address: string; phone: string; email: string; mapUrl?: string };
  stats: { label: string; value: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    flag: { type: String, required: true },
    capital: { type: String, required: true },
    currency: { type: String, required: true },
    metaTitle: { type: String, required: true },
    metaDescription: { type: String, required: true },
    heroHeadline: { type: String, required: true },
    overviewText: { type: String, required: true },
    keyProjects: [
      {
        title: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    localOffice: {
      address: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      mapUrl: { type: String },
    },
    stats: [
      {
        label: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ICountry>('Country', CountrySchema);
