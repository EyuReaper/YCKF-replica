
import { Router } from 'express';
import { enrollmentController } from '../controllers/enrollmentController.js'; // From controllers
import { authMiddleware } from '../middleware/authMiddleware.js'; // From middleware
import { auditLog } from '../lib/audit.js'; // From lib
import { Enrollment } from '../models/Enrollment.js'; // From models

const router = Router();

// Create enrollment (post-payment – protected)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    await auditLog({
      action: 'enrollment_create',
      entityType: 'enrollment',
      userId,
      details: req.body,
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Delegate to controller (handles creation, duplicates check)
    enrollmentController.create(req, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get enrollments by user/course (for access check – protected)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    await auditLog({
      action: 'enrollment_check',
      entityType: 'enrollment',
      userId,
      details: req.query,
      status: 'success',
    });

    // Delegate to controller (queries active enrollments)
    enrollmentController.getByUserAndCourse(req, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// List user's enrollments (protected)
router.get('/my-enrollments', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const enrollments = await Enrollment.find({ userId, status: 'active' })
      .populate('courseId', 'title') // Assuming courseId refs Course model
      .sort({ enrolledAt: -1 });
    res.json({ success: true, enrollments });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;