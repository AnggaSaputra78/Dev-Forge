import express from 'express';
import { getLearningPaths, getLearningPath } from '../controllers/learningPath.controller.js';

const router = express.Router();

router.get('/', getLearningPaths);
router.get('/:id', getLearningPath);

export default router;