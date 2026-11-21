import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import ChallengeSubmission from '../models/ChallengeSubmission.js';
import asyncHandler from '../utils/asyncHandler.js';

const router = express.Router();

// @desc    Ambil riwayat submission pengguna
// @route   GET /api/submissions
// @access  Privat
router.use(protect);

router.get('/', asyncHandler(async (req, res) => {
  const { challengeId, limit = 50 } = req.query;

  const filter = { user: req.user._id };
  if (challengeId) filter.challenge = challengeId;

  const submissions = await ChallengeSubmission.find(filter)
    .populate('challenge', 'title difficulty points')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({
    success: true,
    count: submissions.length,
    data: submissions,
  });
}));

// @desc    Ambil detail satu submission
// @route   GET /api/submissions/:id
// @access  Privat
router.get('/:id', asyncHandler(async (req, res) => {
  const submission = await ChallengeSubmission.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('challenge');

  if (!submission) {
    res.status(404);
    throw new Error('Submission tidak ditemukan');
  }

  res.json({ success: true, data: submission });
}));

export default router;