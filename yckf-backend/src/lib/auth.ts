
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { sanity } from './sanity.client.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required'); // Fixed: Early env check
}

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '12'); // Fixed: Configurable salt

export type Role = 'student' | 'secondary_admin' | 'master_admin';

export const Auth = {
  sign(payload: { userId: string; email: string; role: Role }) {
    return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
  },
  verify(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; email: string; role: Role };
  },
  async hash(password: string) {
    return bcrypt.hash(password, SALT_ROUNDS); // Fixed: Use configurable rounds
  },
  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
  async findUserByEmail(email: string) {
    return sanity.fetch(`*[_type == "user" && email == $email][0]`, { email });
  },
};

export function requireRole(required: Role[]) {
  return (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
      if (!token) return res.status(401).json({ error: 'Missing token' });
      const decoded = Auth.verify(token);
      if (!required.includes(decoded.role)) return res.status(403).json({ error: 'Forbidden' });
      req.user = decoded;
      next();
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}