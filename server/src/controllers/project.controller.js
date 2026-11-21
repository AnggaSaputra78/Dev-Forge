import Project from '../models/Project.js';
import ProjectProgress from '../models/ProjectProgress.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Ambil semua proyek
// @route   GET /api/projects
// @access  Publik
export const getProjects = asyncHandler(async (req, res) => {
  const { level } = req.query;
  const filter = { isActive: true };
  if (level) filter.level = level;

  const projects = await Project.find(filter).sort({ order: 1 });
  res.json({ success: true, count: projects.length, data: projects });
});

// @desc    Ambil detail proyek + progres pengguna
// @route   GET /api/projects/:id
// @access  Privat
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Proyek tidak ditemukan');
  }

  const progress = await ProjectProgress.findOne({
    user: req.user._id,
    project: req.params.id,
  });

  res.json({
    success: true,
    data: {
      project,
      progress: progress || { status: 'not_started', completedMilestones: [], progress: 0 },
    },
  });
});

// @desc    Mulai proyek
// @route   POST /api/projects/:id/start
// @access  Privat
export const startProject = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id: projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    res.status(404);
    throw new Error('Proyek tidak ditemukan');
  }

  let progress = await ProjectProgress.findOne({ user: userId, project: projectId });

  if (!progress) {
    progress = await ProjectProgress.create({
      user: userId,
      project: projectId,
      status: 'in_progress',
      startedAt: new Date(),
    });

    await Project.findByIdAndUpdate(projectId, { $inc: { 'stats.totalStarted': 1 } });
  }

  res.json({ success: true, message: 'Proyek dimulai. Semangat!', data: progress });
});

// ====== KHUSUS ADMIN ======

export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);
  res.status(201).json({ success: true, message: 'Proyek berhasil dibuat', data: project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!project) {
    res.status(404);
    throw new Error('Proyek tidak ditemukan');
  }
  res.json({ success: true, message: 'Proyek berhasil diperbarui', data: project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) {
    res.status(404);
    throw new Error('Proyek tidak ditemukan');
  }
  res.json({ success: true, message: 'Proyek berhasil dihapus' });
});