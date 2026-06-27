import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute.jsx';

// ── Public pages ──────────────────────────────────────────────────────────────
import Home           from '../pages/Home.jsx';
import Shop           from '../pages/Shop.jsx';
import ProductDetails from '../pages/ProductDetails.jsx';
import ArtisanStore   from '../pages/ArtisanStore.jsx';
import CartPage       from '../pages/CartPage.jsx';
import Login          from '../pages/Login.jsx';
import Register       from '../pages/Register.jsx';
import NotFound       from '../pages/NotFound.jsx';

// ── Buyer-protected pages ─────────────────────────────────────────────────────
import Checkout    from '../pages/Checkout.jsx';
import OrderHistory from '../pages/OrderHistory.jsx';

// ── Vendor-protected pages ────────────────────────────────────────────────────
import VendorDashboard from '../pages/vendor/Dashboard.jsx';
import VendorInventory from '../pages/vendor/Inventory.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route path="/"                  element={<Home />} />
      <Route path="/shop"              element={<Shop />} />
      <Route path="/shop/:productId"   element={<ProductDetails />} />
      <Route path="/artisan/:vendorId" element={<ArtisanStore />} />
      <Route path="/cart"              element={<CartPage />} />
      <Route path="/login"             element={<Login />} />
      <Route path="/register"          element={<Register />} />

      {/* ── Buyer-protected (any logged-in user) ── */}
      <Route element={<PrivateRoute />}>
        <Route path="/checkout"      element={<Checkout />} />
        <Route path="/orders"        element={<OrderHistory />} />
      </Route>

      {/* ── Vendor-protected ── */}
      <Route element={<PrivateRoute requiredRole="vendor" />}>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/vendor/inventory" element={<VendorInventory />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;