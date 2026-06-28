import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

/**
 * Redux store.
 * Currently only holds auth state.
 *
 * Cart state lives in Zustand (cartStore.js) — no need to duplicate it here.
 * As Phase 3/4 build out, you can add more slices (e.g. notifications).
 */
const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;