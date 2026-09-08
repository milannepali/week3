import bcrypt from 'bcrypt';

import {
  getAllUsers,
  getUserById,
  addUser,
  modifyUser,
  removeUser,
} from '../models/user-model.js';

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Get one user
const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Register new user
const postUser = async (req, res) => {
  try {
    // Hash password before saving
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    // New registrations are always regular users
    req.body.role = 'user';

    const result = await addUser(req.body);

    if (!result) {
      return res.status(400).json({ message: 'User was not added.' });
    }

    res.status(201).json({
      message: 'New user added.',
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Update user
const putUser = async (req, res) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    // Regular users can update only themselves.
    // Admin can update anyone.
    if (loggedInUser.user_id !== userId && loggedInUser.role !== 'admin') {
      return res.status(403).json({
        message: 'Not allowed to update this user.',
      });
    }

    // Regular users cannot change their role
    if (loggedInUser.role !== 'admin') {
      delete req.body.role;
    }

    // Hash password if user changes it
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
    }

    const result = await modifyUser(req.body, req.params.id);

    if (!result) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    res.json({
      message: 'User item updated.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const loggedInUser = res.locals.user;
    const userId = Number(req.params.id);

    // Regular users can delete only themselves.
    // Admin can delete anyone.
    if (loggedInUser.user_id !== userId && loggedInUser.role !== 'admin') {
      return res.status(403).json({
        message: 'Not allowed to delete this user.',
      });
    }

    const result = await removeUser(req.params.id);

    if (!result) {
      return res.status(404).json({
        message: 'User not found.',
      });
    }

    res.json({
      message: 'User item deleted.',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export { getUsers, getUser, postUser, putUser, deleteUser };
