import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByUsername } from '../models/user-model.js';
import 'dotenv/config';

// Login user
const postLogin = async (req, res) => {
  try {
    const user = await findUserByUsername(req.body.username);

    // Username not found
    if (!user) {
      return res.status(401).json({
        message: 'Invalid username or password.',
      });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password,
    );

    // Wrong password
    if (!passwordMatch) {
      return res.status(401).json({
        message: 'Invalid username or password.',
      });
    }

    // Do not include password in token or response
    const userWithNoPassword = {
      user_id: user.user_id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // Create JWT token
    const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.json({
      user: userWithNoPassword,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Login error.',
    });
  }
};

// Get logged-in user from token
const getMe = async (req, res) => {
  if (res.locals.user) {
    res.json({
      message: 'token ok',
      user: res.locals.user,
    });
  } else {
    res.sendStatus(401);
  }
};

export { postLogin, getMe };
