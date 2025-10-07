import { Router } from 'express';
import PDFDocument from 'pdfkit';
import { z } from 'zod';
import { sanity } from '../lib/sanity.js';
import { requireRole } from '../lib/auth.js';
import { auditLog } from '../lib/audit.js';

export const router = Router();

router.post('/generate', requireRole(['student','secondary_admin','master_admin']), async (req: any, res) => {
  const schema = z.object({ progressId: z.string() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const progress = await sanity.fetch(`*[_type == "courseProgress" && _id == $id][0]`, { id: parse.data.progressId });
  if (!progress) return res.status(404).json({ error: 'Progress not found' });
  if (progress.certificateIssued) return res.status(400).json({ error: 'Certificate already issued' });
  if (!progress.certificateEligible) return res.status(400).json({ error: 'Not eligible' });

  const enrollment = await sanity.fetch(`*[_type == "studentEnrollment" && _id == $id][0]`, { id: progress.enrollment._ref });
  const course = await sanity.fetch(`*[_type == "premiumTraining" && _id == $id][0]`, { id: progress.course._ref });

  const certificateId = `CERT-${Date.now()}`;
  const verificationCode = Math.random().toString(36).slice(2, 10).toUpperCase();

  await sanity.patch(progress._id).set({ certificateIssued: true, certificateId, verificationCode, certificateUrl: `mock://${certificateId}` }).commit();
  await sanity.patch(enrollment._id).set({ certificateIssued: true, certificateId, certificateUrl: `mock://${certificateId}` }).commit();

  await auditLog({ action: 'certificate_generated', entityType: 'courseProgress', entityId: progress._id, userId: req.user.userId, userEmail: req.user.email, userRole: req.user.role });

  // Simple generated PDF streamed back (mock)
  res.setHeader('Content-Type', 'application/pdf');
  const doc = new PDFDocument();
  doc.pipe(res);
  doc.fontSize(24).text('Certificate of Completion', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`This certifies that ${enrollment.studentName}`, { align: 'center' });
  doc.text(`has completed the course ${course.title}`, { align: 'center' });
  doc.moveDown();
  doc.text(`Certificate ID: ${certificateId}`, { align: 'center' });
  doc.text(`Verification Code: ${verificationCode}`, { align: 'center' });
  doc.end();
});

router.get('/verify/:certificateId', async (req, res) => {
  const { certificateId } = req.params;
  const progress = await sanity.fetch(`*[_type == "courseProgress" && certificateId == $cid][0]`, { cid: certificateId });
  if (!progress) return res.status(404).json({ valid: false });
  res.json({ valid: true, certificateId, url: progress.certificateUrl });
});


