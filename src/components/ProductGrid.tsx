
import { useRef, useState, type MouseEvent } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Star,
  ExternalLink,
  Filter,
  ChevronDown,
  Package,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useProducts } from '../context/ProductContext';
import { useAdmin } from '../context/AdminContext';

// =====================================================
// PRODUCT GRID
// =====================================================

export default function ProductGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, {
    once: true,
    margin: '-100px',
  });

  const {
    products,
    categories,
    deleteProduct,
    trackAffiliateClick,
    activeCategory,
    setActiveCategory,
    getProductsByCategory,
  } = useProducts();

  const { isAdmin } = useAdmin();

  const [showFilter, setShowFilter] = useState(false);

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : getProductsByCategory(activeCategory);

  return (
    <section
      id="products"
      className="py-16 sm:py-20 md:py-24 bg-white"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =====================================================
            SECTION HEADER
        ===================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isInView
              ? {
                  opacity: 1,
                  y: 0,
                }
              : {}
          }
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          <div>
            <motion.span
              key={activeCategory}
              initial={{
                opacity: 0,
                y: -10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-[#d4af37]/10 to-[#b8860b]/10 text-[#b8860b] rounded-full text-xs sm:text-sm font-semibold mb-3 sm:mb-4"
            >
              {activeCategory === 'all'
                ? 'All Products'
                : categories.find(
                    (c) => c.id === activeCategory
                  )?.name}
            </motion.span>

            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 logo-font tracking-wide">
              {activeCategory === 'all'
                ? 'Curated Collection'
                : 'Shop ' +
                  (categories.find(
                    (c) => c.id === activeCategory
                  )?.name || '')}
            </h2>
          </div>

          {/* =====================================================
              FILTER
          ===================================================== */}

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <motion.button
                type="button"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() =>
                  setShowFilter(!showFilter)
                }
                className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-3 bg-gray-100 rounded-full font-medium text-gray-700 hover:bg-gray-200 transition-colors text-xs sm:text-sm whitespace-nowrap"
              >
                <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />

                <span className="hidden sm:inline">
                  {activeCategory === 'all'
                    ? 'All Categories'
                    : categories.find(
                        (c) =>
                          c.id === activeCategory
                      )?.name}
                </span>

                <span className="sm:hidden">
                  Filter
                </span>

                <ChevronDown
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform ${
                    showFilter
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </motion.button>

              {/* FILTER DROPDOWN */}

              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                      scale: 0.95,
                    }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-72 overflow-y-auto"
                    style={{
                      maxWidth:
                        'calc(100vw - 2rem)',
                    }}
                  >
                    {/* ALL */}

                    <button
                      type="button"
                      onClick={() => {
                        setActiveCategory('all');
                        setShowFilter(false);
                      }}
                      className={`w-full px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-medium transition-colors ${
                        activeCategory === 'all'
                          ? 'bg-gradient-to-r from-[#d4af37]/10 to-[#b8860b]/10 text-[#b8860b]'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      All Categories
                    </button>

                    {/* CATEGORIES */}

                    {categories.map(
                      (category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => {
                            setActiveCategory(
                              category.id
                            );
                            setShowFilter(false);
                          }}
                          className={`w-full px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-medium transition-colors ${
                            activeCategory ===
                            category.id
                              ? 'bg-gradient-to-r from-[#d4af37]/10 to-[#b8860b]/10 text-[#b8860b]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          {category.name}
                        </button>
                      )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* =====================================================
            PRODUCTS
        ===================================================== */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map(
            (product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                categories={categories}
                isAdmin={isAdmin}
                deleteProduct={deleteProduct}
                trackAffiliateClick={
                  trackAffiliateClick
                }
              />
            )
          )}
        </div>

        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredProducts.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="text-center py-12 sm:py-20"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/20 mb-4 sm:mb-6">
              <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#b8860b]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Coming Soon
            </h3>

            <p className="text-gray-500 mb-4 sm:mb-6 max-w-md mx-auto px-4 text-sm sm:text-base">
              We&apos;re adding amazing products to
              this category. Check back soon for new
              arrivals!
            </p>

            <button
              type="button"
              onClick={() =>
                setActiveCategory('all')
              }
              className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Browse All Products
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// =====================================================
// PRODUCT CARD
// =====================================================

interface ProductCardProps {
  product: any;
  index: number;
  categories: any[];
  isAdmin: boolean;

  deleteProduct: (
    id: string
  ) => void;

  trackAffiliateClick: (
    product: any,
    platform: any
  ) => Promise<void>;
}

// =====================================================
// PRODUCT IMAGE HELPER
// =====================================================

function getProductImages(
  product: any
): string[] {
  if (Array.isArray(product?.images)) {
    return product.images
      .map((image: any) => {
        if (typeof image === 'string') {
          return image.trim();
        }

        if (
          image &&
          typeof image === 'object' &&
          typeof image.url === 'string'
        ) {
          return image.url.trim();
        }

        return '';
      })
      .filter(Boolean);
  }

  if (
    typeof product?.images === 'string' &&
    product.images.trim()
  ) {
    return [product.images.trim()];
  }

  if (
    typeof product?.image === 'string' &&
    product.image.trim()
  ) {
    return [product.image.trim()];
  }

  if (
    typeof product?.imageUrl === 'string' &&
    product.imageUrl.trim()
  ) {
    return [product.imageUrl.trim()];
  }

  return [];
}

// =====================================================
// PRODUCT CARD
// =====================================================

function ProductCard({
  product,
  index,
  categories,
  isAdmin,
  deleteProduct,
  trackAffiliateClick,
}: ProductCardProps) {
  const navigate = useNavigate();

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(0);

  // =====================================================
  // IMAGES
  // =====================================================

  const images = getProductImages(product);

  const hasMultipleImages =
    images.length > 1;

  // Prevent an invalid image index
  const safeImageIndex =
    currentImageIndex < images.length
      ? currentImageIndex
      : 0;

  // =====================================================
  // PLATFORM
  // =====================================================

  const platformName =
    String(
      product?.platformName || ''
    ).trim() || 'Store';

  const affiliateLink =
    String(
      product?.affiliateLink || ''
    ).trim();

  // =====================================================
  // OPEN PRODUCT DETAILS
  // =====================================================

  const openProductDetails = (
    e?: MouseEvent
  ) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!product?.id) {
      console.error(
        'Product ID is missing:',
        product
      );
      return;
    }

    navigate(
      `/product/${product.id}`
    );
  };

  // =====================================================
  // IMAGE CONTROLS
  // =====================================================

  const nextImage = (
    e: MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (images.length === 0) {
      return;
    }

    setCurrentImageIndex(
      (prev) =>
        (prev + 1) % images.length
    );
  };

  const prevImage = (
    e: MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (images.length === 0) {
      return;
    }

    setCurrentImageIndex(
      (prev) =>
        (prev - 1 + images.length) %
        images.length
    );
  };

  // =====================================================
  // IMAGE DOT
  // =====================================================

  const selectImage = (
    e: MouseEvent,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrentImageIndex(index);
  };

  // =====================================================
  // AFFILIATE CLICK
  // =====================================================

  const handleAffiliateClick = (
    e: MouseEvent
  ) => {
    e.stopPropagation();

    if (!affiliateLink) {
      e.preventDefault();
      return;
    }

    void trackAffiliateClick(
      product,
      platformName
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = (
    e: MouseEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!product?.id) {
      return;
    }

    deleteProduct(product.id);
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        scale: 0.9,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      exit={{
        opacity: 0,
        scale: 0.9,
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={() =>
        openProductDetails()
      }
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-500 cursor-pointer"
    >
      {/* =====================================================
          IMAGE
      ===================================================== */}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
        {images.length > 0 ? (
          <img
            src={images[safeImageIndex]}
            alt={product?.name || 'Product'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display =
                'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
        )}

        {/* ===================================================
            IMAGE NAVIGATION
        =================================================== */}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

            {/* DOTS */}

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) =>
                    selectImage(
                      e,
                      idx
                    )
                  }
                  aria-label={`View image ${
                    idx + 1
                  }`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    idx ===
                    safeImageIndex
                      ? 'bg-white'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* ===================================================
            CATEGORY
        =================================================== */}

        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10">
          <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-medium text-gray-700">
            {categories.find(
              (c) =>
                c.id === product?.category
            )?.name ||
              product?.category ||
              'Product'}
          </span>
        </div>

        {/* ===================================================
            DELETE
        =================================================== */}

        {isAdmin && (
          <button
            type="button"
            onClick={handleDelete}
            title="Delete product"
            className="absolute top-2 sm:top-3 right-2 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* ===================================================
            BADGE
        =================================================== */}

        {product?.badge && (
          <div className="absolute top-12 sm:top-14 left-2 sm:left-3 z-20">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full text-[10px] sm:text-xs font-semibold shadow-md">
              {product.badge}
            </span>
          </div>
        )}

        {/* ===================================================
            QUICK AFFILIATE BUTTON
        =================================================== */}

        {affiliateLink && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
              <motion.a
                href={affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={
                  handleAffiliateClick
                }
                className="pointer-events-auto flex items-center justify-center gap-1.5 sm:gap-2 w-full py-2 sm:py-3 bg-white text-black rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm btn-shine shadow-lg"
              >
                View on {platformName}

                <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </motion.a>
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT CONTENT
      ===================================================== */}

      <div className="p-3 sm:p-5">

        {/* RATING */}

        <div className="flex items-center gap-1.5 mb-1 sm:mb-2">
          <div className="flex items-center gap-0.5">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />

            <span className="text-xs sm:text-sm font-medium text-gray-900">
              {product?.rating || '4.5'}
            </span>
          </div>

          <span className="text-gray-300">
            |
          </span>

          <span className="text-xs text-gray-500">
            {Number(
              product?.reviews || 0
            ).toLocaleString()}

            <span className="hidden sm:inline">
              {' '}
              reviews
            </span>
          </span>
        </div>

        {/* PRODUCT NAME */}

        <h3
          onClick={openProductDetails}
          className="font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-[#b8860b] transition-colors text-sm sm:text-base"
        >
          {product?.name ||
            'Unnamed Product'}
        </h3>

        {/* DESCRIPTION */}

        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-4 line-clamp-2">
          {product?.description ||
            'No description available.'}
        </p>

        {/* SIZES */}

        {Array.isArray(
          product?.sizes
        ) &&
          product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 sm:mb-3">
              {product.sizes
                .slice(0, 4)
                .map(
                  (size: string) => (
                    <span
                      key={size}
                      className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] sm:text-xs"
                    >
                      {size}
                    </span>
                  )
                )}

              {product.sizes.length >
                4 && (
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] sm:text-xs">
                  +
                  {product.sizes.length -
                    4}
                </span>
              )}
            </div>
          )}

        {/* =====================================================
            PRICE + PLATFORM
        ===================================================== */}

        <div className="flex items-center justify-between gap-3">
          <span className="text-base sm:text-lg font-bold text-gray-900">
            {product?.price || 'Price unavailable'}
          </span>

          {affiliateLink && (
            <motion.a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={
                handleAffiliateClick
              }
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#b8860b] hover:text-white rounded-full text-[10px] sm:text-xs font-semibold transition-all"
            >
              View on {platformName}

              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

