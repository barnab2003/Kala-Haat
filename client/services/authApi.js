import api from './api';

/**
 * Auth API calls.
 * These map 1:1 to the routes you'll build in Phase 2
 * (modules/auth/auth.routes.js on the backend).
 */

export const registerUser = (data) =>
  api.post('/auth/register', data);

export const loginUser = (data) =>
  api.post('/auth/login', data);

export const logoutUser = () =>
  api.post('/auth/logout');

/** Silent refresh — called on app load to restore the session from
 *  the httpOnly refresh-token cookie without the user logging in again. */
export const refreshToken = () =>
  api.post('/auth/refresh');

export const getMe = () =>
  api.get('/auth/me');