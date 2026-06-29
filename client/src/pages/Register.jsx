import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../features/auth/authSlice';
import { setAccessToken } from '../services/api';
import { registerUser } from '../services/authApi';
import styles from './Auth.module.css';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState({
    name:     '',
    email:    '',
    password: '',
    role:     searchParams.get('role') === 'vendor' ? 'vendor' : 'buyer',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const validate = () => {
    if (!form.name.trim())        return 'Please enter your name.';
    if (!form.email.trim())       return 'Please enter your email.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) { setError(validationError); return; }

    setLoading(true);
    try {
      const res = await registerUser(form);
      const { accessToken, data } = res.data;
      setAccessToken(accessToken);
      dispatch(setUser(data.user));
      navigate(form.role === 'vendor' ? '/vendor/dashboard' : '/');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <Link to="/" className={styles.logo}>Kala<span>Haat</span></Link>
          <h1 className={styles.title}>Create your account</h1>
          <p className={styles.subtitle}>Join thousands of artisans and craft lovers</p>
        </div>

        {/* Role toggle */}
        <div className={styles.roleToggle}>
          <button
            type="button"
            className={`${styles.roleBtn} ${form.role === 'buyer' ? styles.roleActive : ''}`}
            onClick={() => setForm((p) => ({ ...p, role: 'buyer' }))}
          >
            <i className="ti ti-shopping-bag" aria-hidden="true" />
            I want to buy
          </button>
          <button
            type="button"
            className={`${styles.roleBtn} ${form.role === 'vendor' ? styles.roleActive : ''}`}
            onClick={() => setForm((p) => ({ ...p, role: 'vendor' }))}
          >
            <i className="ti ti-palette" aria-hidden="true" />
            I want to sell
          </button>
        </div>

        {form.role === 'vendor' && (
          <div className={styles.vendorNote}>
            <i className="ti ti-info-circle" aria-hidden="true" />
            You'll set up your storefront and connect Stripe for payouts after registering.
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
            <label htmlFor="name" className={styles.label}>
              {form.role === 'vendor' ? 'Your name / store name' : 'Full name'}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className={styles.input}
              placeholder={form.role === 'vendor' ? 'e.g. Renu Devi Crafts' : 'e.g. Priya Sharma'}
              disabled={loading}
            />
          </div>

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
            <label htmlFor="password" className={styles.label}>
              Password <span className={styles.hint}>(min. 8 characters)</span>
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className={styles.input}
              placeholder="••••••••"
              disabled={loading}
            />
            {form.password && (
              <div className={styles.strengthBar}>
                <div
                  className={styles.strengthFill}
                  style={{
                    width: `${Math.min((form.password.length / 12) * 100, 100)}%`,
                    background: form.password.length < 8 ? '#EF4444'
                              : form.password.length < 12 ? '#F59E0B'
                              : '#22C55E',
                  }}
                />
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating account…'
              : form.role === 'vendor' ? 'Create seller account'
              : 'Create account'}
          </button>
        </form>

        <p className={styles.terms}>
          By joining you agree to our{' '}
          <Link to="/terms" className={styles.switchLink}>Terms</Link> and{' '}
          <Link to="/privacy" className={styles.switchLink}>Privacy Policy</Link>.
        </p>

        <p className={styles.switchText}>
          Already have an account?{' '}
          <Link to="/login" className={styles.switchLink}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;