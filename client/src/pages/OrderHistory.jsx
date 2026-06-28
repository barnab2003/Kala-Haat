import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const OrderHistory = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 4</div>
    <h1 className={styles.title}>My orders</h1>
    <p className={styles.desc}>List of past and active orders with status tracking.</p>
    <Link to="/" className={styles.cta}>Go back →</Link>
  </div>
);
export default OrderHistory;