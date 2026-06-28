const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const AppError = require('../../utils/AppError');

// ── Token helpers ─────────────────────────────────────────────────────────────

/**
 * Signs a short-lived ACCESS token (7d by default in dev).
 * This is sent in the response body and stored in memory on the client.
 */
const signAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * Signs a long-lived REFRESH token (30d).
 * Sent as an httpOnly cookie — JS cannot read it, which protects against XSS.
 * The client uses this cookie to silently get a new access token after expiry.
 */
const signRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

/**
 * Attaches the refresh token as a secure, httpOnly cookie.
 * httpOnly  → cannot be read by JavaScript (XSS protection)
 * secure    → only sent over HTTPS in production
 * sameSite  → prevents CSRF attacks
 */
const attachRefreshCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });
};

// ── Service functions ─────────────────────────────────────────────────────────

/**
 * register
 * Creates a new user. Throws if the email is already taken.
 * Returns the new user's public profile + tokens.
 */
const register = async (res, { name, email, password, role }) => {
  // Prevent buyers from self-registering as admin
  const safeRole = role === 'vendor' ? 'vendor' : 'buyer';

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  // passwordHash field is hashed by the pre-save hook in user.model.js
  const user = await User.create({
    name,
    email,
    passwordHash: password,
    role: safeRole,
    // If registering as a vendor, initialise an empty vendorProfile
    vendorProfile: safeRole === 'vendor' ? { storeName: name } : null,
  });

  const accessToken  = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  attachRefreshCookie(res, refreshToken);

  return { user: user.toPublicProfile(), accessToken };
};

/**
 * login
 * Verifies email + password. Throws descriptive errors for each failure mode.
 * Returns the user's public profile + tokens.
 */
const login = async (res, { email, password }) => {
  // We must explicitly select passwordHash because it has `select: false`
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    // Use a generic message — don't reveal whether the email exists
    throw new AppError('Incorrect email or password.', 401);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been suspended. Please contact support.', 403);
  }

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new AppError('Incorrect email or password.', 401);
  }

  const accessToken  = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);
  attachRefreshCookie(res, refreshToken);

  return { user: user.toPublicProfile(), accessToken };
};

/**
 * refresh
 * Called on app load to restore the session from the httpOnly cookie.
 * Issues a new access token without requiring the user to log in again.
 */
const refresh = async (res, refreshToken) => {
  if (!refreshToken) {
    throw new AppError('No refresh token provided.', 401);
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch {
    throw new AppError('Invalid or expired session. Please log in again.', 401);
  }

  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) {
    throw new AppError('User no longer exists or has been suspended.', 401);
  }

  const newAccessToken  = signAccessToken(user._id);
  const newRefreshToken = signRefreshToken(user._id);
  attachRefreshCookie(res, newRefreshToken);

  return { user: user.toPublicProfile(), accessToken: newAccessToken };
};

/**
 * logout
 * Clears the refresh token cookie. The client is responsible for
 * clearing the in-memory access token.
 */
const logout = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

/**
 * getMe
 * Returns the currently authenticated user's public profile.
 * The protect middleware already verified the JWT and attached req.user.
 */
const getMe = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new AppError('User not found.', 404);
  return user.toPublicProfile();
};

module.exports = { register, login, refresh, logout, getMe };