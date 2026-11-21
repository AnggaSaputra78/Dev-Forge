import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

dotenv.config();

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import learningPathRoutes from './routes/learningPath.routes.js';
import moduleRoutes from './routes/module.routes.js';
import lessonRoutes from './routes/lesson.routes.js';
import progressRoutes from './routes/progress.routes.js';
import challengeRoutes from './routes/challenge.routes.js';
import submissionRoutes from './routes/submission.routes.js';
import projectRoutes from './routes/project.routes.js';
import assessmentRoutes from './routes/assessment.routes.js';
import activityRoutes from './routes/activity.routes.js';
import mentorRoutes from './routes/mentor.routes.js';
import adminRoutes from './routes/admin.routes.js';

import { errorHandler, notFound } from './middleware/error.middleware.js';

const app = express();

// Keamanan
app.use(helmet({ contentSecurityPolicy: false }));

app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'].filter(Boolean),
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Terlalu banyak permintaan, coba lagi nanti' },
});
app.use('/api/', limiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', waktu: new Date().toISOString(), versi: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/learning-paths', learningPathRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/mentor', mentorRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;