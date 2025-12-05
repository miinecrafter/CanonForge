import { Router } from 'express';
import {
  createSubmission,
  updateSubmission,
  submitForReview,
  listSubmissions,
  getSubmission,
} from '../controllers/submissions.controller';
import { authenticate } from '../middleware/auth';
import { submissionValidation, validate } from '../utils/validation';

const router = Router();

router.post('/projects/:projectId/submissions', authenticate, submissionValidation, validate, createSubmission);
router.get('/projects/:projectId/submissions', authenticate, listSubmissions);
router.get('/submissions/:id', authenticate, getSubmission);
router.patch('/submissions/:id', authenticate, updateSubmission);
router.post('/submissions/:id/submit', authenticate, submitForReview);

export default router;