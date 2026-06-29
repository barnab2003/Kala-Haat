
import { Link } from 'react-router-dom';
import styles from './Home.module.css';

const CATEGORIES = [
  { key: 'paintings', emoji: '🎨', label: 'Paintings & Art',       count: '240+' },
  { key: 'textiles',  emoji: '🧵', label: 'Handloom & Textiles',   count: '380+' },
  { key: 'food',      emoji: '🫙', label: 'Pickles & Sweet',       count: '160+' },
  { key: 'craft',     emoji: '🏺', label: 'Pottery & Craft',       count: '290+' },
  { key: 'wood',      emoji: '🪵', label: 'Wood Carving',          count: '120+' },
  { key: 'cookies',   emoji: '🍪', label: 'Cookies & Bakes',       count: '95+'  },
];

const FEATURED = [
  { id: '1', emoji: '🖼️', name: 'Madhubani Landscape',    vendor: 'Renu Devi',     location: 'Bihar',       price: 3200,  badge: 'New',    bg: '#FFF3ED' },
  { id: '2', emoji: '🧣', name: 'Kantha Stitch Shawl',    vendor: 'Rekha Ghosh',   location: 'West Bengal', price: 2400,  badge: 'Custom', bg: '#EBF2EB' },
  { id: '3', emoji: '🍪', name: 'Nankhatai Cookie Box',   vendor: "Meera's Bakehouse", location: 'Pune',    price: 450,   badge: null,     bg: '#F0ECF8' },
  { id: '4', emoji: '🫙', name: 'Andhra Mango Pickle',    vendor: "Lakshmi's Kitchen", location: 'Vizag',   price: 320,   badge: 'Sale',   bg: '#FBF5E6' },
  { id: '5', emoji: '🏺', name: 'Blue Pottery Vase',      vendor: 'Gopal Singh',   location: 'Jaipur',      price: 950,   badge: 'New',    bg: '#EEF4FA' },
  { id: '6', emoji: '🌸', name: 'Phulkari Embroidery',    vendor: 'Gurpreet Kaur', location: 'Punjab',      price: 3100,  badge: 'Custom', bg: '#FDF0F0' },
  { id: '7', emoji: '🪵', name: 'Sheesham Wood Carving',  vendor: 'Ramesh Kumhar', location: 'Jodhpur',     price: 5600,  badge: null,     bg: '#F4FBF0' },
  { id: '8', emoji: '🍬', name: 'Rajasthani Beaded Pouch',vendor: 'Fatima Bi',     location: 'Barmer',      price: 680,   badge: 'New',    bg: '#F8F0F8' },
];

const BADGE_COLORS = {
  New:    { bg: '#E8F4E8', color: '#2E7D32' },
  Custom: { bg: '#FFF3E0', color: '#E65100' },
  Sale:   { bg: '#FFEBEE', color: '#C62828' },
};

const Home = () => (
  <div className={styles.page}>

    {/* ── Hero ── */}
    <section className={styles.hero}>
      <div className={styles.heroText}>
        <span className={styles.heroEyebrow}>Handcrafted with intention</span>
        <h1 className={styles.heroH1}>
          Art &amp; Craft<br />Made <em>Just</em><br />For You
        </h1>
        <p className={styles.heroSub}>
          Discover unique pieces from India's finest artisans — paintings,
          handlooms, pickles, pottery, and more. Every item tells a story.
        </p>
        <Link to="/shop" className={styles.heroCta}>
          Explore handmade <i className="ti ti-arrow-right" aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.heroImage}>
        <div className={styles.heroImgPlaceholder}>
          <span>🎨</span>
          <p>Hero lifestyle image</p>
        </div>
        <div className={styles.heroCard}>
          <div className={styles.heroCardName}>Madhubani Landscape</div>
          <div className={styles.heroCardVendor}>by Renu Devi, Bihar</div>
          <div className={styles.heroCardPrice}>
            ₹3,200
            <i className="ti ti-arrow-right" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>

    {/* ── Trust bar ── */}
    <div className={styles.trustBar}>
      {[
        { icon: 'ti-award',          title: 'Authentic artisans',  sub: 'Every seller verified'    },
        { icon: 'ti-settings-2',     title: 'Custom orders',       sub: 'Your spec, their craft'   },
        { icon: 'ti-truck-delivery', title: 'Secure shipping',     sub: 'Tracked to your door'     },
        { icon: 'ti-headset',        title: 'Buyer support',       sub: 'Help when you need it'    },
      ].map((t) => (
        <div key={t.icon} className={styles.trustItem}>
          <i className={`ti ${t.icon}`} aria-hidden="true" />
          <div>
            <div className={styles.trustTitle}>{t.title}</div>
            <div className={styles.trustSub}>{t.sub}</div>
          </div>
        </div>
      ))}
    </div>

    {/* ── Categories ── */}
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Browse categories</h2>
        <Link to="/shop" className={styles.sectionLink}>
          All categories <i className="ti ti-arrow-right" aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.key}
            to={`/shop?category=${cat.key}`}
            className={styles.catCard}
          >
            <div className={styles.catEmoji}>{cat.emoji}</div>
            <div className={styles.catInfo}>
              <div className={styles.catName}>{cat.label}</div>
              <div className={styles.catCount}>{cat.count} listings</div>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* ── Featured products ── */}
    <section className={styles.section} style={{ background: 'var(--color-surface-1)' }}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Featured products</h2>
        <Link to="/shop" className={styles.sectionLink}>
          Show more <i className="ti ti-arrow-right" aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.productGrid}>
        {FEATURED.map((p) => (
          <Link key={p.id} to={`/shop/${p.id}`} className={styles.productCard}>
            <div className={styles.prodImg} style={{ background: p.bg }}>
              <span>{p.emoji}</span>
              {p.badge && (
                <span
                  className={styles.badge}
                  style={BADGE_COLORS[p.badge]}
                >
                  {p.badge}
                </span>
              )}
              <div className={styles.prodActions}>
                <button
                  className={styles.saveBtn}
                  onClick={(e) => e.preventDefault()}
                  aria-label="Save to wishlist"
                >
                  <i className="ti ti-heart" aria-hidden="true" /> Save
                </button>
                <button
                  className={styles.cartBtn}
                  onClick={(e) => e.preventDefault()}
                  aria-label="Add to cart"
                >
                  <i className="ti ti-shopping-cart" aria-hidden="true" /> Add to cart
                </button>
              </div>
            </div>
            <div className={styles.prodInfo}>
              <div className={styles.prodName}>{p.name}</div>
              <div className={styles.prodVendor}>
                {p.vendor} · {p.location}
              </div>
              <div className={styles.prodFooter}>
                <span className={styles.prodPrice}>₹{p.price.toLocaleString('en-IN')}</span>
                <span className={styles.prodStars}>★★★★★</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>

    {/* ── Custom order banner ── */}
    <section className={styles.customBanner}>
      <div className={styles.customLeft}>
        <span className={styles.customEyebrow}>Bespoke made easy</span>
        <h2 className={styles.customTitle}>
          Want something<br />made just for you?
        </h2>
        <p className={styles.customSub}>
          Tell artisans exactly what you want — wood type, canvas size,
          spice level, embroidery pattern. They'll craft it to your spec.
        </p>
        <Link to="/shop" className={styles.customCta}>
          Place a custom order <i className="ti ti-arrow-right" aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.customFeatures}>
        {[
          { icon: 'ti-ruler-2',     title: 'Specify every detail',          sub: 'Size, material, colour, finish — you choose'         },
          { icon: 'ti-messages',    title: 'Chat with the artisan',          sub: 'Agree on design before production starts'            },
          { icon: 'ti-shield-check',title: 'Payment held in escrow',         sub: 'Released only when you approve the result'           },
        ].map((f) => (
          <div key={f.icon} className={styles.customFeat}>
            <i className={`ti ${f.icon}`} aria-hidden="true" />
            <div>
              <div className={styles.customFeatTitle}>{f.title}</div>
              <div className={styles.customFeatSub}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Artisan strip ── */}
    <section className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Meet our artisans</h2>
        <Link to="/shop" className={styles.sectionLink}>
          All artisans <i className="ti ti-arrow-right" aria-hidden="true" />
        </Link>
      </div>
      <div className={styles.vendorGrid}>
        {[
          { initials: 'RD', name: 'Renu Devi',      craft: 'Madhubani painter · Bihar',       sales: 142, rating: 4.9, color: '#FFF3E0', text: '#E65100', id: '1' },
          { initials: 'RG', name: 'Rekha Ghosh',    craft: 'Kantha weaver · West Bengal',     sales: 89,  rating: 4.8, color: '#E0F7FA', text: '#006064', id: '2' },
          { initials: 'GK', name: 'Gurpreet Kaur',  craft: 'Phulkari artisan · Punjab',       sales: 211, rating: 5.0, color: '#F3E5F5', text: '#6A1B9A', id: '3' },
          { initials: 'GS', name: 'Gopal Singh',    craft: 'Blue pottery · Jaipur',           sales: 67,  rating: 4.7, color: '#E8F5E9', text: '#2E7D32', id: '4' },
        ].map((v) => (
          <Link key={v.id} to={`/artisan/${v.id}`} className={styles.vendorCard}>
            <div className={styles.vendorAvatar} style={{ background: v.color, color: v.text }}>
              {v.initials}
            </div>
            <div className={styles.vendorName}>{v.name}</div>
            <div className={styles.vendorCraft}>{v.craft}</div>
            <div className={styles.vendorStat}>{v.sales} sales · ★ {v.rating}</div>
          </Link>
        ))}
      </div>
    </section>

  </div>
);

export default Home;
