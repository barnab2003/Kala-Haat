const cloudinary = require('../config/cloudinary');
const logger = require('./logger');

/**
 * streamUpload
 *
 * Pipes an in-memory file buffer (from Multer) directly to Cloudinary
 * without ever writing it to disk. Cloudinary's upload_stream API expects
 * a writable stream — we wrap it in a Promise so it can be awaited cleanly
 * in async controllers.
 *
 * @param {Buffer} fileBuffer - the raw image data, e.g. req.files[0].buffer
 * @param {string} folder     - Cloudinary folder to organise uploads, e.g. 'kalahaat/products'
 * @returns {Promise<{ url: string, publicId: string }>}
 */
const streamUpload = (fileBuffer, folder = 'kalahaat/products') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        // Cloudinary auto-optimises format and quality on delivery
        resource_type: 'image',
        transformation: [
          { width: 1600, height: 1600, crop: 'limit' }, // cap max dimensions
          { quality: 'auto', fetch_format: 'auto' },     // auto-compress, serve webp/avif where supported
        ],
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed: ${error.message}`);
          reject(error);
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * streamUploadMultiple
 *
 * Uploads several buffers in parallel and returns their secure URLs.
 * Used by the product creation controller when multiple images are sent.
 *
 * @param {Array<{buffer: Buffer}>} files - array of Multer file objects
 * @param {string} folder
 * @returns {Promise<string[]>} array of Cloudinary secure URLs, same order as input
 */
const streamUploadMultiple = async (files, folder = 'kalahaat/products') => {
  const uploadPromises = files.map((file) => streamUpload(file.buffer, folder));
  const results = await Promise.all(uploadPromises);
  return results.map((r) => r.url);
};

/**
 * deleteFromCloudinary
 *
 * Removes an image by its public ID. Useful when a vendor replaces or
 * deletes a product image — prevents orphaned files accumulating in
 * your Cloudinary storage quota.
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error(`Failed to delete Cloudinary asset ${publicId}: ${error.message}`);
    // Don't throw — a failed cleanup shouldn't break the calling operation
  }
};

module.exports = { streamUpload, streamUploadMultiple, deleteFromCloudinary };