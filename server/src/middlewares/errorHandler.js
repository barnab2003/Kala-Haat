const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

// ── Mongoose / third-party error translators ──────────────────────────────────
// Convert framework-specific errors into clean AppErrors before responding.

const handleCastErrorDB = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateFieldsDB = (err) => {
  // Extract the duplicated value from the error message
  const value = err.message.match(/(["'])(\\?.)*?\1/)?.[0] ?? 'unknown';
  return new AppError(
    `Duplicate field value: ${value}. Please use a different value.`,
    400,
  );
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  return new AppError(`Invalid input data: ${errors.join('. ')}`, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);

// ── Response helpers ──────────────────────────────────────────────────────────

const sendErrorDev = (err, res) => {
  // In development, expose the full error so you can debug quickly.
  res.status(err.statusCode).json({
    status:  err.status,
    message: err.message,
    stack:   err.stack,
    error:   err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // Safe to show — this is an expected error we created with AppError.
    res.status(err.statusCode).json({
      status:  err.status,
      message: err.message,
    });
  } else {
    // Programming or unknown error: don't leak details to the client.
    logger.error('UNHANDLED ERROR:', err);
    res.status(500).json({
      status:  'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

// ── Global error handler ──────────────────────────────────────────────────────
// Express identifies this as an error handler because it has 4 parameters.

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode ?? 500;
  err.status     = err.status     ?? 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    return;
  }

  // Production: translate framework errors to clean AppErrors
  let error = Object.assign(Object.create(Object.getPrototypeOf(err)), err);
  error.message = err.message;

  if (error.name === 'CastError')               error = handleCastErrorDB(error);
  if (error.code === 11000)                     error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError')         error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError')       error = handleJWTError();
  if (error.name === 'TokenExpiredError')       error = handleJWTExpiredError();

  sendErrorProd(error, res);
};

module.exports = errorHandler;