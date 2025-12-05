import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './middleware/error';
import { CORS_ORIGIN } from './config/constants';
import authRoutes from './routes/auth.routes';
import projectsRoutes from './routes/projects.routes';
import submissionsRoutes from './routes/submissions.routes';
import reviewsRoutes from './routes/reviews.routes';
import canonRoutes from './routes/canon.routes';

const app = express();

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api', submissionsRoutes);
app.use('/api', reviewsRoutes);
app.use('/api', canonRoutes);

// Health check
app.get('/health', (req, res) => res.json({ ok: true, timestamp: new Date().toISOString() }));

// Error handler (must be last)
app.use(errorHandler);

export default app;