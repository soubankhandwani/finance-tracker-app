import { Router } from 'express';

import { loginUser, registerUser } from '../controllers/auth.controller.js';
import {
  validateRegister,
  validateLogin,
} from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

export default router;
