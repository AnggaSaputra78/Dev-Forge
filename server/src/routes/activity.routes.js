import express from 'express';
import { getActivities, getActivitySummary } from '../controllers/activity.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.get('/summary', getActivitySummary);

export default router;