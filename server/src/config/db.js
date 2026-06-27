const mongoose = require('mongoose');
const logger = require('../utils/logger');

/**
 * Connects to MongoDB Atlas.
 *
 * Replica Sets are REQUIRED for multi-document ACID transactions
 * (order creation + commission ledger). Make sure your Atlas cluster
 * is M10+ in production — M0 free tier does not support transactions.
 *
 * We also configure Mongoose globally here so that all models
 * created later inherit these settings automatically.
 */
const connectDB = async () => {
  // Fail fast and loud if the URI is missing — better than a cryptic
  // "failed to connect" error buried in logs.
  if (!process.env.MONGO_URI) {
    logger.error('MONGO_URI is not defined in environment variables');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // Prevents Mongoose from buffering commands when disconnected.
      // Without this, queries silently queue up and drain when reconnected,
      // which can cause confusing behaviour in production.
      bufferCommands: false,

      // How long the driver waits when selecting a server before throwing.
      serverSelectionTimeoutMS: 10_000,

      // How long a single socket is allowed to stay idle before being closed.
      socketTimeoutMS: 45_000,
    });

    logger.info(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    logger.error(`MongoDB connection error: ${err.message}`);
    // Exit with failure — let Render / Docker restart the container.
    process.exit(1);
  }
};

// ── Mongoose event listeners ──────────────────────────────────────────────────
// These log every future state change so your log drain always shows
// exactly when the database went away and came back.

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  logger.info('MongoDB reconnected');
});

// Tidy up the connection when the Node process exits cleanly
// (e.g. SIGTERM from Render during a deploy).
process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to SIGTERM');
});

module.exports = connectDB;