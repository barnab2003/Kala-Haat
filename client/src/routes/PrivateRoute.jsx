import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

/**
 * PrivateRoute
 *
 * Wraps any route that requires authentication.
 * - If auth is still loading (silent refresh in progress), show nothing.
 * - If not authenticated, redirect to /login.
 * - If authenticated but wrong role, redirect to home.
 * - Otherwise render the child route.
 *
 * Usage in AppRoutes.jsx:
 *   <Route element={<PrivateRoute />}>
 *     <Route path="/checkout" element={<Checkout />} />
 *   </Route>
 *
 *   <Route element={<PrivateRoute requiredRole="vendor" />}>
 *     <Route path="/vendor/dashboard" element={<Dashboard />} />
 *   </Route>
 */
const PrivateRoute = ({ requiredRole = null }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    // Auth check still in flight — render nothing to avoid a flash of the
    // login page for users who are actually logged in
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Logged in but wrong role (e.g. buyer trying to access /vendor/dashboard)
    return <Navigate to="/" replace />;
  }

  // Render whatever child route matched
  return <Outlet />;
};

export default PrivateRoute;