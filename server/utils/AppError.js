/**
 * AppError
 *
 * Distinguishes "operational" errors (expected, user-facing, safe to expose)
 * from "programmer" errors (bugs, unexpected, should never reach the client).
 *
 * The global error handler checks isOperational:
 *   - true  → send the message to the client (e.g. "Email already in use")
 *   - false → send a generic "Something went wrong" to hide internals
 *
 * Usage:
 *   throw new AppError('Product not found', 404);
 *   throw new AppError('You do not have permission to do this', 403);
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    // 4xx errors are operational (client mistakes); 5xx are server errors.
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Keep the constructor call out of the stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;