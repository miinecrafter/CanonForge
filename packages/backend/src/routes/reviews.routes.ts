import { Router } from 'express';
import { createReview } from '../controllers/reviews.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/submissions/:id/reviews', authenticate, createReview);

export default router;