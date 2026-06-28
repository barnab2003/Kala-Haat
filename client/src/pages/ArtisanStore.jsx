import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const ArtisanStore = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 3</div>
    <h1 className={styles.title}>Artisan storefront</h1>
    <p className={styles.desc}>Vendor bio, banner, and all their live listings.</p>
    <Link to="/shop" className={styles.cta}>Go back →</Link>
  </div>
);
export default ArtisanStore;