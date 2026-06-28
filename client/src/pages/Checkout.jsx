import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const Checkout = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 4</div>
    <h1 className={styles.title}>Checkout</h1>
    <p className={styles.desc}>Stripe payment form and order summary.</p>
    <Link to="/orders" className={styles.cta}>Go back →</Link>
  </div>
);
export default Checkout;