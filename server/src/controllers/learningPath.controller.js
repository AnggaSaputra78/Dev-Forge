import LearningPath from '../models/LearningPath.js';
import Course from '../models/Course.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Ambil semua jalur pembelajaran
// @route   GET /api/learning-paths
// @access  Publik
export const getLearningPaths = asyncHandler(async (req, res) => {
  const paths = await LearningPath.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: paths.length, data: paths });
});

// @desc    Ambil detail satu jalur pembelajaran
// @route   GET /api/learning-paths/:id
// @access  Publik
export const getLearningPath = asyncHandler(async (req, res) => {
  const path = await LearningPath.findById(req.params.id);
  if (!path) {
    res.status(404);
    throw new Error('Jalur pembelajaran tidak ditemukan');
  }

  const courses = await Course.find({ learningPath: path._id, isActive: true }).sort({ order: 1 });

  res.json({ success: true, data: { ...path.toObject(), courses } });
});