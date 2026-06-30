const Product = require('./product.model');
const AppError = require('../../utils/AppError');
const { streamUploadMultiple } = require('../../utils/streamUpload');

/**
 * getProducts
 *
 * Paginated, filterable product list — powers the Shop page.
 * Always filters isActive: true and isApproved: true so deactivated
 * or moderated listings never reach buyers.
 */
const getProducts = async (queryParams) => {
  const {
    category,
    vendorId,
    search,
    minPrice,
    maxPrice,
    page = 1,
    limit = 12,
    sort = '-createdAt',
  } = queryParams;

  const filter = { isActive: true, isApproved: true };

  if (category) filter.category = category;
  if (vendorId) filter.vendorId = vendorId;

  if (minPrice || maxPrice) {
    filter.price = {};
    // Convert rupees (what the frontend sends) to paise (what we store)
    if (minPrice) filter.price.$gte = Number(minPrice) * 100;
    if (maxPrice) filter.price.$lte = Number(maxPrice) * 100;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('vendorId', 'name vendorProfile.storeName vendorProfile.location')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

/**
 * getProductById
 * Single product detail — also includes inactive/unapproved if the
 * requester is the owning vendor or an admin (handled in controller).
 */
const getProductById = async (productId) => {
  const product = await Product.findById(productId)
    .populate('vendorId', 'name vendorProfile');

  if (!product) {
    throw new AppError('Product not found.', 404);
  }
  return product;
};

/**
 * createProduct
 *
 * Uploads images to Cloudinary, then creates the product document.
 * Images are uploaded BEFORE the DB write — if Cloudinary fails, we
 * never end up with a half-created product with no images.
 */
const createProduct = async (vendorId, productData, files) => {
  if (!files || files.length === 0) {
    throw new AppError('At least one product image is required.', 400);
  }

  // Upload all images to Cloudinary in parallel
  const imageUrls = await streamUploadMultiple(files, 'kalahaat/products');

  // Convert price from rupees (frontend) to paise (storage)
  const priceInPaise = Math.round(Number(productData.price) * 100);

  const product = await Product.create({
    vendorId,
    title:          productData.title,
    description:    productData.description,
    category:       productData.category,
    price:          priceInPaise,
    stockQuantity:  Number(productData.stockQuantity) || 0,
    imageUrls,
    customOptions:  productData.customOptions ? JSON.parse(productData.customOptions) : [],
    isCustomizable: productData.customOptions ? true : false,
  });

  return product;
};

/**
 * updateProduct
 *
 * Vendor can only update their own products (ownership check happens
 * in the controller via restrictTo + an explicit vendorId match here).
 * isApproved is intentionally excluded — only admins can change it,
 * via a separate admin route (Phase 5).
 */
const updateProduct = async (productId, vendorId, updates) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new AppError('Product not found.', 404);
  }

  if (product.vendorId.toString() !== vendorId.toString()) {
    throw new AppError('You do not have permission to edit this product.', 403);
  }

  // Whitelist updatable fields — never let isApproved or vendorId be
  // changed through this endpoint, even if the client sends them.
  const allowedFields = ['title', 'description', 'category', 'price', 'stockQuantity', 'isActive', 'customOptions'];
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      if (field === 'price') {
        product.price = Math.round(Number(updates.price) * 100);
      } else {
        product[field] = updates[field];
      }
    }
  });

  await product.save();
  return product;
};

/**
 * addProductImages
 * Appends new images to an existing product (up to the 6-image limit).
 */
const addProductImages = async (productId, vendorId, files) => {
  const product = await Product.findById(productId);

  if (!product) throw new AppError('Product not found.', 404);
  if (product.vendorId.toString() !== vendorId.toString()) {
    throw new AppError('You do not have permission to edit this product.', 403);
  }

  if (product.imageUrls.length + files.length > 6) {
    throw new AppError(`This product already has ${product.imageUrls.length} images. Maximum is 6.`, 400);
  }

  const newUrls = await streamUploadMultiple(files, 'kalahaat/products');
  product.imageUrls.push(...newUrls);
  await product.save();

  return product;
};

/**
 * deactivateProduct
 * Soft-delete — never remove the document, since past orders reference it.
 */
const deactivateProduct = async (productId, vendorId) => {
  const product = await Product.findById(productId);

  if (!product) throw new AppError('Product not found.', 404);
  if (product.vendorId.toString() !== vendorId.toString()) {
    throw new AppError('You do not have permission to edit this product.', 403);
  }

  product.isActive = false;
  await product.save();
  return product;
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  addProductImages,
  deactivateProduct,
};