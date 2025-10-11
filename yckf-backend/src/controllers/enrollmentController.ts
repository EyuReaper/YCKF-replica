
import { Request, Response } from 'express';
import { Enrollment } from '../models/Enrollment'; // Import model

export const enrollmentController = {
  // Create enrollment (called post-payment success)
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, amount, currency } = req.body;
      const userId = (req as any).user.id; // From auth middleware

      // Check if already enrolled
      const existing = await Enrollment.findOne({ userId, courseId });
      if (existing) throw new Error('Already enrolled in this course');

      const newEnrollment = new Enrollment({
        userId,
        courseId,
        amount,
        currency,
        status: 'active',
        enrolledAt: new Date(),
      });

      await newEnrollment.save();
      res.json({ success: true, enrollmentId: newEnrollment._id });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Check enrollment (for learn page access)
  async getByUserAndCourse(req: Request, res: Response): Promise<void> {
    try {
      const { courseId } = req.query;
      const userId = (req as any).user.id; // From auth middleware

      const enrollment = await Enrollment.findOne({ 
        userId, 
        courseId, 
        status: 'active' 
      }).select('-__v'); // Exclude internal fields

      if (!enrollment) {
        res.status(403).json({ success: false, message: 'No active enrollment found' });
        return;
      }

      res.json({ success: true, enrollment });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};