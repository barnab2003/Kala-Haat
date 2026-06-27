import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const Shop = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 3</div>
    <h1 className={styles.title}>Shop</h1>
    <p className={styles.desc}>Product grid with filters — search, category, price range.</p>
    <Link to="/shop/:productId" className={styles.cta}>Go back →</Link>
  </div>
);

export default Shop;