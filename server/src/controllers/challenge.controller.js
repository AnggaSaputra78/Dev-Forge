import CodingChallenge from '../models/CodingChallenge.js';
import ChallengeSubmission from '../models/ChallengeSubmission.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';
import { executeCode } from '../services/codeExecutor.service.js';

// @desc    Ambil semua tantangan
// @route   GET /api/challenges
// @access  Publik
export const getChallenges = asyncHandler(async (req, res) => {
  const { difficulty, category } = req.query;
  const filter = { isActive: true };
  if (difficulty) filter.difficulty = difficulty;
  if (category) filter.category = category;

  const challenges = await CodingChallenge.find(filter)
    .select('-testCases -solutionCode')
    .sort({ order: 1 });

  res.json({ success: true, count: challenges.length, data: challenges });
});

// @desc    Ambil detail tantangan
// @route   GET /api/challenges/:id
// @access  Privat
export const getChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findById(req.params.id).select('-solutionCode');
  if (!challenge) {
    res.status(404);
    throw new Error('Tantangan tidak ditemukan');
  }

  const submissions = await ChallengeSubmission.find({
    user: req.user._id,
    challenge: req.params.id,
  }).sort({ createdAt: -1 }).limit(10);

  res.json({ success: true, data: { challenge, submissions } });
});

// @desc    Kirim solusi tantangan
// @route   POST /api/challenges/:id/submit
// @access  Privat
export const submitSolution = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const challengeId = req.params.id;
  const userId = req.user._id;

  if (!code || !code.trim()) {
    res.status(400);
    throw new Error('Kode tidak boleh kosong');
  }

  const challenge = await CodingChallenge.findById(challengeId);
  if (!challenge) {
    res.status(404);
    throw new Error('Tantangan tidak ditemukan');
  }

  const submission = await ChallengeSubmission.create({
    user: userId,
    challenge: challengeId,
    code,
    status: 'running',
  });

  try {
    const results = await executeCode(code, challenge.testCases);

    submission.testResults = results.testResults;
    submission.passedTests = results.passed;
    submission.totalTests = results.total;
    submission.executionTime = results.executionTime;
    submission.status = results.passed === results.total ? 'passed' : 'failed';

    const allPassed = results.passed === results.total;

    if (allPassed) {
      // Cek apakah ini pertama kali user menyelesaikan tantangan ini
      const previousSolved = await ChallengeSubmission.findOne({
        user: userId,
        challenge: challengeId,
        status: 'passed',
        _id: { $ne: submission._id },
      });

      if (!previousSolved) {
        submission.isFirstSuccess = true;
        submission.pointsEarned = challenge.points;

        await User.findByIdAndUpdate(userId, {
          $inc: {
            'stats.completedChallenges': 1,
            'stats.totalPoints': challenge.points,
          },
          'stats.lastActiveAt': new Date(),
        });

        await Activity.create({
          user: userId,
          type: 'tantangan_selesai',
          title: `Menyelesaikan tantangan: ${challenge.title}`,
          referenceId: challengeId,
          referenceModel: 'CodingChallenge',
          metadata: { points: challenge.points },
        });
      }
    }

    await submission.save();

    res.json({
      success: true,
      message: allPassed ? '🎉 Selamat! Semua tes lulus!' : 'Beberapa tes belum lulus. Coba lagi!',
      data: submission,
    });
  } catch (error) {
    submission.status = 'error';
    submission.errorMessage = error.message;
    await submission.save();

    res.json({
      success: false,
      message: 'Error saat menjalankan kode: ' + error.message,
      data: submission,
    });
  }
});

// @desc    Ambil riwayat submission pengguna
// @route   GET /api/submissions
// @access  Privat
export const getMySubmissions = asyncHandler(async (req, res) => {
  const { challengeId } = req.query;
  const filter = { user: req.user._id };
  if (challengeId) filter.challenge = challengeId;

  const submissions = await ChallengeSubmission.find(filter)
    .populate('challenge', 'title difficulty')
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({ success: true, count: submissions.length, data: submissions });
});

// ====== KHUSUS ADMIN ======

export const createChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.create(req.body);
  res.status(201).json({ success: true, message: 'Tantangan berhasil dibuat', data: challenge });
});

export const updateChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!challenge) {
    res.status(404);
    throw new Error('Tantangan tidak ditemukan');
  }
  res.json({ success: true, message: 'Tantangan berhasil diperbarui', data: challenge });
});

export const deleteChallenge = asyncHandler(async (req, res) => {
  const challenge = await CodingChallenge.findByIdAndDelete(req.params.id);
  if (!challenge) {
    res.status(404);
    throw new Error('Tantangan tidak ditemukan');
  }
  res.json({ success: true, message: 'Tantangan berhasil dihapus' });
});