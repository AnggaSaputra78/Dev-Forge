import LessonProgress from '../models/LessonProgress.js';
import ProjectProgress from '../models/ProjectProgress.js';
import ChallengeSubmission from '../models/ChallengeSubmission.js';
import AssessmentAttempt from '../models/AssessmentAttempt.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Lesson from '../models/Lesson.js';
import Project from '../models/Project.js';
import Course from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Tandai pelajaran selesai
// @route   POST /api/progress/lesson
// @access  Privat
export const completeLesson = asyncHandler(async (req, res) => {
  const { lessonId, timeSpent } = req.body;
  const userId = req.user._id;

  const lesson = await Lesson.findById(lessonId);
  if (!lesson) {
    res.status(404);
    throw new Error('Pelajaran tidak ditemukan');
  }

  // Cek apakah sudah selesai sebelumnya (hindari double count)
  const existing = await LessonProgress.findOne({
    user: userId,
    lesson: lessonId,
    status: 'completed',
  });

  if (existing) {
    return res.json({ success: true, message: 'Pelajaran ini sudah ditandai selesai', data: existing });
  }

  const progress = await LessonProgress.findOneAndUpdate(
    { user: userId, lesson: lessonId },
    {
      user: userId,
      lesson: lessonId,
      course: lesson.course,
      status: 'completed',
      completedAt: new Date(),
      timeSpent: timeSpent || 0,
    },
    { upsert: true, new: true }
  );

  await User.findByIdAndUpdate(userId, {
    $inc: { 'stats.completedLessons': 1, 'stats.totalPoints': 5 },
    'stats.lastActiveAt': new Date(),
  });

  await Activity.create({
    user: userId,
    type: 'pelajaran_selesai',
    title: `Menyelesaikan pelajaran: ${lesson.title}`,
    referenceId: lessonId,
    referenceModel: 'Lesson',
    metadata: { points: 5, timeSpent },
  });

  res.json({ success: true, message: 'Pelajaran ditandai selesai. +5 poin!', data: progress });
});

// @desc    Ambil progres kursus pengguna
// @route   GET /api/progress/course/:courseId
// @access  Privat
export const getCourseProgress = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user._id;

  const progress = await LessonProgress.find({ user: userId, course: courseId }).populate('lesson', 'title order');
  const totalLessons = await Lesson.countDocuments({ course: courseId, isActive: true });
  const completedLessons = progress.filter((p) => p.status === 'completed').length;
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  res.json({
    success: true,
    data: { totalLessons, completedLessons, percent, completedLessonIds: progress.filter((p) => p.status === 'completed').map((p) => p.lesson._id.toString()) },
  });
});

// @desc    Ambil ringkasan progres pengguna (untuk dashboard)
// @route   GET /api/progress/overview
// @access  Privat
export const getProgressOverview = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId);
  const totalLessons = await Lesson.countDocuments({ isActive: true });
  const completedLessons = await LessonProgress.countDocuments({ user: userId, status: 'completed' });
  const solvedChallenges = await ChallengeSubmission.countDocuments({ user: userId, status: 'passed', isFirstSuccess: true });
  const avgScoreAgg = await AssessmentAttempt.aggregate([
    { $match: { user: userId } },
    { $group: { _id: null, avg: { $avg: '$score' } } },
  ]);

  const avgScore = avgScoreAgg.length > 0 ? Math.round(avgScoreAgg[0].avg) : null;

  res.json({
    success: true,
    data: {
      user: { name: user.name, email: user.email, stats: user.stats },
      lessons: {
        total: totalLessons,
        completed: completedLessons,
        percent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
      },
      challenges: { solved: solvedChallenges },
      assessments: { averageScore: avgScore },
    },
  });
});

// @desc    Perbarui milestone proyek
// @route   PUT /api/progress/project/:projectId/milestone
// @access  Privat
export const updateProjectMilestone = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { milestoneIndex, completed } = req.body;
  const userId = req.user._id;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Proyek tidak ditemukan');
  }

  let progress = await ProjectProgress.findOne({ user: userId, project: projectId });
  if (!progress) {
    progress = new ProjectProgress({
      user: userId,
      project: projectId,
      status: 'in_progress',
      startedAt: new Date(),
      completedMilestones: [],
    });
  }

  if (completed) {
    if (!progress.completedMilestones.includes(milestoneIndex)) {
      progress.completedMilestones.push(milestoneIndex);
    }
  } else {
    progress.completedMilestones = progress.completedMilestones.filter((m) => m !== milestoneIndex);
  }

  const totalMilestones = project.milestones.length || 1;
  progress.progress = Math.round((progress.completedMilestones.length / totalMilestones) * 100);

  if (progress.progress >= 100) {
    progress.status = 'completed';
    progress.completedAt = new Date();

    await User.findByIdAndUpdate(userId, {
      $inc: { 'stats.completedProjects': 1, 'stats.totalPoints': 50 },
    });

    await Activity.create({
      user: userId,
      type: 'proyek_selesai',
      title: `Menyelesaikan proyek: ${project.title}`,
      referenceId: projectId,
      referenceModel: 'Project',
      metadata: { points: 50 },
    });
  } else if (progress.completedMilestones.length > 0) {
    progress.status = 'in_progress';
  }

  await progress.save();

  res.json({ success: true, message: 'Milestone diperbarui', data: progress });
});