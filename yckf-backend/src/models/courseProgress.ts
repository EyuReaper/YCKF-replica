
import mongoose, { Schema, Document } from 'mongoose';

interface ILessonProgress {
  lessonTitle: string;
  completed: boolean;
  completionDate?: Date;
  timeSpent: number; // Minutes
}

interface IModuleProgress {
  moduleTitle: string;
  moduleId: string;
  completed: boolean;
  completionDate?: Date;
  progressPercentage: number;
  lessonProgress: ILessonProgress[];
}

interface ICourseProgress extends Document {
  enrollmentId: string; // Ref to Enrollment
  overallProgress: number; // 0-100
  moduleProgress: IModuleProgress[];
  totalTimeSpent: number; // Total minutes
  certificateEligible: boolean;
  certificateIssued: boolean;
  lastAccessed: Date;
}

const CourseProgressSchema: Schema = new Schema<ICourseProgress>({
  enrollmentId: { type: Schema.Types.ObjectId, ref: 'Enrollment', required: true, index: true },
  overallProgress: { type: Number, default: 0, min: 0, max: 100 },
  moduleProgress: [{
    moduleTitle: { type: String, required: true },
    moduleId: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completionDate: { type: Date },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    lessonProgress: [{
      lessonTitle: { type: String, required: true },
      completed: { type: Boolean, default: false },
      completionDate: { type: Date },
      timeSpent: { type: Number, default: 0, min: 0 },
    }],
  }],
  totalTimeSpent: { type: Number, default: 0, min: 0 },
  certificateEligible: { type: Boolean, default: false },
  certificateIssued: { type: Boolean, default: false },
  lastAccessed: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export const CourseProgress = mongoose.model<ICourseProgress>('CourseProgress', CourseProgressSchema);