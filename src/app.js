const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

const authRoutes = require('./routes/auth.routes');
const todoRoutes = require('./routes/todo.routes');

// Security headers with CSP that allows Google Fonts
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

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/todos', todoRoutes);

module.exports = app;