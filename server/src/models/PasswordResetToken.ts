import mongoose, { Schema, Document } from 'mongoose';

export interface IPasswordResetToken extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const PasswordResetTokenSchema: Schema = new Schema(
  {
    email: { type: String, required: true, index: true, lowercase: true },
    otpHash: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: '10m' } },
    used: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);
