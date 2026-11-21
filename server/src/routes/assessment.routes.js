import express from 'express';
import {
  getAssessments,
  getAssessment,
  submitAttempt,
  createAssessment,
  deleteAssessment,
} from '../controllers/assessment.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getAssessments);
router.get('/:id', getAssessment);
router.post('/:id/submit', submitAttempt);

// Admin
router.post('/', authorize('admin'), createAssessment);
router.delete('/:id', authorize('admin'), deleteAssessment);

export default router;