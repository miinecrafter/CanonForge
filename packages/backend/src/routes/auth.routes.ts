import { Router } from 'express';
import { register, login, refresh, logout, me } from '../controllers/auth.controller';
import { registerValidation, loginValidation, validate } from '../utils/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, validate, register);
router.post('/login', loginValidation, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticate, me);

export default router;