import { Link } from 'react-router-dom';
import styles from './Page.module.css';

const ProductDetails = () => (
  <div className={styles.placeholder}>
    <div className={styles.badge}>Phase 3</div>
    <h1 className={styles.title}>Product detail</h1>
    <p className={styles.desc}>Image gallery, custom order configurator, and Add to cart.</p>
    <Link to="/" className={styles.cta}>Go back →</Link>
  </div>
);
export default ProductDetails;