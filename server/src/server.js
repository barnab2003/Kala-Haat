// Load environment variables FIRST — before any other require().
// Nothing else in the app should call dotenv; this is the only place.
require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 5000;

// ── Unhandled rejection / exception guards ────────────────────────────────────
// These are the safety nets for any async error that slips past catchAsync,
// or any synchronous bug that throws outside of Express middleware.
//
// In both cases we log the error and shut down gracefully, letting Render
// restart the container with a clean slate rather than running in a broken state.

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION — shutting down');
  logger.error(err);
  // Synchronous error: safe to exit immediately.
  process.exit(1);
});

// ── Boot sequence ─────────────────────────────────────────────────────────────
// Connect to MongoDB first. If the connection fails, connectDB() calls
// process.exit(1) internally — the server never starts.

const startServer = async () => {
  await connectDB();

  const server = http.createServer(app);

  server.listen(PORT, () => {
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });

  // ── Graceful shutdown ───────────────────────────────────────────────────────
  // SIGTERM is sent by Render when it's about to replace a deployment.
  // We stop accepting new connections and let in-flight requests finish
  // before the process exits.
  process.on('unhandledRejection', (err) => {
    logger.error('UNHANDLED REJECTION — shutting down gracefully');
    logger.error(err);
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received — shutting down gracefully');
    server.close(() => {
      logger.info('Process terminated');
    });
  });
};

startServer();