import express from 'express';
import { getLesson } from '../controllers/course.controller.js';

const router = express.Router();

router.get('/:id', getLesson);

export default router;