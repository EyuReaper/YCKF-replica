import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { router as authRouter } from './routes/auth.js';
import { router as coursesRouter } from './routes/courses.js';
import { router as paymentsRouter } from './routes/payments.js';
import { router as certificatesRouter } from './routes/certificates.js';
import { router as adminRouter } from './routes/admin.js';

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(',') || '*', credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('combined'));

app.get('/health', (_req, res) => res.json({ ok: true }));

app.use('/auth', authRouter);
app.use('/courses', coursesRouter);
app.use('/payments', paymentsRouter);
app.use('/certificates', certificatesRouter);
app.use('/admin', adminRouter);

const port = parseInt(process.env.PORT || '4000', 10);
app.listen(port, () => {
  console.log(`yckf-backend running on port ${port}`);
});


