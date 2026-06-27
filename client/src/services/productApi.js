import api from './api';

/**
 * Product API calls.
 * Maps to /api/products on the backend (Phase 2).
 */

/** Fetch paginated product list with optional filters */
export const getProducts = (params = {}) =>
  api.get('/products', { params });
  // params example: { category: 'paintings', page: 2, limit: 12, search: 'madhubani' }

export const getProductById = (id) =>
  api.get(`/products/${id}`);

export const getProductsByVendor = (vendorId) =>
  api.get('/products', { params: { vendorId } });

/** Vendor: create a new product (multipart for image upload) */
export const createProduct = (formData) =>
  api.post('/products', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/** Vendor: update their own product */
export const updateProduct = (id, data) =>
  api.patch(`/products/${id}`, data);

/** Vendor: soft-delete (sets isActive: false) */
export const deactivateProduct = (id) =>
  api.patch(`/products/${id}`, { isActive: false });