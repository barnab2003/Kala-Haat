import { Link } from 'react-router-dom';
import styles from '../Page.module.css';

const Dashboard = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Vendor — Phase 5</div>
    <h1 className={styles.title}>Vendor dashboard</h1>
    <p className={styles.desc}>Sales summary, earnings, recent orders, payout status.</p>
    <Link to="/" className={styles.cta}>Go back →</Link>
  </div>
);

export default Dashboard;