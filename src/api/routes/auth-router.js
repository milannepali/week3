import express from 'express';
import { body } from 'express-validator';

import { postLogin, getMe } from '../controllers/auth-controller.js';

import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrors } from '../../middlewares/error-handlers.js';

const authRouter = express.Router();

// Login
authRouter.post(
  '/login',

  body('username').trim().notEmpty().withMessage('username is required'),

  body('password').notEmpty().withMessage('password is required'),

  validationErrors,
  postLogin,
);

// Get logged-in user
authRouter.get('/me', authenticateToken, getMe);

export default authRouter;
