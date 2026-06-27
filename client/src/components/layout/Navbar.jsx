import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import useCartStore from '../../features/cart/cartStore.js';
import styles from './Navbar.module.css';

const Navbar = () => {
  const { user, isAuthenticated, isVendor, logout } = useAuth();
  const totalItems = useCartStore((s) => s.totalItems());
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>

        {/* Logo */}
        <Link to="/" className={styles.logo}>
          Kala<span>Haat</span>
        </Link>

        {/* Centre nav links */}
        <ul className={styles.navLinks}>
          <li><NavLink to="/shop" className={({ isActive }) => isActive ? styles.activeLink : ''}>Shop</NavLink></li>
          <li><NavLink to="/shop?category=paintings" className={({ isActive }) => isActive ? styles.activeLink : ''}>Art</NavLink></li>
          <li><NavLink to="/shop?category=textiles" className={({ isActive }) => isActive ? styles.activeLink : ''}>Textiles</NavLink></li>
          <li><NavLink to="/shop?category=food" className={({ isActive }) => isActive ? styles.activeLink : ''}>Food</NavLink></li>
          <li><NavLink to="/shop?category=craft" className={({ isActive }) => isActive ? styles.activeLink : ''}>Craft</NavLink></li>
        </ul>

        {/* Right side — search, cart, account */}
        <div className={styles.navRight}>

          {/* Search */}
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <i className="ti ti-search" aria-hidden="true" />
            <input
              type="text"
              placeholder="Search handmade goods…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>

          {/* Cart */}
          <Link to="/cart" className={styles.iconBtn} aria-label={`Cart (${totalItems} items)`}>
            <i className="ti ti-shopping-cart" aria-hidden="true" />
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems > 99 ? '99+' : totalItems}</span>
            )}
          </Link>

          {/* Account */}
          {isAuthenticated ? (
            <div className={styles.accountMenu}>
              <button className={styles.avatarBtn} aria-label="Account menu">
                <span className={styles.avatar}>{user?.name?.[0]?.toUpperCase() ?? 'U'}</span>
              </button>
              <div className={styles.dropdown}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.dropdownName}>{user?.name}</span>
                  <span className={styles.dropdownRole}>{user?.role}</span>
                </div>
                <Link to="/orders" className={styles.dropdownItem}>
                  <i className="ti ti-package" aria-hidden="true" /> My orders
                </Link>
                {isVendor && (
                  <>
                    <Link to="/vendor/dashboard" className={styles.dropdownItem}>
                      <i className="ti ti-chart-bar" aria-hidden="true" /> Dashboard
                    </Link>
                    <Link to="/vendor/inventory" className={styles.dropdownItem}>
                      <i className="ti ti-box" aria-hidden="true" /> My products
                    </Link>
                  </>
                )}
                <div className={styles.dropdownDivider} />
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  <i className="ti ti-logout" aria-hidden="true" /> Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.loginLink}>Sign in</Link>
              <Link to="/register" className={styles.registerBtn}>Join free</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={menuOpen ? 'ti ti-x' : 'ti ti-menu-2'} aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <Link to="/shop" onClick={() => setMenuOpen(false)}>Shop all</Link>
          <Link to="/shop?category=paintings" onClick={() => setMenuOpen(false)}>Art & Paintings</Link>
          <Link to="/shop?category=textiles" onClick={() => setMenuOpen(false)}>Handloom & Textiles</Link>
          <Link to="/shop?category=food" onClick={() => setMenuOpen(false)}>Pickles & Food</Link>
          <Link to="/shop?category=craft" onClick={() => setMenuOpen(false)}>Pottery & Craft</Link>
          <div className={styles.mobileDivider} />
          {isAuthenticated ? (
            <button onClick={handleLogout} className={styles.mobileLogout}>Sign out</button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Sign in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)}>Join free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;