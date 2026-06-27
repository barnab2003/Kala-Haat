/**
 * catchAsync
 *
 * Wraps an async Express route handler so you never have to write
 * try/catch in controllers. Any rejected promise is forwarded to
 * Express's next(err) and caught by the global error handler.
 *
 * Usage:
 *   router.get('/products', catchAsync(async (req, res) => {
 *     const products = await Product.find();
 *     res.json(products);
 *   }));
 */
const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = catchAsync;