
import { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import { AdminProvider, useAdmin } from './context/AdminContext';
import { ProductProvider } from './context/ProductContext'; 
import { ContactProvider } from './context/ContactContext';

import IntroVideo from './components/IntroVideo';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import ProductGrid from './components/ProductGrid';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import AdminLogin from './components/AdminLogin';
import SearchModal from './components/SearchModal';
import ShopFeatures from './components/ShopFeatures';

import PrivacyPolicy from './pages/PrivacyPolicy';
import Disclaimer from './pages/Disclaimer';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import ProductDetails from './pages/ProductDetails';

import AdminLayout from './pages/admin/AdminLayout';
import AdminProducts from './pages/admin/AdminProducts';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AffiliateAnalytics from './pages/AffiliateAnalytics';

import './App.css';


// =====================================================
// Scroll To Top
// =====================================================

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}


// =====================================================
// Protected Admin Route
// =====================================================

function ProtectedAdminRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}


// =====================================================
// Home Page
// =====================================================

function HomePage() {
  return (
    <main>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <ShopFeatures />
      <ProductGrid />
      <Newsletter />
    </main>
  );
}


// =====================================================
// Public Layout
// =====================================================

function PublicLayout({
  children,
  onLoginClick,
  onSearchClick,
}: {
  children: React.ReactNode;
  onLoginClick: () => void;
  onSearchClick: () => void;
}) {
  return (
    <>
      <Navbar
        onLoginClick={onLoginClick}
        onSearchClick={onSearchClick}
      />

      {children}

      <Footer />
    </>
  );
}


// =====================================================
// App Content
// =====================================================

function AppContent() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hasSeenIntro');

    if (hasSeenIntro) {
      setShowIntro(false);
    }

    setIsLoading(false);
  }, []);


  // ===================================================
  // Intro Complete
  // ===================================================

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hasSeenIntro', 'true');
  };


  // ===================================================
  // Loading Screen
  // ===================================================

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            duration: 1,
            repeat: Infinity,
          }}
          className="w-12 h-12 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-xl"
        />
      </div>
    );
  }


  // ===================================================
  // App
  // ===================================================

  return (
    <AnimatePresence mode="wait">

      {/* ================================================
          INTRO VIDEO
      ================================================= */}

      {showIntro ? (
        <IntroVideo
          key="intro"
          onComplete={handleIntroComplete}
        />
      ) : (

        <motion.div
          key="main"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="min-h-screen bg-white"
        >

          <BrowserRouter>

            <ScrollToTop />

            <Routes>

              {/* ==================================================
                  HOME
              ================================================== */}

              <Route
                path="/"
                element={
                  <PublicLayout
                    onLoginClick={() => setShowLogin(true)}
                    onSearchClick={() => setShowSearch(true)}
                  >
                    <HomePage />
                  </PublicLayout>
                }
              />


              {/* ==================================================
                  PRODUCT DETAILS
                  
                  Example:
                  /product/abc123
              ================================================== */}

              <Route
                path="/product/:productId"
                element={
                  <PublicLayout
                    onLoginClick={() => setShowLogin(true)}
                    onSearchClick={() => setShowSearch(true)}
                  >
                    <ProductDetails />
                  </PublicLayout>
                }
              />


              {/* ==================================================
                  WISHLIST
              ================================================== */}

              <Route
                path="/wishlist"
                element={
                  <PublicLayout
                    onLoginClick={() => setShowLogin(true)}
                    onSearchClick={() => setShowSearch(true)}
                  >
                    <Wishlist />
                  </PublicLayout>
                }
              />


              {/* ==================================================
                  PRIVACY POLICY
              ================================================== */}

              <Route
                path="/privacy"
                element={
                  <PublicLayout
                    onLoginClick={() => setShowLogin(true)}
                    onSearchClick={() => setShowSearch(true)}
                  >
                    <PrivacyPolicy />
                  </PublicLayout>
                }
              />


              {/* ==================================================
                  DISCLAIMER
              ================================================== */}

              <Route
                path="/disclaimer"
                element={
                  <PublicLayout
                    onLoginClick={() => setShowLogin(true)}
                    onSearchClick={() => setShowSearch(true)}
                  >
                    <Disclaimer />
                  </PublicLayout>
                }
              />


              {/* ==================================================
                  CONTACT
              ================================================== */}

              <Route
                path="/contact"
                element={
                  <PublicLayout
                    onLoginClick={() => setShowLogin(true)}
                    onSearchClick={() => setShowSearch(true)}
                  >
                    <Contact />
                  </PublicLayout>
                }
              />


              {/* ==================================================
                  ADMIN
              ================================================== */}

              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >

                {/* /admin */}
                <Route
                  index
                  element={
                    <Navigate
                      to="/admin/products"
                      replace
                    />
                  }
                />

                {/* /admin/products */}
                <Route
                  path="products"
                  element={<AdminProducts />}
                />

                {/* /admin/add-product */}
                <Route
                  path="add-product"
                  element={<AdminAddProduct />}
                />

                {/* /admin/affiliate-analytics */}
                <Route
                  path="affiliate-analytics"
                  element={<AffiliateAnalytics />}
                />

              </Route>


              {/* ==================================================
                  FALLBACK
                  
                  If someone enters an invalid URL,
                  send them back to Home.
              ================================================== */}

              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />

            </Routes>

          </BrowserRouter>


          {/* ====================================================
              ADMIN LOGIN MODAL
          ==================================================== */}

          <AdminLogin
            isOpen={showLogin}
            onClose={() => setShowLogin(false)}
          />


          {/* ====================================================
              SEARCH MODAL
          ==================================================== */}

          <SearchModal
            isOpen={showSearch}
            onClose={() => setShowSearch(false)}
          />

        </motion.div>
      )}

    </AnimatePresence>
  );
}


// =====================================================
// Main App
// =====================================================

function App() {
  return (
    <AdminProvider>
      <ProductProvider>
        <ContactProvider>
          <AppContent />
        </ContactProvider>
      </ProductProvider>
    </AdminProvider>
  );
}

export default App;
