import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/db';

import publicRoutes from './routes/publicRoutes';
import authRoutes from './routes/authRoutes';
import adminRoutes from './routes/adminRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database (Configured for 500 concurrent users pool)
connectDB();

// Security & Optimization Middlewares
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// Global Rate Limiting for 500 Concurrent Users Protection
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per window
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests, please try again later.' },
  },
});
app.use('/api/', globalLimiter);

// Public & Admin API Routes
app.use('/api/v1', publicRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);


// Auth Rate Limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: { code: 'AUTH_RATE_LIMIT', message: 'Too many authentication attempts, please wait 15 minutes.' },
  },
});
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);

// Health Check Endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'UP',
    brand: 'Merald Group Enterprise API',
    timestamp: new Date().toISOString(),
  });
});

// Base Route Response
app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({
    message: 'Merald Group API Baseline Ready',
    version: '1.0.0',
    documentation: '/docs',
  });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 [Server] Merald Group Express API running on port ${PORT}`);
});

export default app;
