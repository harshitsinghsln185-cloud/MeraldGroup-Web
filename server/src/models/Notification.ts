import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: string;
  link?: string;
  targetRoles?: ('HR' | 'ACCOUNTS' | 'ADMIN' | 'SITE_SUPERVISOR')[];
  isRead?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, default: 'SYSTEM' },
    link: { type: String },
    targetRoles: [{ type: String, enum: ['HR', 'ACCOUNTS', 'ADMIN', 'SITE_SUPERVISOR'] }],
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
