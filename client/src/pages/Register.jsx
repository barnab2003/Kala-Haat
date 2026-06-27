import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const Register = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 2</div>
    <h1 className={styles.title}>Create account</h1>
    <p className={styles.desc}>Buyer or vendor registration form.</p>
    <Link to="/login" className={styles.cta}>Go back →</Link>
  </div>
);

export default Register;