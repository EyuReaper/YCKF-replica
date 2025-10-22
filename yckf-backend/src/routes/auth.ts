import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { sanity } from '../lib/sanity.client.js';
import { Auth } from '../lib/auth.js';
import { auditLog } from '../lib/audit.js';

export const router = Router();

router.post('/register', async (req, res) => {
  const schema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const existing = await Auth.findUserByEmail(parse.data.email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const hash = await Auth.hash(parse.data.password);
  const emailToken = jwt.sign({ email: parse.data.email }, process.env.JWT_SECRET || 'change-me', { expiresIn: '24h' });

  const user = await sanity.create({
    _type: 'user',
    name: parse.data.name,
    email: parse.data.email,
    password: hash,
    role: 'student',
    isActive: true,
    emailVerified: false,
    emailVerificationToken: emailToken,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  const token = Auth.sign({ userId: user._id, email: user.email, role: user.role });
  await auditLog({ action: 'user_registration', entityType: 'user', entityId: user._id, userId: user._id, userEmail: user.email, userRole: user.role });
  return res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const user = await Auth.findUserByEmail(parse.data.email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const ok = await Auth.compare(parse.data.password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

  await sanity.patch(user._id).set({ lastLogin: new Date().toISOString() }).commit();
  const token = Auth.sign({ userId: user._id, email: user.email, role: user.role });
  await auditLog({ action: 'user_login', entityType: 'user', entityId: user._id, userId: user._id, userEmail: user.email, userRole: user.role });
  return res.json({ success: true, user: { _id: user._id, name: user.name, email: user.email, role: user.role }, token });
});

router.post('/forgot-password', async (req, res) => {
  const schema = z.object({ email: z.string().email() });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const user = await Auth.findUserByEmail(parse.data.email);
  if (user) {
    const resetToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET || 'change-me', { expiresIn: '1h' });
    await sanity.patch(user._id).set({ passwordResetToken: resetToken, passwordResetExpires: new Date(Date.now()+3600000).toISOString() }).commit();
    await auditLog({ action: 'password_reset_request', entityType: 'user', entityId: user._id, userId: user._id, userEmail: user.email, userRole: user.role });
  }
  return res.json({ success: true, message: 'If the email exists, a reset link will be sent.' });
});

router.post('/reset-password', async (req, res) => {
  const schema = z.object({ token: z.string(), password: z.string().min(8) });
  const parse = schema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  try {
    const decoded = jwt.verify(parse.data.token, process.env.JWT_SECRET || 'change-me') as any;
    const user = await sanity.fetch(`*[_type == "user" && _id == $id && passwordResetToken == $t][0]`, { id: decoded.userId, t: parse.data.token });
    if (!user) return res.status(400).json({ error: 'Invalid token' });
    if (user.passwordResetExpires && new Date() > new Date(user.passwordResetExpires)) return res.status(400).json({ error: 'Token expired' });
    const hash = await Auth.hash(parse.data.password);
    await sanity.patch(user._id).set({ password: hash, passwordResetToken: null, passwordResetExpires: null }).commit();
    await auditLog({ action: 'password_reset', entityType: 'user', entityId: user._id, userId: user._id, userEmail: user.email, userRole: user.role });
    return res.json({ success: true });
  } catch {
    return res.status(400).json({ error: 'Invalid token' });
  }
});


