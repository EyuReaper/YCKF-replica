import { Router } from 'express';
import { requireRole } from '../lib/auth.js';
import { client } from '../../lib/sanity.client';
export const router = Router();

router.get('/analytics', requireRole(['master_admin','secondary_admin']), async (_req, res) => {
  const [users, courses, enrollments, payments] = await Promise.all([
    sanity.fetch('count(*[_type == "user"])'),
    sanity.fetch('count(*[_type == "premiumTraining"])'),
    sanity.fetch('count(*[_type == "studentEnrollment"])'),
    sanity.fetch('count(*[_type == "paymentLog"])'),
  ]);
  res.json({ success: true, overview: { users, courses, enrollments, payments } });
});


