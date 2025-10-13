// src/routes/bots.ts

import { Router } from 'express';
import twilio from 'twilio'; // From deps
import TelegramBot from 'node-telegram-bot-api'; // From deps
import { processBotMessage } from '../services/botService.js'; // From services
import { auditLog } from '../lib/audit.js'; // From lib

const router = Router();
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// WhatsApp webhook (Twilio)
router.post('/whatsapp', async (req, res) => {
  try {
    const { From, Body } = req.body; // Twilio payload
    const userId = From.replace('whatsapp:', ''); // Phone as userId

    await auditLog({
      action: 'whatsapp_webhook_received',
      entityType: 'bot',
      userId,
      details: { body: Body },
      status: 'pending',
      ipAddress: req.ip,
    });

    const response = await processBotMessage(Body, userId, 'whatsapp');

    // Respond via Twilio
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message(response);
    res.type('text/xml');
    res.send(twiml.toString());

    await auditLog({
      action: 'whatsapp_response_sent',
      entityType: 'bot',
      userId,
      details: { response },
      status: 'success',
    });
  } catch (error: any) {
    console.error('WhatsApp webhook error:', error);
    res.status(500).send('Error processing message');
  }
});

// Telegram webhook
router.post('/telegram', async (req, res) => {
  try {
    const { message } = req.body; // Telegram update
    if (!message) return res.sendStatus(200); // ACK empty

    const { from, text } = message;
    const userId = from.id.toString(); // Telegram user ID

    await auditLog({
      action: 'telegram_webhook_received',
      entityType: 'bot',
      userId,
      details: { text },
      status: 'pending',
      ipAddress: req.ip,
    });

    const response = await processBotMessage(text, userId, 'telegram');

    // Send reply via Telegram Bot API
    const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });
    await bot.sendMessage(from.id, response);

    await auditLog({
      action: 'telegram_response_sent',
      entityType: 'bot',
      userId,
      details: { response },
      status: 'success',
    });

    res.sendStatus(200);
  } catch (error: any) {
    console.error('Telegram webhook error:', error);
    res.status(500).send('Error processing message');
  }
});

export default router;