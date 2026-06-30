const express = require('express');
const {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  addProductImagesController,
  deactivateProductController,
} = require('./product.controller');
const { protect, restrictTo } = require('../../middlewares/auth');
const { uploadProductImages } = require('../../middlewares/upload');
const { uploadLimiter } = require('../../middlewares/rateLimiter');

const router = express.Router();

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/', getProductsController);
router.get('/:id', getProductByIdController);

// ── Vendor-only routes ────────────────────────────────────────────────────────
// Order of middleware matters:
//   1. protect              → verify JWT, attach req.user
//   2. restrictTo('vendor') → only vendors may proceed
//   3. uploadLimiter        → rate-limit upload-heavy routes specifically
//   4. uploadProductImages  → Multer parses multipart form data into req.files
//   5. controller            → business logic runs last, with everything ready
router.post(
  '/',
  protect,
  restrictTo('vendor'),
  uploadLimiter,
  uploadProductImages,
  createProductController,
);

router.patch('/:id', protect, restrictTo('vendor'), updateProductController);

router.patch(
  '/:id/images',
  protect,
  restrictTo('vendor'),
  uploadLimiter,
  uploadProductImages,
  addProductImagesController,
);

router.delete('/:id', protect, restrictTo('vendor'), deactivateProductController);

module.exports = router;