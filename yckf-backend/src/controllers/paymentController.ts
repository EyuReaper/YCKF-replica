
import { Request, Response } from 'express';
import Stripe from 'stripe';
import Paystack from 'paystack'; // Assume installed as 'paystack-node'
import { Enrollment } from '../models/Enrollment'; // Import model
import { PaymentLog } from '../models/PaymentLog'; // Import model
import { getExchangeRate } from '../services/exchangeRateService';
import { authMiddleware } from '../middleware/authMiddleware'; // For user from req

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY || '');

export const paymentController = {
  async donate(req: Request, res: Response): Promise<void> {
    try {
      const { courseId, amount, currency = 'GHS', paymentMethod, phone } = req.body;
      const userId = (req as any).user.id; // From auth middleware

      // Validation (re-validate frontend inputs)
      if (amount < 50) throw new Error('Minimum donation is 50 GHS equivalent');
      if (currency === 'USD') {
        const rate = await getExchangeRate('USD', 'GHS');
        if (amount * rate > 100) throw new Error('Maximum donation is 100 GHS equivalent');
      }
      if (paymentMethod === 'mobile_money' && !phone) throw new Error('Phone required for mobile money');

      let paymentIntent;
      if (paymentMethod === 'card') {
        // Stripe for Visa/MC
        paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Cents
          currency: currency.toLowerCase(),
          metadata: { courseId, userId, phone },
        });
      } else if (paymentMethod === 'mobile_money') {
        // Paystack for MTN/Telecel
        paymentIntent = await paystack.transaction.initialize({
          amount: amount * 100, // Kobo
          email: req.body.donor.email, // From frontend
          channels: ['mobile_money_ghana'], // Ghana-specific
          metadata: { custom_fields: [{ display_name: 'Phone', variable_name: 'phone', value: phone }] },
        });
      }

      // Log payment (before confirmation)
      await new PaymentLog({
        userId,
        courseId,
        amount,
        currency,
        status: 'pending',
        paymentMethod,
        metadata: { exchangeRate: await getExchangeRate(currency, 'GHS') },
      }).save();

      res.json({ success: true, clientSecret: paymentIntent.client_secret || paymentIntent.data.reference });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Webhook handler for payment confirmation (call from routes/webhooks.ts)
  async webhook(req: Request, res: Response): Promise<void> {
    const sig = req.headers['stripe-signature'] || ''; // For Stripe; adapt for Paystack
    let event;

    try {
      if (req.body.type === 'payment_intent.succeeded') { // Stripe example
        event = req.body;
        const paymentIntent = event.data.object;
        // Create enrollment on success
        await new Enrollment({
          userId: paymentIntent.metadata.userId,
          courseId: paymentIntent.metadata.courseId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          status: 'active',
        }).save();

        // Update payment log
        await PaymentLog.findOneAndUpdate(
          { transactionId: paymentIntent.id },
          { status: 'success' }
        );
      }
      res.json({ received: true });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  },
};