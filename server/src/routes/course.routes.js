import express from 'express';
import {
  getCourses,
  getCourse,
  getCourseModules,
  getModuleLessons,
  getLesson,
  createCourse,
  updateCourse,
  deleteCourse,
  createModule,
  createLesson,
} from '../controllers/course.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Publik
router.get('/', getCourses);
router.get('/:id', getCourse);
router.get('/:courseId/modules', getCourseModules);
router.get('/modules/:moduleId/lessons', getModuleLessons);
router.get('/lessons/:id', getLesson);

// Admin
router.post('/', protect, authorize('admin'), createCourse);
router.put('/:id', protect, authorize('admin'), updateCourse);
router.delete('/:id', protect, authorize('admin'), deleteCourse);
router.post('/modules', protect, authorize('admin'), createModule);
router.post('/lessons', protect, authorize('admin'), createLesson);

export default router;