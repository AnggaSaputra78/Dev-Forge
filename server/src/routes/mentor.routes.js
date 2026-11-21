import express from 'express';
import { chat, getHistory, getStatus } from '../controllers/mentor.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/chat', chat);
router.get('/history', getHistory);
router.get('/status', getStatus);

export default router;