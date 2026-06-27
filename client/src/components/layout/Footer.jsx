import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>

        {/* Top grid */}
        <div className={styles.grid}>

          {/* Brand */}
          <div className={styles.brand}>
            <Link to="/" className={styles.logo}>Kala<span>Haat</span></Link>
            <p className={styles.tagline}>
              A marketplace built to sustain India's handcraft traditions —
              one honest sale at a time.
            </p>
            <div className={styles.socials}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="ti ti-brand-instagram" aria-hidden="true" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="ti ti-brand-facebook" aria-hidden="true" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">
                <i className="ti ti-brand-youtube" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Shop</h3>
            <nav>
              <Link to="/shop?category=paintings">Art & Paintings</Link>
              <Link to="/shop?category=textiles">Handloom & Textiles</Link>
              <Link to="/shop?category=food">Pickles & Food</Link>
              <Link to="/shop?category=craft">Pottery & Craft</Link>
              <Link to="/shop">All products</Link>
            </nav>
          </div>

          {/* Sell */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Sell</h3>
            <nav>
              <Link to="/register?role=vendor">Become a vendor</Link>
              <Link to="/vendor/dashboard">Vendor dashboard</Link>
              <Link to="/vendor/inventory">My products</Link>
            </nav>
          </div>

          {/* Help */}
          <div className={styles.col}>
            <h3 className={styles.colTitle}>Help</h3>
            <nav>
              <Link to="/orders">My orders</Link>
              <a href="mailto:support@kalahaat.in">Contact support</a>
              <Link to="/shipping">Shipping info</Link>
              <Link to="/returns">Returns policy</Link>
            </nav>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} KalaHaat. All rights reserved.</p>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy policy</Link>
            <Link to="/terms">Terms of service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;