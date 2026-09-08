import express from 'express';
import { body, param } from 'express-validator';

import {
  getCats,
  getCat,
  postCat,
  putCat,
  deleteCat,
  getCatsByUser,
} from '../controllers/cat-controller.js';

import { authenticateToken } from '../../middlewares/authentication.js';
import { upload } from '../../middlewares/upload.js';
import { validationErrors } from '../../middlewares/error-handlers.js';

const catRouter = express.Router();

// Get all cats
catRouter.get('/', getCats);

// Get cats by user id
catRouter.get(
  '/user/:id',

  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  validationErrors,
  getCatsByUser,
);

// Get one cat
catRouter.get(
  '/:id',

  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  validationErrors,
  getCat,
);

// Add new cat
catRouter.post(
  '/',
  authenticateToken,
  upload.single('cat'),

  body('cat_name')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('cat_name must be 3-50 characters'),

  body('weight')
    .notEmpty()
    .withMessage('weight is required')
    .isFloat({ min: 0.1 })
    .withMessage('weight must be a number'),

  body('owner')
    .notEmpty()
    .withMessage('owner is required')
    .isInt({ min: 1 })
    .withMessage('owner must be an integer'),

  body('birthdate')
    .notEmpty()
    .withMessage('birthdate is required')
    .isISO8601()
    .withMessage('birthdate must be a valid date'),

  validationErrors,
  postCat,
);

// Update cat
catRouter.put(
  '/:id',
  authenticateToken,

  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  body('cat_name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('cat_name must be 3-50 characters'),

  body('weight')
    .optional()
    .isFloat({ min: 0.1 })
    .withMessage('weight must be a number'),

  body('owner')
    .optional()
    .isInt({ min: 1 })
    .withMessage('owner must be an integer'),

  body('birthdate')
    .optional()
    .isISO8601()
    .withMessage('birthdate must be a valid date'),

  validationErrors,
  putCat,
);

// Delete cat
catRouter.delete(
  '/:id',
  authenticateToken,

  param('id').isInt({ min: 1 }).withMessage('id must be a positive integer'),

  validationErrors,
  deleteCat,
);

export default catRouter;
