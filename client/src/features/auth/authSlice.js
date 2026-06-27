import { createSlice } from '@reduxjs/toolkit';

/**
 * authSlice
 *
 * Holds the logged-in user's profile and loading state.
 * The actual JWT lives in the api.js module-level variable (not here)
 * to keep it away from Redux DevTools and serialisation warnings.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:            null,
    isAuthenticated: false,
    isLoading:       true,  // true on boot while silent refresh runs
  },
  reducers: {
    setUser: (state, action) => {
      state.user            = action.payload;
      state.isAuthenticated = true;
      state.isLoading       = false;
    },
    clearUser: (state) => {
      state.user            = null;
      state.isAuthenticated = false;
      state.isLoading       = false;
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setAuthLoading } = authSlice.actions;
export default authSlice.reducer;