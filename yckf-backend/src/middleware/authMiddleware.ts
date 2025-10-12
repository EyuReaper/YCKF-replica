
import { Request, Response, NextFunction } from 'express';
import { Auth, requireRole } from '../lib/auth.js'; // Import from lib

// Basic auth middleware (verify token, attach user)
export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Missing or invalid authorization header' });
    }

    const token = authHeader.slice(7);
    const decoded = Auth.verify(token);
    (req as any).user = decoded; // Attach user to req
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

// Role-based middleware (wraps requireRole from lib)
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: 'Insufficient permissions' });
    }
    next();
  };
};