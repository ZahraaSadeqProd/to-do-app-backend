const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');

/**
 * CORS configuration
 * Allows requests from the production frontend and localhost for development
 */
const corsOptions = {
  origin: [
    'https://zas-angulartodoapp.netlify.app',
    'http://localhost:4200',
    'http://localhost:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

/**
 * Security middleware configuration
 * Applies Helmet CSP (Content Security Policy) to prevent various attacks
 * - Restricts resource loading to trusted sources
 * - Allows Google Fonts for styling
 * - Restricts script execution to same-origin only
 */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:']
    }
  })
);

// Middleware for JSON parsing
app.use(express.json());

// API Routes
app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

/**
 * Health check endpoint
 * Used for monitoring server availability
 */
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

module.exports = app;