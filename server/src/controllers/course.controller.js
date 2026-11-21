import Course from '../models/Course.js';
import Module from '../models/Module.js';
import Lesson from '../models/Lesson.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Ambil semua kursus
// @route   GET /api/courses
// @access  Publik
export const getCourses = asyncHandler(async (req, res) => {
  const { pathId, level } = req.query;
  const filter = { isActive: true };
  if (pathId) filter.learningPath = pathId;
  if (level) filter.level = level;

  const courses = await Course.find(filter)
    .populate('learningPath', 'title')
    .sort({ order: 1 });

  res.json({ success: true, count: courses.length, data: courses });
});

// @desc    Ambil detail kursus beserta modulnya
// @route   GET /api/courses/:id
// @access  Publik
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('learningPath', 'title');
  if (!course) {
    res.status(404);
    throw new Error('Kursus tidak ditemukan');
  }

  const modules = await Module.find({ course: course._id, isActive: true }).sort({ order: 1 });

  res.json({ success: true, data: { ...course.toObject(), modules } });
});

// @desc    Ambil modul untuk sebuah kursus
// @route   GET /api/courses/:courseId/modules
// @access  Publik
export const getCourseModules = asyncHandler(async (req, res) => {
  const modules = await Module.find({ course: req.params.courseId, isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: modules.length, data: modules });
});

// @desc    Ambil pelajaran untuk sebuah modul
// @route   GET /api/modules/:moduleId/lessons
// @access  Publik
export const getModuleLessons = asyncHandler(async (req, res) => {
  const lessons = await Lesson.find({ module: req.params.moduleId, isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: lessons.length, data: lessons });
});

// @desc    Ambil detail satu pelajaran
// @route   GET /api/lessons/:id
// @access  Publik
export const getLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.findById(req.params.id)
    .populate('module', 'title')
    .populate('course', 'title');

  if (!lesson) {
    res.status(404);
    throw new Error('Pelajaran tidak ditemukan');
  }

  res.json({ success: true, data: lesson });
});

// ====== KHUSUS ADMIN ======

// @desc    Buat kursus baru
// @route   POST /api/courses
// @access  Admin
export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ success: true, message: 'Kursus berhasil dibuat', data: course });
});

// @desc    Perbarui kursus
// @route   PUT /api/courses/:id
// @access  Admin
export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!course) {
    res.status(404);
    throw new Error('Kursus tidak ditemukan');
  }
  res.json({ success: true, message: 'Kursus berhasil diperbarui', data: course });
});

// @desc    Hapus kursus
// @route   DELETE /api/courses/:id
// @access  Admin
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Kursus tidak ditemukan');
  }
  await Module.deleteMany({ course: course._id });
  await Lesson.deleteMany({ course: course._id });
  res.json({ success: true, message: 'Kursus berhasil dihapus' });
});

// @desc    Buat modul baru
// @route   POST /api/modules
// @access  Admin
export const createModule = asyncHandler(async (req, res) => {
  const module = await Module.create(req.body);
  await Course.findByIdAndUpdate(req.body.course, { $inc: { 'stats.totalModules': 1 } });
  res.status(201).json({ success: true, message: 'Modul berhasil dibuat', data: module });
});

// @desc    Buat pelajaran baru
// @route   POST /api/lessons
// @access  Admin
export const createLesson = asyncHandler(async (req, res) => {
  const lesson = await Lesson.create(req.body);
  await Promise.all([
    Module.findByIdAndUpdate(req.body.module, { $inc: { 'stats.totalLessons': 1 } }),
    Course.findByIdAndUpdate(req.body.course, { $inc: { 'stats.totalLessons': 1 } }),
  ]);
  res.status(201).json({ success: true, message: 'Pelajaran berhasil dibuat', data: lesson });
});