import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './features/auth/authSlice';
import { setAccessToken } from './services/api';
import { refreshToken } from './services/authApi';
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // On every page load/refresh, silently call /auth/refresh using the
    // httpOnly cookie. If it succeeds, the user stays logged in.
    // If it fails, they're treated as logged out.
    const restoreSession = async () => {
      try {
        const res = await refreshToken();
        const { accessToken, data } = res.data;
        setAccessToken(accessToken);
        dispatch(setUser(data.user));
      } catch {
        // No valid refresh token — user is logged out, that's fine
        dispatch(clearUser());
      }
    };

    restoreSession();
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
};

export default App;