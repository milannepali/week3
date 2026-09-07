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

// Get one user by id
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

// Add user
const postUser = async (req, res) => {
  try {
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
    const result = await modifyUser(req.body, req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User item updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Delete user and their cats
const deleteUser = async (req, res) => {
  try {
    const result = await removeUser(req.params.id);

    if (!result) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User item deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export { getUsers, getUser, postUser, putUser, deleteUser };
