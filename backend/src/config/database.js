const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error('FATAL: MONGODB_URI environment variable is not set. ' +
      'Set it in your container runtime environment (Coolify dashboard, docker-compose .env, etc.).');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 s — fail fast with a useful message
    });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    logger.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
