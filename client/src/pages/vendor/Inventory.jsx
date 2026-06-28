import { Link } from 'react-router-dom';
import styles from '../Page.module.css';

const Inventory = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Vendor — Phase 5</div>
    <h1 className={styles.title}>My products</h1>
    <p className={styles.desc}>Add, edit, hide, and restock your product listings.</p>
    <Link to="/vendor/dashboard" className={styles.cta}>Go back →</Link>
  </div>
);

export default Inventory;