// src/services/paymentGatewayService.ts

import Stripe from 'stripe';
import Paystack from 'paystack'; // npm i paystack
import Flutterwave from 'flutterwave-node-v3'; // npm i flutterwave-node-v3
import { PaymentLog } from '../models/PaymentLog.js'; // From models
import { getExchangeRate } from './exchangeRateService.js'; // From services

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2024-06-20' });
const paystack = Paystack(process.env.PAYSTACK_SECRET_KEY || '');
const flw = new Flutterwave(process.env.FLUTTERWAVE_PUBLIC_KEY || '', process.env.FLUTTERWAVE_SECRET_KEY || '');

interface PaymentOptions {
  amount: number;
  currency: 'GHS' | 'USD';
  paymentMethod: 'card' | 'mobile_money';
  email: string;
  phone?: string; // For mobile_money
  metadata?: Record<string, any>;
}

export async function createPaymentIntent(options: PaymentOptions, userId: string, courseId: string): Promise<{ clientSecret?: string; reference?: string; url?: string }> {
  const { amount, currency, paymentMethod, email, phone, metadata } = options;

  // Log initial payment (pending)
  const log = new PaymentLog({
    userId,
    courseId,
    amount,
    currency,
    status: 'pending',
    paymentMethod,
    metadata: { ...metadata, exchangeRate: currency === 'USD' ? await getExchangeRate('USD', 'GHS') : undefined },
  });
  await log.save();

  let result;
  switch (paymentMethod) {
    case 'card':
      // Stripe for Visa/MC (supports GHS/USD)
      result = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Cents
        currency: currency.toLowerCase(),
        customer_email: email,
        metadata: { userId, courseId, phone, ...metadata },
      });
      return { clientSecret: result.client_secret };

    case 'mobile_money':
      if (!phone) throw new Error('Phone required for mobile money');
      // Paystack for MTN/Telecel (GHS focus)
      result = await paystack.transaction.initialize({
        amount: amount * 100, // Kobo
        email,
        channels: ['mobile_money_ghana'],
        currency: currency.toLowerCase(),
        metadata: { custom_fields: [{ display_name: 'Phone', variable_name: 'phone', value: phone }], ...metadata },
      });
      return { reference: result.data.reference };

    default:
      // Flutterwave fallback (for other methods)
      result = await flw.Charge.mobile_money({
        amount,
        currency,
        country: 'GH', // Ghana
        email,
        tx_ref: `flw_${Date.now()}`,
        phone_number: phone || '',
        payment_options: 'mobilemoney',
        meta: { userId, courseId, ...metadata },
      });
      return { reference: result.data.tx_ref, url: result.data.link };
  }
}