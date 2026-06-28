const jwt = require('jsonwebtoken');
const User = require('../modules/users/user.model');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

/**
 * protect
 *
 * Verifies the Bearer JWT in the Authorization header.
 * On success, attaches the full user document to req.user so
 * controllers downstream can use it without another DB call.
 *
 * Usage:
 *   router.get('/me', protect, getMeController);
 */
const protect = catchAsync(async (req, res, next) => {
  // 1. Read the token from the Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('You are not logged in. Please log in to access this.', 401));
  }

  const token = authHeader.split(' ')[1];

  // 2. Verify the token — throws if expired or tampered with
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Your session has expired. Please log in again.', 401));
    }
    return next(new AppError('Invalid token. Please log in again.', 401));
  }

  // 3. Check the user still exists (they may have been deleted after token was issued)
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4. Check the account is not suspended
  if (!user.isActive) {
    return next(new AppError('Your account has been suspended. Please contact support.', 403));
  }

  // 5. Attach user to request — available to all downstream middleware and controllers
  req.user = user;
  next();
});

/**
 * restrictTo
 *
 * Role-based access control. Must be used AFTER protect.
 * Accepts one or more roles as arguments.
 *
 * Usage:
 *   router.post('/products', protect, restrictTo('vendor', 'admin'), createProductController);
 *   router.get('/admin/ledger', protect, restrictTo('admin'), getLedgerController);
 */
const restrictTo = (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403),
      );
    }
    next();
  };

module.exports = { protect, restrictTo };