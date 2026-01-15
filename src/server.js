require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const seedDemoUser = require('./seed/demoUser');
const resetDemoTodos = require('./seed/resetDemoTodos');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Demo users are now created on-demand via /auth/demo endpoint
  // Only reset demo todos in development (for testing)
  if (process.env.NODE_ENV !== 'production') {
    await resetDemoTodos();
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();