import express from 'express';
import { body, param } from 'express-validator';

import {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

import { authenticateToken } from '../../middlewares/authentication.js';
import { validationErrors } from '../../middlewares/error-handlers.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', getUsers);

// Get one user
userRouter.get(
  '/:id',
  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  validationErrors,
  getUser,
);

// Register new user
userRouter.post(
  '/',
  body('name').trim().notEmpty().withMessage('name is required'),

  body('username')
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('username must be 3-20 characters')
    .isAlphanumeric()
    .withMessage('username must be alphanumeric'),

  body('email').trim().isEmail().withMessage('email must be valid'),

  body('password')
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),

  validationErrors,
  postUser,
);

// Update user
userRouter.put(
  '/:id',
  authenticateToken,

  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  body('name').optional().trim().notEmpty().withMessage('name cannot be empty'),

  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage('username must be 3-20 characters')
    .isAlphanumeric()
    .withMessage('username must be alphanumeric'),

  body('email').optional().trim().isEmail().withMessage('email must be valid'),

  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('password must be at least 8 characters'),

  validationErrors,
  putUser,
);

// Delete user
userRouter.delete(
  '/:id',
  authenticateToken,

  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  validationErrors,
  deleteUser,
);

export default userRouter;
