import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { setAccessToken } from '../services/api';
import { loginUser } from '../services/authApi';
import styles from './Auth.module.css';

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.password) {
      setError('Please fill in both fields.');
      return;
    }
    setLoading(true);
    try {
      const res = await loginUser(form);
      const { accessToken, data } = res.data;
      setAccessToken(accessToken);
      dispatch(setUser(data.user));
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Link to="/" className={styles.logo}>Kala<span>Haat</span></Link>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to your account</p>
        </div>

        {location.search.includes('session=expired') && (
          <div className={styles.infoBanner}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            Your session expired. Please sign in again.
          </div>
        )}

        {error && (
          <div className={styles.errorBanner} role="alert">
            <i className="ti ti-alert-circle" aria-hidden="true" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.field}>
            <label htmlFor="email" className={styles.label}>Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div className={styles.field}>
            <div className={styles.labelRow}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <Link to="/forgot-password" className={styles.forgotLink}>Forgot password?</Link>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className={styles.switchText}>
          Don't have an account?{' '}
          <Link to="/register" className={styles.switchLink}>Join KalaHaat free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;