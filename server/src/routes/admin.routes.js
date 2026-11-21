import express from 'express';
import {
  getStats,
  getUsers,
  updateUserRole,
  toggleUserActive,
  getAnalytics,
} from '../controllers/admin.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:id/toggle-active', toggleUserActive);
router.get('/analytics', getAnalytics);

export default router;