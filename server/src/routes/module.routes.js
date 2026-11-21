import express from 'express';
import { getModuleLessons } from '../controllers/course.controller.js';

const router = express.Router();

router.get('/:moduleId/lessons', getModuleLessons);

export default router;