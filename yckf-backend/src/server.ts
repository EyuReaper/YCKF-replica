import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// 🧭 Router Imports
import { router as authRouter } from './routes/auth.js';
import { router as coursesRouter } from './routes/courses.js';
import { router as paymentsRouter } from './routes/payments.js';
import { router as certificatesRouter } from './routes/certificates.js';
import { router as adminRouter } from './routes/admin.js';
import { router as enrollmentsRouter } from './routes/enrollments.js';
import { router as progressRouter } from './routes/progress.js';
import { router as botsRouter } from './routes/bots.js';

// ⚙️ Config Imports
import { connectDB } from './config/database.js';
import { corsMiddleware } from './config/cors.js';

// 🛡️ Middleware Imports
import { authMiddleware } from './middleware/authMiddleware.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';

// 🧩 Verification logs (helpful for debugging)
console.log('Twilio SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('Telegram Token:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing');

/**
 * Initializes and starts the Express server.
 */
async function startServer() {
  const app = express();

  try {
    // 1️⃣ Connect to Database
    await connectDB();
    console.log('✅ Database connected successfully');

    // 2️⃣ Apply Global Middleware
    app.use(helmet());
    app.use(corsMiddleware || cors()); // fallback to default CORS if custom config missing
    app.use(express.json({ limit: '2mb' }));
    app.use(morgan('combined'));

    // 3️⃣ Optional Rate Limiter (example: payments)
    if (rateLimitMiddleware) app.use('/api/payments', rateLimitMiddleware);

    // 4️⃣ Health Check Route
    app.get('/health', (_req, res) =>
      res.json({ ok: true, timestamp: new Date().toISOString() })
    );

    // 5️⃣ API Routes
    app.use('/api/auth', authRouter);
    app.use('/api/courses', coursesRouter);
    app.use('/api/payments', paymentsRouter);
    app.use('/api/certificates', certificatesRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/enrollments', enrollmentsRouter);
    app.use('/api/progress', progressRouter);
    app.use('/api/bots', botsRouter);

    // 6️⃣ 404 Handler (AFTER routes)
    app.use('*', (_req, res) =>
      res.status(404).json({ success: false, message: 'Endpoint not found' })
    );

    // 7️⃣ Global Error Handler
    app.use((err, _req, res, _next) => {
      console.error('❌ Unhandled error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });

    // 8️⃣ Start Server
    const port = Number(process.env.PORT) || 4000;
    app.listen(port, () => {
      console.log(`🚀 yckf-backend running on port ${port}`);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
