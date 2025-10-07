import { Router } from 'express';
import { z } from 'zod';
import { sanity } from '../lib/sanity.js';
import { requireRole } from '../lib/auth.js';
import { auditLog } from '../lib/audit.js';

export const router = Router();

router.get('/', async (_req, res) => {
  const courses = await sanity.fetch(`*[_type == "premiumTraining"] | order(featured desc, _createdAt desc)`);
  res.json({ success: true, courses });
});

router.post('/', requireRole(['master_admin','secondary_admin']), async (req: any, res) => {
  const schema = z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    instructor: z.string().min(2),
    duration: z.string().min(1),
    level: z.enum(['beginner','intermediate','advanced']).or(z.string()),
    category: z.string().min(2),
    modules: z.array(z.any()).optional(),
    donationTiers: z.array(z.any()).optional(),
    minDonationAmount: z.number().optional(),
    maxDonationAmount: z.number().optional(),
    suggestedDonationAmount: z.number().optional(),
    featured: z.boolean().optional(),
  });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const course = await sanity.create({ _type: 'premiumTraining', ...parse.data, isActive: true, slug: { _type: 'slug', current: parse.data.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'') } });
  await auditLog({ action: 'course_created', entityType: 'premiumTraining', entityId: course._id, userId: req.user.userId, userEmail: req.user.email, userRole: req.user.role });
  res.json({ success: true, course });
});

router.put('/:id', requireRole(['master_admin','secondary_admin']), async (req: any, res) => {
  const { id } = req.params;
  const before = await sanity.fetch(`*[_type == "premiumTraining" && _id == $id][0]`, { id });
  if (!before) return res.status(404).json({ error: 'Not found' });
  const updated = await sanity.patch(id).set({ ...req.body, _updatedAt: new Date().toISOString() }).commit();
  await auditLog({ action: 'course_updated', entityType: 'premiumTraining', entityId: id, userId: req.user.userId, userEmail: req.user.email, userRole: req.user.role, details: { before, after: updated } });
  res.json({ success: true, course: updated });
});

router.delete('/:id', requireRole(['master_admin']), async (req: any, res) => {
  const { id } = req.params;
  const before = await sanity.fetch(`*[_type == "premiumTraining" && _id == $id][0]`, { id });
  if (!before) return res.status(404).json({ error: 'Not found' });
  const enrollments = await sanity.fetch(`count(*[_type == "studentEnrollment" && course._ref == $id && enrollmentStatus == "active"])`, { id });
  if (enrollments > 0) return res.status(400).json({ error: 'Active enrollments exist. Deactivate instead.' });
  await sanity.delete(id);
  await auditLog({ action: 'course_deleted', entityType: 'premiumTraining', entityId: id, userId: req.user.userId, userEmail: req.user.email, userRole: req.user.role, details: { before } });
  res.json({ success: true });
});


