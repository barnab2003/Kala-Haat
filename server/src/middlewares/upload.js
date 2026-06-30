const multer = require('multer');
const AppError = require('../utils/AppError');

/**
 * upload.js
 *
 * Configures Multer to hold uploaded files in RAM (memoryStorage) rather
 * than writing them to the server's disk. This is critical for two reasons:
 *
 *   1. Render's filesystem is ephemeral — anything written to disk is lost
 *      on every redeploy or restart.
 *   2. We immediately stream the buffer to Cloudinary (see streamUpload.js),
 *      so there's never a need to persist the file locally at all.
 *
 * The buffer is available on each file as `file.buffer` in the controller.
 */

const storage = multer.memoryStorage();

// ── File filter ───────────────────────────────────────────────────────────────
// Reject anything that isn't an image before it even touches memory.
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  if (!allowedTypes.includes(file.mimetype)) {
    cb(new AppError('Only JPEG, PNG, WEBP, and AVIF images are allowed.', 400), false);
    return;
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file — keeps memory usage predictable
    files: 6,                  // Matches the max imageUrls allowed on a Product
  },
});

// Export configured instances for different upload shapes.
// .array('images', 6) → product creation (multiple images, field name "images")
// .single('banner')   → vendor storefront banner (one image)
module.exports = {
  uploadProductImages: upload.array('images', 6),
  uploadSingleImage:   upload.single('image'),
};