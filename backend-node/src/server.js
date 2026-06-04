import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './config/db.js';
import { config, validateEnv } from './config/index.js';

dotenv.config();

// Validate Environment Variables
validateEnv();

const PORT = config.port;

// Connect to Database
connectDB();

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${config.nodeEnv} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
