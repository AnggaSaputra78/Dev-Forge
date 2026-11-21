import Assessment from '../models/Assessment.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Ambil semua asesmen
// @route   GET /api/assessments
// @access  Privat
export const getAssessments = asyncHandler(async (req, res) => {
  const assessments = await Assessment.find({ isActive: true })
    .populate('course', 'title')
    .select('-questions.correctAnswer')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: assessments.length, data: assessments });
});

// @desc    Ambil detail asesmen (tanpa kunci jawaban)
// @route   GET /api/assessments/:id
// @access  Privat
export const getAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findById(req.params.id)
    .populate('course', 'title')
    .select('-questions.correctAnswer');

  if (!assessment) {
    res.status(404);
    throw new Error('Asesmen tidak ditemukan');
  }

  const attempts = await AssessmentAttempt.find({
    user: req.user._id,
    assessment: req.params.id,
  }).sort({ attemptNumber: -1 });

  res.json({
    success: true,
    data: {
      assessment,
      attempts,
      attemptsRemaining: Math.max(0, assessment.maxAttempts - attempts.length),
    },
  });
});

// @desc    Kirim jawaban asesmen
// @route   POST /api/assessments/:id/submit
// @access  Privat
export const submitAttempt = asyncHandler(async (req, res) => {
  const { answers, timeTaken } = req.body;
  const assessmentId = req.params.id;
  const userId = req.user._id;

  const assessment = await Assessment.findById(assessmentId);
  if (!assessment) {
    res.status(404);
    throw new Error('Asesmen tidak ditemukan');
  }

  const previousAttempts = await AssessmentAttempt.countDocuments({
    user: userId,
    assessment: assessmentId,
  });

  if (previousAttempts >= assessment.maxAttempts) {
    res.status(400);
    throw new Error('Anda telah mencapai batas percobaan maksimum');
  }

  let totalPoints = 0;
  let pointsEarned = 0;
  const gradedAnswers = [];

  assessment.questions.forEach((question, index) => {
    totalPoints += question.points;
    const userAnswer = answers.find((a) => a.questionIndex === index);

    let isCorrect = false;
    let earned = 0;

    if (userAnswer) {
      isCorrect = JSON.stringify(userAnswer.answer) === JSON.stringify(question.correctAnswer);
      if (isCorrect) {
        earned = question.points;
        pointsEarned += earned;
      }
    }

    gradedAnswers.push({
      questionIndex: index,
      answer: userAnswer?.answer,
      isCorrect,
      pointsEarned: earned,
    });
  });

  const score = totalPoints > 0 ? Math.round((pointsEarned / totalPoints) * 100) : 0;
  const passed = score >= assessment.passingScore;

  const attempt = await AssessmentAttempt.create({
    user: userId,
    assessment: assessmentId,
    answers: gradedAnswers,
    score,
    totalPoints,
    pointsEarned,
    passed,
    timeTaken,
    attemptNumber: previousAttempts + 1,
    completedAt: new Date(),
  });

  if (passed) {
    await User.findByIdAndUpdate(userId, {
      $inc: {
        'stats.completedAssessments': 1,
        'stats.totalPoints': Math.round(pointsEarned / 10),
      },
      'stats.lastActiveAt': new Date(),
    });

    await Activity.create({
      user: userId,
      type: 'asesmen_selesai',
      title: `Lulus asesmen: ${assessment.title}`,
      referenceId: assessmentId,
      referenceModel: 'Assessment',
      metadata: { score, points: Math.round(pointsEarned / 10) },
    });
  }

  res.json({
    success: true,
    message: passed ? '🎉 Selamat! Anda lulus asesmen ini.' : 'Belum lulus. Pelajari kembali materinya dan coba lagi.',
    data: attempt,
  });
});

// ====== KHUSUS ADMIN ======

export const createAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.create(req.body);
  res.status(201).json({ success: true, message: 'Asesmen berhasil dibuat', data: assessment });
});

export const deleteAssessment = asyncHandler(async (req, res) => {
  const assessment = await Assessment.findByIdAndDelete(req.params.id);
  if (!assessment) {
    res.status(404);
    throw new Error('Asesmen tidak ditemukan');
  }
  res.json({ success: true, message: 'Asesmen berhasil dihapus' });
});