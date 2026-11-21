import express from 'express';
import {
  getChallenges,
  getChallenge,
  submitSolution,
  createChallenge,
  updateChallenge,
  deleteChallenge,
} from '../controllers/challenge.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publik
router.get('/', getChallenges);

// Privat
router.get('/:id', protect, getChallenge);
router.post('/:id/submit', protect, submitSolution);

// Admin
router.post('/', protect, authorize('admin'), createChallenge);
router.put('/:id', protect, authorize('admin'), updateChallenge);
router.delete('/:id', protect, authorize('admin'), deleteChallenge);

export default router;