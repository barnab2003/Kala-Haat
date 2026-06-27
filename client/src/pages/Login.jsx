import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const Login = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 2</div>
    <h1 className={styles.title}>Sign in</h1>
    <p className={styles.desc}>Email and password login form.</p>
    <Link to="/register" className={styles.cta}>Go back →</Link>
  </div>
);

export default Login;