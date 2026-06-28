const authService = require('./auth.service');
const catchAsync  = require('../../utils/catchAsync');

/**
 * Controllers are intentionally thin.
 * They only handle HTTP concerns (reading req, writing res).
 * All business logic lives in auth.service.js.
 */

// POST /api/auth/register
const registerController = catchAsync(async (req, res) => {
  const { name, email, password, role } = req.body;
  const { user, accessToken } = await authService.register(res, { name, email, password, role });

  res.status(201).json({
    status: 'success',
    accessToken,
    data: { user },
  });
});

// POST /api/auth/login
const loginController = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken } = await authService.login(res, { email, password });

  res.status(200).json({
    status: 'success',
    accessToken,
    data: { user },
  });
});

// POST /api/auth/refresh
// Called silently on app load to restore session from the httpOnly cookie
const refreshController = catchAsync(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  const { user, accessToken } = await authService.refresh(res, refreshToken);

  res.status(200).json({
    status: 'success',
    accessToken,
    data: { user },
  });
});

// POST /api/auth/logout
const logoutController = catchAsync(async (req, res) => {
  authService.logout(res);

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.',
  });
});

// GET /api/auth/me  (protected — requires valid JWT)
const getMeController = catchAsync(async (req, res) => {
  // req.user._id is attached by the protect middleware
  const user = await authService.getMe(req.user._id);

  res.status(200).json({
    status: 'success',
    data: { user },
  });
});

module.exports = {
  registerController,
  loginController,
  refreshController,
  logoutController,
  getMeController,
};