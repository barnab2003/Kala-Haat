import api from './api';

/**
 * Payment + Order API calls.
 * Maps to /api/payments and /api/orders on the backend (Phase 4).
 */

/** Step 1: backend creates a Stripe PaymentIntent and returns the client_secret */
export const createPaymentIntent = (orderData) =>
  api.post('/payments/create-intent', orderData);

/** Fetch buyer's own orders */
export const getMyOrders = () =>
  api.get('/orders/my-orders');

/** Vendor: update order status to 'shipped' */
export const markOrderShipped = (orderId) =>
  api.patch(`/orders/${orderId}/ship`);

/** Buyer: confirm order received (triggers 'delivered' status) */
export const markOrderDelivered = (orderId) =>
  api.patch(`/orders/${orderId}/deliver`);

/** Vendor: view their commission ledger */
export const getMyLedger = () =>
  api.get('/payments/my-ledger');

/** Admin: trigger payout for a ledger entry */
export const triggerPayout = (ledgerId) =>
  api.post(`/payments/payout/${ledgerId}`);