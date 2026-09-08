import bcrypt from 'bcrypt';

import {
  getAllUsers,
  getUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

// Get all users
const getUsers = async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// Get one user
const getUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// Register new user
const postUser = async (req, res, next) => {
  try {
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // New registrations are always regular users
    req.body.role = 'user';

    const result = await addUser(req.body);

    if (!result) {
      const error = new Error('User was not added.');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({
      message: 'New user added.',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
const putUser = async (req, res, next) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    // Regular users can update only themselves
    // Admin can update anyone
    if (loggedInUser.user_id !== userId && loggedInUser.role !== 'admin') {
      const error = new Error('Not allowed to update this user.');
      error.status = 403;
      return next(error);
    }

    // Regular users cannot change their role
    if (loggedInUser.role !== 'admin') {
      delete req.body.role;
    }

    // Hash password if changed
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const result = await modifyUser(req.body, req.params.id);

    if (!result) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    res.json({
      message: 'User item updated.',
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
const deleteUser = async (req, res, next) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    // Regular users can delete only themselves
    // Admin can delete anyone
    if (loggedInUser.user_id !== userId && loggedInUser.role !== 'admin') {
      const error = new Error('Not allowed to delete this user.');
      error.status = 403;
      return next(error);
    }

    const result = await removeUser(req.params.id);

    if (!result) {
      const error = new Error('User not found.');
      error.status = 404;
      return next(error);
    }

    res.json({
      message: 'User item deleted.',
    });
  } catch (error) {
    next(error);
  }
};

export { getUsers, getUser, postUser, putUser, deleteUser };
