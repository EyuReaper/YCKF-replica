import { schemaTypes } from '../../../yckf-sanity/schemaTypes/index.js';;

import mongoose, { Schema, model, Document } from 'mongoose';

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
  matchedFAQId?: string; // New: For linking to FAQ in Sanity
}

const AuditLogSchema: Schema = new Schema<IAuditLog>({
  action: { type: String, required: true },
  entityType: { type: String, required: true },
  entityId: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  userEmail: { type: String },
  userRole: { type: String },
  status: { type: String, enum: ['success', 'failed', 'pending'], default: 'success', required: true },
  details: { type: Schema.Types.Mixed, default: {} },
  ipAddress: { type: String },
  userAgent: { type: String },
  channel: { type: String, enum: ['whatsapp', 'telegram'] }, // New: Bot channel
  query: { type: String }, // New: User input
  response: { type: String }, // New: Bot output
  matchedFAQId: { type: String }, // New: Reference to matched FAQ
  timestamp: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export const AuditLog = mongoose.models.AuditLog || model<IAuditLog>('AuditLog', AuditLogSchema);
