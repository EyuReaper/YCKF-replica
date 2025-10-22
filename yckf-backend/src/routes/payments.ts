// src/routes/payments.ts

import { Router } from 'express';
import { paymentController } from '../controllers/paymentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validate, paymentSchema } from '../middleware/validationMiddleware.js';
import { auditLog } from '../lib/audit.js';
import { PaymentLog, Enrollment } from '../models/PaymentLog.js';

const router = Router();

// Donate (main endpoint – protected)
router.post('/donate', authMiddleware, validate(paymentSchema), async (req, res) => {
  try {
    const userId = (req as any).user.id;
    await auditLog({
      action: 'payment_donate_start',
      entityType: 'payment',
      userId,
      details: req.body,
      status: 'pending',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
    });

    // Delegate to controller (handles gateway, logging, enrollment)
    paymentController.donate(req, res);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Webhook (public – for gateway callbacks, no auth)
router.post('/webhook', (req, res) => {
  try {
    // Verify signature if Stripe (adapt for Paystack)
    const sig = req.headers['stripe-signature'] || '';
    // stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || ''); // Uncomment for prod

    paymentController.webhook(req, res); // Processes event, updates status/enrollment
  } catch (error: any) {
    res.status(400).json({ success: false, message: 'Webhook error' });
  }
});

export default router;