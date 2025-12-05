import { Router } from 'express';
import { canonizeSubmission } from '../controllers/canon.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/submissions/:id/canonize', authenticate, canonizeSubmission);

export default router;