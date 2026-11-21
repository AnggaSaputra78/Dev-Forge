import express from 'express';
import {
  completeLesson,
  getCourseProgress,
  getProgressOverview,
  updateProjectMilestone,
} from '../controllers/progress.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getProgressOverview);
router.get('/course/:courseId', getCourseProgress);
router.post('/lesson', completeLesson);
router.put('/project/:projectId/milestone', updateProjectMilestone);

export default router;