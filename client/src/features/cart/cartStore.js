import { create } from 'zustand';

/**
 * cartStore
 *
 * Zustand store for the shopping cart. Zustand is used here (instead of Redux)
 * because the cart is purely local UI state — it doesn't need dev-tools
 * debugging or server sync until checkout. Keeps the cart code simple.
 *
 * Each item: { _id, title, price, imageUrl, vendorId, vendorName, quantity, customSpec }
 */
const useCartStore = create((set, get) => ({
  items: [],

  // ── Actions ──────────────────────────────────────────────────────────────────

  /** Add a product to the cart, or increment quantity if already present */
  addItem: (product, quantity = 1, customSpec = null) => {
    set((state) => {
      const existing = state.items.find((i) => i._id === product._id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i._id === product._id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }
      return {
        items: [...state.items, { ...product, quantity, customSpec }],
      };
    });
  },

  /** Change the quantity of a specific item */
  updateQuantity: (productId, quantity) => {
    if (quantity < 1) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i._id === productId ? { ...i, quantity } : i,
      ),
    }));
  },

  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i._id !== productId) })),

  clearCart: () => set({ items: [] }),

  // ── Derived values ────────────────────────────────────────────────────────────

  /** Total number of items (for the cart badge in the navbar) */
  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  /** Total cost in rupees */
  totalAmount: () =>
    get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));

export default useCartStore;