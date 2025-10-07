import { sanity } from './sanity.js';

export async function auditLog(entry: {
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  userEmail?: string;
  userRole?: string;
  status?: 'success' | 'failed' | 'pending';
  details?: any;
  ipAddress?: string;
  userAgent?: string;
}) {
  try {
    await sanity.create({
      _type: 'auditLog',
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId || '',
      userId: entry.userId || '',
      userEmail: entry.userEmail || '',
      userRole: entry.userRole || '',
      status: entry.status || 'success',
      details: entry.details || {},
      ipAddress: entry.ipAddress || '',
      userAgent: entry.userAgent || '',
      timestamp: new Date().toISOString(),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('auditLog error', e);
  }
}


