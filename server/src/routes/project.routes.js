import express from 'express';
import {
  getProjects,
  getProject,
  startProject,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publik
router.get('/', getProjects);

// Privat
router.get('/:id', protect, getProject);
router.post('/:id/start', protect, startProject);

// Admin
router.post('/', protect, authorize('admin'), createProject);
router.put('/:id', protect, authorize('admin'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;