
import mongoose, { Schema, Document } from 'mongoose';

interface IPaymentLog extends Document {
  userId: string;
  courseId: string;
  amount: number;
  currency: 'GHS' | 'USD';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'mobile_money' | 'paypal';
  gatewayResponse: {
    transactionId: string;
    // Add more gateway-specific fields as needed
  };
  metadata: {
    notes?: string;
    exchangeRate?: number; // For conversions
    ipAddress?: string;
  };
  timestamp: Date;
}

const PaymentLogSchema: Schema = new Schema<IPaymentLog>({
  userId: { type: String, required: true, index: true },
  courseId: { type: String, required: true, index: true },
  amount: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['GHS', 'USD'], required: true },
  status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending', required: true },
  paymentMethod: { type: String, enum: ['card', 'mobile_money', 'paypal'], required: true },
  gatewayResponse: {
    transactionId: { type: String, required: true },
  },
  metadata: {
    notes: { type: String },
    exchangeRate: { type: Number },
    ipAddress: { type: String },
  },
  timestamp: { type: Date, default: Date.now, required: true },
}, {
  timestamps: true,
});

export const PaymentLog = mongoose.model<IPaymentLog>('PaymentLog', PaymentLogSchema);