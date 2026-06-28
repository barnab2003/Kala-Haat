const express = require('express');
const {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getMeController,
} = require('./auth.controller');
const { protect } = require('../../middlewares/auth');
const { authLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

// Apply the strict rate limiter to all auth routes.
// 10 requests per IP per hour — prevents brute-force attacks.
router.use(authLimiter);

// ── Public routes ─────────────────────────────────────────────────────────────
router.post('/register', registerController);
router.post('/login',    loginController);
router.post('/refresh',  refreshController);  // uses httpOnly cookie, no JWT needed
router.post('/logout',   logoutController);   // uses httpOnly cookie, no JWT needed

// ── Protected routes ──────────────────────────────────────────────────────────
// `protect` verifies the JWT and attaches req.user before the controller runs
router.get('/me', protect, getMeController);

module.exports = router;