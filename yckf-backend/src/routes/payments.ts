import { Router } from 'express';
import { z } from 'zod';
import { sanity } from '../lib/sanity.js';
import { auditLog } from '../lib/audit.js';

export const router = Router();

router.post('/donate', async (req, res) => {
  const schema = z.object({
    courseId: z.string(),
    amount: z.number().positive(),
    paymentMethod: z.enum(['card','paypal','bank']).or(z.string()),
    donor: z.object({ name: z.string(), email: z.string().email(), phone: z.string().optional() }),
    tier: z.string().optional()
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  // Mock gateway ok
  const transactionId = `txn_${Date.now()}`;

  const enrollment = await sanity.create({
    _type: 'studentEnrollment',
    studentName: parse.data.donor.name,
    studentEmail: parse.data.donor.email,
    studentPhone: parse.data.donor.phone || '',
    course: { _type: 'reference', _ref: parse.data.courseId },
    enrollmentDate: new Date().toISOString(),
    donationAmount: parse.data.amount,
    donationTier: parse.data.tier || 'Custom',
    paymentStatus: 'completed',
    paymentMethod: parse.data.paymentMethod,
    transactionId,
    enrollmentStatus: 'active',
    certificateIssued: false,
  });

  const progress = await sanity.create({
    _type: 'courseProgress',
    enrollment: { _type: 'reference', _ref: enrollment._id },
    course: { _type: 'reference', _ref: parse.data.courseId },
    studentEmail: parse.data.donor.email,
    overallProgress: 0,
    lastAccessed: new Date().toISOString(),
    totalTimeSpent: 0,
    moduleProgress: [],
    certificateEligible: false,
    certificateIssued: false,
  });

  await sanity.create({
    _type: 'paymentLog',
    transactionId,
    paymentMethod: parse.data.paymentMethod,
    amount: parse.data.amount,
    currency: 'USD',
    status: 'completed',
    gateway: 'mock',
    gatewayTransactionId: transactionId,
    enrollment: { _type: 'reference', _ref: enrollment._id },
    user: null,
    course: { _type: 'reference', _ref: parse.data.courseId },
    donationTier: parse.data.tier || 'Custom',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  await auditLog({ action: 'donation_processed', entityType: 'paymentLog', entityId: transactionId, details: { enrollment: enrollment._id, progress: progress._id } });
  res.json({ success: true, enrollmentId: enrollment._id, progressId: progress._id, transactionId });
});


