const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Todo = require('../models/Todo');
const { generateToken } = require('../utils/jwt');

/**
 * Login Controller - Authenticates user with email and password
 * - Validates email and password are provided
 * - Finds user in database
 * - Compares provided password with stored hash
 * - Returns JWT token and user info on success
 * @param {Object} req - Express request object with email and password in body
 * @param {Object} res - Express response object
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Register Controller - Creates a new user account
 * - Validates email and password are provided
 * - Checks if email is already registered
 * - Hashes password using bcrypt
 * - Creates new user in database
 * - Returns JWT token and user info on success
 * @param {Object} req - Express request object with email and password in body
 * @param {Object} res - Express response object
 */
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists, please use a different one' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword
    });

    const token = generateToken(user);
    res.status(201).json({
      user: { id: user._id, email },
      token
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Demo Login Controller - Creates and authenticates a demo user
 * - Generates unique demo user with UUID-based email
 * - Creates demo user account in database
 * - Populates with sample todos to help user explore the app
 * - Returns JWT token for immediate use
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const demoLogin = async (req, res) => {
  try {
    // Generate unique demo user
    const uniqueId = uuidv4().slice(0, 8);
    const email = `demo-${uniqueId}@todoapp.com`;
    const password = await bcrypt.hash(uniqueId, 10);

    const user = await User.create({
      email,
      password,
      role: 'demo',
      isDemo: true
    });

    // Create sample todos for this demo user to get them started
    const sampleTodos = [
      { todoItem: 'Welcome to my Todo App! 👋', priority: 2, status: 1, user: user._id },
      { todoItem: 'Try adding a new todo using the input above', priority: 1, status: 1, user: user._id },
      { todoItem: 'Click on a todo to edit it', priority: 2, status: 2, user: user._id },
      { todoItem: 'Use filters to organize your tasks', priority: 3, status: 1, user: user._id },
      { todoItem: 'Check out the priority and status options', priority: 1, status: 3, user: user._id }
    ];

    await Todo.insertMany(sampleTodos);

    const token = generateToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        isDemo: user.isDemo
      }
    });
  } catch (err) {
    console.error('Demo login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register, demoLogin };