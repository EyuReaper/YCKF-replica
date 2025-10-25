import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

//  Router Imports
import { router as authRouter } from './routes/auth.js';
import { router as coursesRouter } from './routes/courses.js';
import   paymentsRouter  from './routes/payments.js';
import { router as certificatesRouter } from './routes/certificates.js';
import { router as adminRouter } from './routes/admin.js';
import  enrollmentsRouter  from './routes/enrollments.js';
import   progressRouter  from './routes/progress.js';
import botsRouter from './routes/bots.js';
import { sanity }  from './lib/sanity.client.js';

//  Config Imports
import { connectDB } from './config/database.js';
import { corsMiddleware } from './config/cors.js';

//  Middleware Imports
import { authMiddleware } from './middleware/authMiddleware.js';
import { rateLimitMiddleware } from './middleware/rateLimit.js';
import mongoose from 'mongoose';

console.log('SANITY_PROJECT_ID from env:', process.env.SANITY_PROJECT_ID); // Debugging line

//  Verification logs (helpful for debugging)
console.log('Twilio SID:', process.env.TWILIO_ACCOUNT_SID ? '✅ Set' : '❌ Missing');
console.log('Telegram Token:', process.env.TELEGRAM_BOT_TOKEN ? '✅ Set' : '❌ Missing');

/**
 * Initializes and starts the Express server.
 */
async function startServer() {
  const app = express();

  try {
    //  Connect to Database
    await connectDB();
    console.log('✅ Database connected successfully');

    //  Apply Global Middleware
    app.use(helmet());
    app.use(corsMiddleware || cors()); // fallback to default CORS if custom config missing
    app.use(express.json({ limit: '2mb' }));
    app.use(morgan('combined'));

    //  Optional Rate Limiter (example: payments)
    if (rateLimitMiddleware) app.use('/api/payments', rateLimitMiddleware);

    //  Health Check Route
    app.get('/health', (_req:express.Request, res:express.Response) =>
      res.json({ ok: true, timestamp: new Date().toISOString() })
    );

    //  API Routes
    app.use('/api/auth', authRouter);
    app.use('/api/courses', coursesRouter);
    app.use('/api/payments', paymentsRouter);
    app.use('/api/certificates', certificatesRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/enrollments', enrollmentsRouter);
    app.use('/api/progress', progressRouter);
    app.use('/api/bots', botsRouter);

        // Simple DB test endpoint
    app.get('/test-db', async (req: express.Request, res: express.Response) => {
      try {
        const db = mongoose.connection.db;
        if (!db) {
          return res.status(500).json({ connected: false, error: 'Database connection not available' });
        }

        const count = await db.collection('users').countDocuments();
        return res.json({ connected: true, collectionCount: count });
      } catch (error: unknown) {
        const err = error as Error;
        return res.status(500).json({ connected: false, error: err.message });
      }
    });

    //  404 Handler (AFTER routes)
    app.use('*', (_req:express.Request, res:express.Response) =>
      res.status(404).json({ success: false, message: 'Endpoint not found' })
    );

    //  Global Error Handler
    app.use((err:Error, _req:express.Request, res:express.Response, _next:express.NextFunction) => {
      console.error('❌ Unhandled error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });

    //  Start Server
    const port = Number(process.env.PORT) || 4000;
    app.listen(port, () => {
      console.log(`🚀 yckf-backend running on port ${port}`);
    });
  } catch (error: unknown) {
    const err = error as Error; //type assertion for better error handling
    console.error('💥 Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
