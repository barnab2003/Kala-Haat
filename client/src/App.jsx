import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import AppRoutes from './routes/AppRoutes.jsx';

const App = () => {
  return (
    <>
      <Navbar />
      {/* All page content renders here, between the nav and footer */}
      <main style={{ minHeight: 'calc(100vh - 64px)' }}>
        <AppRoutes />
      </main>
      <Footer />
    </>
  );
};

export default App;