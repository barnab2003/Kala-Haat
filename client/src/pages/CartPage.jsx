import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const CartPage = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 3</div>
    <h1 className={styles.title}>Cart</h1>
    <p className={styles.desc}>Line items, quantities, totals, and proceed to checkout.</p>
    <Link to="/checkout" className={styles.cta}>Go back →</Link>
  </div>
);
export default CartPage;