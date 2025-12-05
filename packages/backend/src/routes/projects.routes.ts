import { Router } from 'express';
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  addCollaborator,
} from '../controllers/projects.controller';
import { authenticate, requireRole, optionalAuth } from '../middleware/auth';
import { projectValidation, validate } from '../utils/validation';

const router = Router();

router.post('/', authenticate, requireRole('WRITER', 'ADMIN'), projectValidation, validate, createProject);
router.get('/', optionalAuth, listProjects);
router.get('/:slug', optionalAuth, getProject);
router.patch('/:id', authenticate, updateProject);
router.post('/:id/owners', authenticate, addCollaborator);

export default router;