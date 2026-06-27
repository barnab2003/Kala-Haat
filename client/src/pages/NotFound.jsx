import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const NotFound = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>404</div>
    <h1 className={styles.title}>Page not found</h1>
    <p className={styles.desc}>The page you're looking for doesn't exist.</p>
    <Link to="/" className={styles.cta}>Go back →</Link>
  </div>
);

export default NotFound;