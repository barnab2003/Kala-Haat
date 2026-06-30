const productService = require('./product.service');
const catchAsync = require('../../utils/catchAsync');

// GET /api/products
// Public — paginated, filterable list
const getProductsController = catchAsync(async (req, res) => {
  const result = await productService.getProducts(req.query);

  res.status(200).json({
    status: 'success',
    results: result.products.length,
    pagination: result.pagination,
    data: { products: result.products },
  });
});

// GET /api/products/:id
// Public — single product detail
const getProductByIdController = catchAsync(async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

// POST /api/products
// Vendor-only — multipart/form-data with up to 6 images under field "images"
const createProductController = catchAsync(async (req, res) => {
  const product = await productService.createProduct(req.user._id, req.body, req.files);

  res.status(201).json({
    status: 'success',
    data: { product },
  });
});

// PATCH /api/products/:id
// Vendor-only — owner can edit title, price, stock, etc.
const updateProductController = catchAsync(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.user._id, req.body);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

// PATCH /api/products/:id/images
// Vendor-only — append additional images to an existing product
const addProductImagesController = catchAsync(async (req, res) => {
  const product = await productService.addProductImages(req.params.id, req.user._id, req.files);

  res.status(200).json({
    status: 'success',
    data: { product },
  });
});

// DELETE /api/products/:id
// Vendor-only — soft delete (sets isActive: false)
const deactivateProductController = catchAsync(async (req, res) => {
  await productService.deactivateProduct(req.params.id, req.user._id);

  res.status(200).json({
    status: 'success',
    message: 'Product deactivated.',
  });
});

module.exports = {
  getProductsController,
  getProductByIdController,
  createProductController,
  updateProductController,
  addProductImagesController,
  deactivateProductController,
};