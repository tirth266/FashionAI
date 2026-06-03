import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/response.js';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendError(res, 'User already exists', 400);
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    } else {
      sendError(res, 'Invalid user data', 400);
    }
  } catch (error) {
    sendError(res, error.message);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    } else {
      sendError(res, 'Invalid email or password', 401);
    }
  } catch (error) {
    sendError(res, error.message);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    sendSuccess(res, 'User profile fetched', user);
  } catch (error) {
    sendError(res, error.message);
  }
};
