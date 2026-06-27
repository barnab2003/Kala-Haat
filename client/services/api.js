import axios from 'axios';

/**
 * api.js — Axios base instance
 *
 * All API calls in the app go through this instance so that:
 *   1. The base URL is set in one place (from your .env file)
 *   2. The JWT is attached to every request automatically
 *   3. 401 responses trigger a logout in one place, not scattered across every hook
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15_000, // 15 seconds — fail loudly instead of hanging
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Runs before every request is sent.
// Reads the JWT from memory (stored in a module-level variable, see below)
// and attaches it as a Bearer token.
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ──────────────────────────────────────────────────────
// Runs after every response (or error) comes back.
//
// On success: pass the response straight through.
// On 401:     the token is expired or invalid — clear it and redirect to login.
// On other errors: normalise the error shape so every catch block in the app
//   can rely on err.message being a human-readable string.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401) {
      // Token is invalid or expired. Clear it and send the user to login.
      clearAccessToken();
      // Only redirect if we're not already on the auth page
      // to avoid an infinite redirect loop.
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login?session=expired';
      }
    }

    // Attach a clean message to the error so UI components can do:
    //   catch (err) { setError(err.message) }
    const message =
      serverMessage ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    return Promise.reject(new Error(message));
  },
);

// ── In-memory token store ─────────────────────────────────────────────────────
// We store the JWT in a module-level variable (not localStorage) because:
//   - localStorage is accessible to any JS on the page, making it an XSS target
//   - An in-memory token is wiped on page refresh, which is fine — the server
//     also sets an httpOnly refresh-token cookie that survives the refresh
//     (you'll implement the /auth/refresh endpoint in Phase 2)
//
// IMPORTANT: this means on hard-refresh the user appears logged out for ~1 frame
// while the silent refresh completes. Handle this in useAuth.js with an isLoading
// state before rendering protected routes.

let _accessToken = null;

export const setAccessToken = (token) => { _accessToken = token; };
export const getAccessToken = ()       => _accessToken;
export const clearAccessToken = ()     => { _accessToken = null; };

export default api;