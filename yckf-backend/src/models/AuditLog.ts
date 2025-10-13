// AuditLog.ts (New: Extend for bots)

import mongoose, { Schema, Document } from 'mongoose';

interface IAuditLog extends Document {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  status: 'success' | 'failed' | 'pending';
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  channel?: 'whatsapp' | 'telegram'; // New: For bots
  query?: string; // New: User message/query
  response?: string; // New: Bot reply
}

const AuditLogSchema: Schema = new Schema<IAuditLog>({
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String },
  userId: { type: String },
  userEmail: { type: String },
  userRole: { type: String },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success', required: true },
  details: { type: Schema.Types.Mixed },
  ipAddress: { type: String },
  userAgent: { type: String },
  channel: { type: String, enum: ['whatsapp', 'telegram'] }, // New: Bot channel
  query: { type: String }, // New: User input
  response: { type: String }, // New: Bot output
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);