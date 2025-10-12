
import { Router } from 'express';
import { CourseProgress } from '../models/CourseProgress.js'; // From models
import { authMiddleware } from '../middleware/authMiddleware.js'; // From middleware
import { auditLog } from '../lib/audit.js'; // From lib
import { Enrollment } from '../models/Enrollment.js'; // From models (for verification)

const router = Router();

// Update progress (mark lesson/module – protected)
router.put('/:enrollmentId', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { enrollmentId } = req.params;
    const updates = req.body; // { moduleIndex, lessonIndex, timeSpent, completed }

    // Verify enrollment belongs to user
    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Unauthorized enrollment' });

    const progress = await CourseProgress.findOneAndUpdate(
      { enrollmentId },
      { 
        ...updates, 
        lastAccessed: new Date(),
        // Recalculate overallProgress (simplified – enhance in controller if needed)
      },
      { new: true, upsert: true }
    );

    await auditLog({
      action: 'progress_update',
      entityType: 'courseProgress',
      userId,
      entityId: enrollmentId,
      details: updates,
      status: 'success',
    });

    res.json({ success: true, progress });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get progress for enrollment (protected)
router.get('/:enrollmentId', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { enrollmentId } = req.params;

    // Verify enrollment
    const enrollment = await Enrollment.findOne({ _id: enrollmentId, userId });
    if (!enrollment) return res.status(403).json({ success: false, message: 'Unauthorized' });

    const progress = await CourseProgress.findOne({ enrollmentId });
    res.json({ success: true, progress: progress || { overallProgress: 0, totalTimeSpent: 0 } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;