const { createLogger, format, transports } = require('winston');

const { combine, timestamp, printf, colorize, errors } = format;

// ── Custom log line format ────────────────────────────────────────────────────
// e.g.  2025-01-15 14:32:01 [ERROR]: Something went wrong
//           at Object.<anonymous> (src/app.js:12:7)
const logFormat = printf(({ level, message, timestamp: ts, stack }) => {
  return stack
    ? `${ts} [${level.toUpperCase()}]: ${message}\n${stack}`
    : `${ts} [${level.toUpperCase()}]: ${message}`;
});

const logger = createLogger({
  // In production, only log warnings and above to reduce noise.
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',

  format: combine(
    // Capture stack traces from Error objects passed to logger.error(err)
    errors({ stack: true }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat,
  ),

  transports: [
    new transports.Console({
      format: combine(
        colorize({ all: true }),
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
      ),
    }),
  ],
});

// In production you would add a file or external transport here, e.g.:
// new transports.File({ filename: 'logs/error.log', level: 'error' })

module.exports = logger;