import express from 'express';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getAnalytics,
  getActivityLogs
} from '../controllers/studentController.js';
import { studentValidationRules } from '../middlewares/validation.js';
import upload from '../middlewares/upload.js';

const router = express.Router();

// Analytics (before /:id to avoid route conflict)
router.get('/analytics', getAnalytics);
router.get('/logs', getActivityLogs);

// Student CRUD
router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', upload.single('photo'), studentValidationRules, createStudent);
router.put('/:id', upload.single('photo'), studentValidationRules, updateStudent);
router.delete('/:id', deleteStudent);

export default router;