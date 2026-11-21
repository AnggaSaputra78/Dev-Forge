import express from 'express';
import { getProfile, updateProfile, changePassword, getStats } from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', getProfile);
router.put('/me', updateProfile);
router.put('/me/password', changePassword);
router.get('/me/stats', getStats);

export default router;