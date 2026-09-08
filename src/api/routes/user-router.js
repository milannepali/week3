import express from 'express';

import {
  getUsers,
  getUser,
  postUser,
  putUser,
  deleteUser,
} from '../controllers/user-controller.js';

import { authenticateToken } from '../../middlewares/authentication.js';

const userRouter = express.Router();

// Get all users
userRouter.get('/', getUsers);

// Get one user
userRouter.get('/:id', getUser);

// Register new user
userRouter.post('/', postUser);

// Update user - login required
userRouter.put('/:id', authenticateToken, putUser);

// Delete user - login required
userRouter.delete('/:id', authenticateToken, deleteUser);

export default userRouter;
