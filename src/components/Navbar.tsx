
import { useState, useEffect } from 'react';
import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Lock,
  User,
  Plus,
  LogOut,
} from 'lucide-react';

import { useAdmin } from '../context/AdminContext';
import { useProducts } from '../context/ProductContext';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

const navLinks = [
  {
    name: 'Tech',
    href: '#tech',
    category: 'tech',
  },
  {
    name: 'Home',
    href: '#home',
    category: 'home',
  },
  {
    name: 'Fashion',
    href: '#fashion',
    category: 'fashion',
  },
  {
    name: 'Beauty',
    href: '#beauty',
    category: 'beauty',
  },
  {
    name: 'Fitness',
    href: '#fitness',
    category: 'fitness',
  },
];

const WISHLIST_STORAGE_KEY =
  'luxefinds_wishlist';

interface NavbarProps {
  onLoginClick: () => void;
  onSearchClick: () => void;
}

export default function Navbar({
  onLoginClick,
  onSearchClick,
}: NavbarProps) {
  const [scrolled, setScrolled] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  const [
    wishlistCount,
    setWishlistCount,
  ] = useState(0);

  const { isAdmin } = useAdmin();

  const { setActiveCategory } =
    useProducts();

  const navigate = useNavigate();

  // =====================================================
  // SCROLL
  // =====================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 50
      );
    };

    window.addEventListener(
      'scroll',
      handleScroll,
      { passive: true }
    );

    return () =>
      window.removeEventListener(
        'scroll',
        handleScroll
      );
  }, []);

  // =====================================================
  // WISHLIST COUNT
  // =====================================================

  const loadWishlistCount = () => {
    try {
      const stored =
        localStorage.getItem(
          WISHLIST_STORAGE_KEY
        );

      if (!stored) {
        setWishlistCount(0);
        return;
      }

      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        setWishlistCount(
          parsed.length
        );
      } else {
        setWishlistCount(0);
      }
    } catch {
      setWishlistCount(0);
    }
  };

  useEffect(() => {
    loadWishlistCount();

    // Update when another tab/window changes localStorage
    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key ===
        WISHLIST_STORAGE_KEY
      ) {
        loadWishlistCount();
      }
    };

    window.addEventListener(
      'storage',
      handleStorage
    );

    // Custom event for same-tab updates
    const handleWishlistUpdate =
      () => {
        loadWishlistCount();
      };

    window.addEventListener(
      'wishlistUpdated',
      handleWishlistUpdate
    );

    return () => {
      window.removeEventListener(
        'storage',
        handleStorage
      );

      window.removeEventListener(
        'wishlistUpdated',
        handleWishlistUpdate
      );
    };
  }, []);

  // Refresh count when navbar becomes visible/focused
  useEffect(() => {
    const handleFocus = () => {
      loadWishlistCount();
    };

    window.addEventListener(
      'focus',
      handleFocus
    );

    return () =>
      window.removeEventListener(
        'focus',
        handleFocus
      );
  }, []);

  // =====================================================
  // CATEGORY NAVIGATION
  // =====================================================

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    category: string
  ) => {
    e.preventDefault();

    setActiveCategory(category);

    const productsSection =
      document.getElementById(
        'products'
      );

    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: 'smooth',
      });
    }

    setMobileMenuOpen(false);
  };

  // =====================================================
  // WISHLIST NAVIGATION
  // =====================================================

  const handleWishlistClick = () => {
    setMobileMenuOpen(false);

    navigate('/wishlist');
  };

  return (
    <>
      {/* =================================================
          NAVBAR
      ================================================= */}

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{
          duration: 0.8,
          ease: [
            0.16,
            1,
            0.3,
            1,
          ],
        }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-lg shadow-black/5'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex items-center justify-between h-16 sm:h-20">

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              to="/"
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                });

                setActiveCategory(
                  'all'
                );

                setMobileMenuOpen(
                  false
                );
              }}
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <div
                className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300 bg-gradient-to-br from-[#d4af37] via-[#f4e5c2] to-[#b8860b] shadow-lg group-hover:shadow-xl group-hover:shadow-[#d4af37]/30`}
              >
                <span className="text-lg sm:text-2xl font-bold text-white logo-font">
                  L
                </span>
              </div>

              <div className="flex flex-col">

                <span
                  className={`text-lg sm:text-xl font-bold logo-font tracking-[0.15em] sm:tracking-[0.2em] transition-colors ${
                    scrolled
                      ? 'text-gray-900'
                      : 'text-white'
                  }`}
                >
                  LUXE
                </span>

                <span
                  className={`text-[10px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.3em] -mt-0.5 sm:-mt-1 transition-colors ${
                    scrolled
                      ? 'text-[#b8860b]'
                      : 'text-[#d4af37]'
                  }`}
                >
                  FINDS
                </span>

              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden md:flex items-center gap-4 lg:gap-6">

              {navLinks.map(
                (link) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        link.category
                      )
                    }
                    className={`text-sm font-medium transition-colors relative group whitespace-nowrap ${
                      scrolled
                        ? 'text-gray-700 hover:text-[#b8860b]'
                        : 'text-white/80 hover:text-white'
                    }`}
                    whileHover={{
                      y: -2,
                    }}
                  >
                    {link.name}

                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] transition-all duration-300 group-hover:w-full" />
                  </motion.a>
                )
              )}

            </div>

            {/* =================================================
                RIGHT SIDE
            ================================================= */}

            <div className="flex items-center gap-2 sm:gap-3">

              {/* SEARCH */}

              <motion.button
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={onSearchClick}
                className={`p-2 sm:p-2.5 rounded-full transition-colors ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </motion.button>

              {/* =================================================
                  DESKTOP WISHLIST
              ================================================= */}

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={
                  handleWishlistClick
                }
                className={`hidden md:flex items-center gap-1.5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-medium text-xs lg:text-sm transition-all relative ${
                  scrolled
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <span className="text-lg leading-none">
                  ♡
                </span>

                <span className="hidden lg:inline">
                  Wishlist
                </span>

                {wishlistCount > 0 && (
                  <span
                    className={`min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      scrolled
                        ? 'bg-red-500 text-white'
                        : 'bg-white text-red-500'
                    }`}
                  >
                    {wishlistCount >
                    99
                      ? '99+'
                      : wishlistCount}
                  </span>
                )}
              </motion.button>

              {/* =================================================
                  ADMIN ADD PRODUCT
              ================================================= */}

              {isAdmin && (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    navigate(
                      '/admin/add-product'
                    )
                  }
                  className="hidden md:flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-full font-medium text-sm hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30"
                >
                  <Plus className="w-4 h-4" />

                  <span>
                    Add Product
                  </span>
                </motion.button>
              )}

              {/* =================================================
                  ADMIN LOGIN
              ================================================= */}

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => {
                  if (isAdmin) {
                    navigate(
                      '/admin/products'
                    );
                  } else {
                    onLoginClick();
                  }
                }}
                className={`hidden md:flex items-center gap-1.5 lg:gap-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full font-medium text-xs lg:text-sm transition-all ${
                  isAdmin
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white shadow-lg'
                    : scrolled
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                {isAdmin ? (
                  <User className="w-3 h-3 lg:w-4 lg:h-4" />
                ) : (
                  <Lock className="w-3 h-3 lg:w-4 lg:h-4" />
                )}

                <span className="hidden lg:inline">
                  {isAdmin
                    ? 'Admin'
                    : 'Owner Login'}
                </span>

                <span className="lg:hidden">
                  {isAdmin
                    ? 'Admin'
                    : 'Login'}
                </span>
              </motion.button>

              {/* =================================================
                  SHOP
              ================================================= */}

              <motion.a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();

                  setActiveCategory(
                    'all'
                  );

                  document
                    .getElementById(
                      'products'
                    )
                    ?.scrollIntoView({
                      behavior:
                        'smooth',
                    });
                }}
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className={`hidden sm:flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-full font-semibold text-sm transition-all ${
                  scrolled
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-white text-black hover:bg-white/90'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />

                <span>
                  Shop
                </span>
              </motion.a>

              {/* =================================================
                  MOBILE MENU BUTTON
              ================================================= */}

              <motion.button
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() =>
                  setMobileMenuOpen(
                    !mobileMenuOpen
                  )
                }
                className={`md:hidden p-2 sm:p-2.5 rounded-full transition-colors ${
                  scrolled
                    ? 'hover:bg-gray-100 text-gray-700'
                    : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </motion.button>

            </div>
          </div>
        </div>
      </motion.nav>

      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -20,
            }}
            className="fixed inset-x-0 top-16 sm:top-20 z-30 bg-white shadow-xl md:hidden max-h-[80vh] overflow-y-auto"
          >
            <div className="p-4 space-y-1">

              {/* CATEGORY LINKS */}

              {navLinks.map(
                (link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay:
                        index * 0.05,
                    }}
                    onClick={(e) =>
                      handleNavClick(
                        e,
                        link.category
                      )
                    }
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-[#d4af37]/10 hover:text-[#b8860b] rounded-xl font-medium transition-colors"
                  >
                    {link.name}

                    <span className="text-xs text-gray-400">
                      →
                    </span>
                  </motion.a>
                )
              )}

              {/* SHOP ALL */}

              <motion.a
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.25,
                }}
                href="#products"
                onClick={(e) => {
                  e.preventDefault();

                  setActiveCategory(
                    'all'
                  );

                  document
                    .getElementById(
                      'products'
                    )
                    ?.scrollIntoView({
                      behavior:
                        'smooth',
                    });

                  setMobileMenuOpen(
                    false
                  );
                }}
                className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium sm:hidden"
              >
                Shop All Products

                <ShoppingBag className="w-4 h-4" />
              </motion.a>

              {/* =================================================
                  MOBILE WISHLIST
              ================================================= */}

              <motion.button
                initial={{
                  opacity: 0,
                  x: -20,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  delay: 0.27,
                }}
                onClick={
                  handleWishlistClick
                }
                className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-xl font-medium"
              >
                <span className="flex items-center gap-3">

                  <span className="text-xl text-red-500">
                    ♡
                  </span>

                  My Wishlist

                </span>

                {wishlistCount > 0 && (
                  <span className="min-w-[22px] h-[22px] px-1 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                    {wishlistCount >
                    99
                      ? '99+'
                      : wishlistCount}
                  </span>
                )}
              </motion.button>

              <div className="border-t border-gray-100 my-2 pt-2">

                {/* =================================================
                    MOBILE ADMIN ADD PRODUCT
                ================================================= */}

                {isAdmin && (
                  <motion.button
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.3,
                    }}
                    onClick={() => {
                      setMobileMenuOpen(
                        false
                      );

                      navigate(
                        '/admin/add-product'
                      );
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 bg-green-50 text-green-600 rounded-xl font-medium mb-2"
                  >
                    Add Product

                    <Plus className="w-4 h-4" />
                  </motion.button>
                )}

                {/* SEARCH */}

                <motion.button
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.33,
                  }}
                  onClick={() => {
                    setMobileMenuOpen(
                      false
                    );

                    onSearchClick();
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl font-medium"
                >
                  Search Products

                  <Search className="w-4 h-4" />
                </motion.button>

                {/* ADMIN */}

                <motion.button
                  initial={{
                    opacity: 0,
                    x: -20,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  transition={{
                    delay: 0.36,
                  }}
                  onClick={() => {
                    setMobileMenuOpen(
                      false
                    );

                    if (isAdmin) {
                      navigate(
                        '/admin/products'
                      );
                    } else {
                      onLoginClick();
                    }
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium ${
                    isAdmin
                      ? 'text-[#b8860b] bg-[#d4af37]/10'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isAdmin
                    ? 'Admin Dashboard'
                    : 'Owner Login'}

                  {isAdmin ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Lock className="w-4 h-4" />
                  )}
                </motion.button>

                {/* LOGOUT */}

                {isAdmin && (
                  <motion.button
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      delay: 0.4,
                    }}
                    onClick={() => {
                      setMobileMenuOpen(
                        false
                      );

                      window.dispatchEvent(
                        new CustomEvent(
                          'adminLogout'
                        )
                      );
                    }}
                    className="w-full flex items-center justify-between px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium"
                  >
                    Logout

                    <LogOut className="w-4 h-4" />
                  </motion.button>
                )}

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

