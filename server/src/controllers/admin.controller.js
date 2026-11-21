import User from '../models/User.js';
import Course from '../models/Course.js';
import Lesson from '../models/Lesson.js';
import Module from '../models/Module.js';
import CodingChallenge from '../models/CodingChallenge.js';
import Project from '../models/Project.js';
import Assessment from '../models/Assessment.js';
import LearningPath from '../models/LearningPath.js';
import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Statistik platform
// @route   GET /api/admin/stats
// @access  Admin
export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalCourses, totalLessons, totalChallenges, totalProjects, totalAssessments, totalPaths] =
    await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Lesson.countDocuments(),
      CodingChallenge.countDocuments(),
      Project.countDocuments(),
      Assessment.countDocuments(),
      LearningPath.countDocuments(),
    ]);

  res.json({
    success: true,
    data: { totalUsers, totalCourses, totalLessons, totalChallenges, totalProjects, totalAssessments, totalPaths },
  });
});

// @desc    Ambil semua pengguna
// @route   GET /api/admin/users
// @access  Admin
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, search } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .skip((parseInt(page) - 1) * parseInt(limit))
    .limit(parseInt(limit));

  const total = await User.countDocuments(filter);

  res.json({
    success: true,
    data: users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

// @desc    Ubah peran pengguna
// @route   PUT /api/admin/users/:id/role
// @access  Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!['student', 'admin'].includes(role)) {
    res.status(400);
    throw new Error('Peran tidak valid. Gunakan student atau admin');
  }

  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('Anda tidak dapat mengubah peran Anda sendiri');
  }

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan');
  }

  res.json({ success: true, message: 'Peran pengguna berhasil diperbarui', data: user });
});

// @desc    Aktifkan/nonaktifkan pengguna
// @route   PUT /api/admin/users/:id/toggle-active
// @access  Admin
export const toggleUserActive = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    res.status(400);
    throw new Error('Anda tidak dapat menonaktifkan akun Anda sendiri');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan');
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: user.isActive ? 'Pengguna diaktifkan' : 'Pengguna dinonaktifkan',
    data: user,
  });
});

// @desc    Aktivitas terbaru seluruh platform
// @route   GET /api/admin/analytics
// @access  Admin
export const getAnalytics = asyncHandler(async (req, res) => {
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);

  const [newUsers, recentActivities] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: last30Days } }),
    Activity.countDocuments({ createdAt: { $gte: last30Days } }),
  ]);

  res.json({
    success: true,
    data: { newUsersLast30Days: newUsers, activitiesLast30Days: recentActivities },
  });
});