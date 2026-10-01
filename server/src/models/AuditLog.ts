import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  userEmail: string;
  userRole: 'HR' | 'ACCOUNTS' | 'ADMIN' | 'SITE_SUPERVISOR';
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  timestamp: Date;
}

const AuditLogSchema: Schema = new Schema(
  {
    userEmail: { type: String, required: true },
    userRole: { type: String, required: true },
    action: { type: String, required: true },
    module: { type: String, required: true },
    details: { type: String, required: true },
    ipAddress: { type: String, default: '127.0.0.1' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
