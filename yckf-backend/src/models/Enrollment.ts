
import mongoose, { Schema, Document } from 'mongoose';

interface IEnrollment extends Document {
  userId: string;
  courseId: string; // Sanity _ref or Mongo ID
  amount: number;
  currency: 'GHS' | 'USD';
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  enrolledAt: Date;
  completedAt?: Date;
}

const EnrollmentSchema: Schema = new Schema<IEnrollment>({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 50 },
  currency: { type: String, enum: ['GHS', 'USD'], default: 'GHS', required: true },
  status: { type: String, enum: ['pending', 'active', 'expired', 'cancelled'], default: 'pending', required: true },
  enrolledAt: { type: Date, default: Date.now, required: true },
  completedAt: { type: Date },
}, {
  timestamps: true,
});

export const Enrollment = mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema);