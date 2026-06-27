import { useSelector, useDispatch } from 'react-redux';
import { clearUser } from '../features/auth/authSlice';
import { clearAccessToken } from '../services/api';
import { logoutUser } from '../services/authApi';

/**
 * useAuth
 *
 * Central hook for reading the current user and triggering logout.
 * All components that need to know "who is logged in?" use this hook
 * instead of reaching into the Redux store directly.
 *
 * Usage:
 *   const { user, isAuthenticated, isVendor, logout } = useAuth();
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, isLoading } = useSelector((state) => state.auth);

  const logout = async () => {
    try {
      await logoutUser(); // clears the httpOnly refresh-token cookie on the server
    } catch {
      // If the server call fails (e.g. already expired), we still clear locally
    } finally {
      clearAccessToken();
      dispatch(clearUser());
    }
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isVendor: user?.role === 'vendor',
    isAdmin:  user?.role === 'admin',
    logout,
  };
};

export default useAuth;