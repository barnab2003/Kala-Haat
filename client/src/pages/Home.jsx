import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const Home = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 3</div>
    <h1 className={styles.title}>Homepage</h1>
    <p className={styles.desc}>
      Hero banner, category grid, featured products, and custom order banner will live here.
    </p>
    <Link to="/shop" className={styles.cta}>Browse shop →</Link>
  </div>
);

export default Home;