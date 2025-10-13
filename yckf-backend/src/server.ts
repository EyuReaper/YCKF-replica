
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Router Imports (existing + new)
import { router as authRouter } from './routes/auth.js';
import { router as coursesRouter } from './routes/courses.js';
import { router as paymentsRouter } from './routes/payments.js';
import { router as certificatesRouter } from './routes/certificates.js'; // Note: certs.ts
import { router as adminRouter } from './routes/admin.js';
import { router as enrollmentsRouter } from './routes/enrollments.js'; // New
import { router as progressRouter } from './routes/progress.js'; // New
import { router as botsRouter } from './routes/bots.js'; // New (for bots integration)// Configuration Imports

import { connectDB } from './config/database.js'; // Database connection
import { corsMiddleware } from './config/cors.js'; // CORS setup

// Global Middleware Imports
import { authMiddleware } from './middleware/authMiddleware.js'; // Optional global auth (not applied here; per-route)
import { rateLimitMiddleware } from './middleware/rateLimit.js'; // Assume added for /payments (if implemented)

/**
 * Initializes and starts the Express server.
 * Integrates database, middleware, and routes for full backend structure.
 */
async function startServer() {
  const app = express();

  try {
    // 1. Database Connection: Connect before routes
    await connectDB();
    console.log('✅ Database connected successfully');

    // 2. Security & Core Middleware (global)
    app.use(helmet()); // Security headers
    app.use(corsMiddleware); // CORS from config (handles allowedOrigins)
    app.use(express.json({ limit: '2mb' })); // Body parsing
    app.use(morgan('combined')); // Logging

    // 3. Rate Limiting (global or per-route; example for payments)
    app.use('/payments', rateLimitMiddleware); // Assume rateLimit.js middleware exists

    // 4. Health Check (public)
    app.get('/health', (_req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

    // 5. API Routes (mount under /api for consistency)
    app.use('/api/auth', authRouter);
    app.use('/api/courses', coursesRouter);
    app.use('/api/payments', paymentsRouter);
    app.use('/api/certificates', certificatesRouter);
    app.use('/api/admin', adminRouter);
    app.use('/api/enrollments', enrollmentsRouter); // New: Enrollment management
    app.use('/api/progress', progressRouter); // New: Progress tracking
    app.use('/api/bots', botsRouter); // New: Bot webhooks (WhatsApp/Telegram)

    // 6. Global Error Handler (catches unhandled errors)
    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).json({ success: false, message: 'Internal server error' });
    });

    // 7. 404 Handler (after routes)
    app.use('*', (_req, res) => {
      res.status(404).json({ success: false, message: 'Endpoint not found' });
    });

    // 8. Server Start
    const port = parseInt(process.env.PORT || '4000', 10);
    app.listen(port, () => {
      console.log(`🚀 yckf-backend running on port ${port}`);
    });

  } catch (error: any) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
}

// Execute initialization
startServer();