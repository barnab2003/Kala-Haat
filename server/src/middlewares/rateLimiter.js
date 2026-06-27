const rateLimit = require('express-rate-limit');
const AppError = require('../utils/AppError');

/**
 * General API rate limiter
 * Applied to all /api/* routes.
 * 100 requests per 15 minutes per IP.
 */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,  // Return RateLimit-* headers (RFC 6585)
  legacyHeaders: false,   // Disable X-RateLimit-* headers
  handler: (req, res, next) => {
    next(new AppError('Too many requests from this IP. Please try again in 15 minutes.', 429));
  },
});

/**
 * Strict limiter for auth routes (login, register)
 * Prevents brute-force attacks on passwords.
 * 10 requests per hour per IP.
 */
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Too many login attempts from this IP. Please try again in an hour.', 429));
  },
});

/**
 * Strict limiter for file upload routes (product image uploads)
 * Prevents server memory exhaustion from rapid upload attempts.
 * 20 uploads per hour per IP.
 */
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError('Upload limit reached. Please try again in an hour.', 429));
  },
});

module.exports = { apiLimiter, authLimiter, uploadLimiter };