const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const { apiLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./utils/AppError');
const logger = require('./utils/logger');

const app = express();

// ── Security headers ──────────────────────────────────────────────────────────
// Helmet sets a suite of HTTP headers that protect against well-known
// web vulnerabilities (XSS, clickjacking, MIME sniffing, etc.)
app.use(helmet());

// ── CORS ──────────────────────────────────────────────────────────────────────
// Only allow requests from your frontend origin.
// In production CLIENT_URL should be your Vercel deployment URL.
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies / Authorization headers
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// ── Stripe webhook route (MUST come BEFORE express.json()) ───────────────────
// Stripe sends a raw Buffer body and signs it. If express.json() runs first,
// it parses the body into an object and destroys the signature — the webhook
// verification will always fail. So we register this route early with the
// raw body parser.
app.use(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
);

// ── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));       // Reject suspiciously large JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ── Cookie parser ─────────────────────────────────────────────────────────────
// Required to read req.cookies.refreshToken in the auth refresh route.
app.use(cookieParser());

// ── HTTP request logging ──────────────────────────────────────────────────────
// 'combined' in production (Apache-style, good for log drains)
// 'dev' in development (colour-coded, compact)
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(
  morgan(morganFormat, {
    stream: {
      // Pipe Morgan output through Winston so all logs go to one place
      write: (message) => logger.http(message.trim()),
    },
  }),
);

// ── Global API rate limiter ───────────────────────────────────────────────────
// Applied to all /api/* routes. Auth and upload routes get their own
// stricter limiters, applied directly in their route files.
app.use('/api', apiLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
// Used by Render's health check pings. Returns 200 quickly without hitting
// the database, so a DB outage doesn't cause the server to be marked unhealthy.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API routes ────────────────────────────────────────────────────────────────
// Each module registers its own Express Router. We'll uncomment these
// one by one as we build each phase.

const authRoutes = require('./modules/auth/auth.routes');
app.use('/api/auth', authRoutes);

// const userRoutes    = require('./modules/users/user.routes');
// const productRoutes = require('./modules/products/product.routes');
// const orderRoutes   = require('./modules/orders/order.routes');
// const paymentRoutes = require('./modules/payments/payment.routes');

// ── 404 handler ───────────────────────────────────────────────────────────────
// Catches any request that didn't match a route above.
// Must be placed AFTER all route registrations.
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server`, 404));
});

// ── Global error handler ──────────────────────────────────────────────────────
// Must be the LAST middleware. Express identifies it by its 4-parameter
// signature (err, req, res, next).
app.use(errorHandler);

module.exports = app;