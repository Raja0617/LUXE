import { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Star,
  ExternalLink,
  TrendingUp,
  Award,
  Sparkles,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAdmin } from '../context/AdminContext';

const badgeIcons = {
  'Best Seller': TrendingUp,
  Trending: Sparkles,
  'Top Rated': Star,
  Premium: Award,
};

export default function FeaturedProducts() {
  const containerRef = useRef<HTMLDivElement>(null);

  const isInView = useInView(containerRef, {
    once: true,
    margin: '-100px',
  });

  const {
    getFeaturedProducts,
    deleteProduct,
    trackAffiliateClick,
  } = useProducts();

  const { isAdmin } = useAdmin();

  const featuredProducts = getFeaturedProducts();

  return (
    <section
      id="featured"
      className="py-16 sm:py-20 md:py-24 bg-gray-50"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : {}
          }
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-[#d4af37]/10 text-[#b8860b] rounded-full text-xs sm:text-sm font-semibold mb-4">
            Editor&apos;s Picks
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 logo-font tracking-wide">
            Featured Products
          </h2>

          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Hand-selected premium items that our community loves most
          </p>
        </motion.div>

        {/* Featured Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, index) => (
              <FeaturedProductCard
                key={product.id}
                product={product}
                index={index}
                isInView={isInView}
                isAdmin={isAdmin}
                deleteProduct={deleteProduct}
                trackAffiliateClick={trackAffiliateClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />

            <h3 className="text-lg font-semibold text-gray-700">
              No Featured Products
            </h3>

            <p className="text-sm text-gray-500 mt-2">
              Add a badge such as Best Seller or Trending to feature products here.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


// =====================================================
// FEATURED PRODUCT CARD
// =====================================================

interface FeaturedProductCardProps {
  product: any;
  index: number;
  isInView: boolean;
  isAdmin: boolean;
  deleteProduct: (id: string) => void;
  trackAffiliateClick: (
    product: any,
    platform: string
  ) => Promise<void>;
}

function FeaturedProductCard({
  product,
  index,
  isInView,
  isAdmin,
  deleteProduct,
  trackAffiliateClick,
}: FeaturedProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const BadgeIcon = product.badge
    ? badgeIcons[
        product.badge as keyof typeof badgeIcons
      ]
    : null;

  const images =
    product.images &&
    product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const hasMultipleImages = images.length > 1;

  // =====================================================
  // DYNAMIC AFFILIATE DATA
  // =====================================================

  // New products use platformName.
  // Existing products without platformName are treated
  // as Amazon so old products continue working.
  const platformName = String(
    product.platformName || 'Amazon'
  ).trim();

  const affiliateLink = String(
    product.affiliateLink || ''
  ).trim();

  // =====================================================
  // TRACK AFFILIATE CLICK
  // =====================================================

  const handleAffiliateClick = () => {
    if (!affiliateLink) {
      return;
    }

    trackAffiliateClick(
      product,
      platformName
    );
  };

  // =====================================================
  // IMAGE NAVIGATION
  // =====================================================

  const nextImage = (
    e: React.MouseEvent
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
    e: React.MouseEvent
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

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      animate={
        isInView
          ? {
              opacity: 1,
              y: 0,
            }
          : {}
      }
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 product-card"
    >

      {/* =================================================
          IMAGE CONTAINER
      ================================================= */}

      <div className="relative aspect-square overflow-hidden bg-gray-100">

        {/* Product Image */}
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
        )}

        {/* =================================================
            IMAGE NAVIGATION
        ================================================= */}

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <button
              type="button"
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-10"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

            {/* Image Indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {images.map(
                (_: string, idx: number) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      setCurrentImageIndex(
                        idx
                      );
                    }}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${
                      idx === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50'
                    }`}
                  />
                )
              )}
            </div>
          </>
        )}

        {/* =================================================
            BADGE
        ================================================= */}

        {product.badge &&
          BadgeIcon && (
            <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full text-xs font-semibold z-10 shadow-md">
              <BadgeIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />

              <span className="hidden sm:inline">
                {product.badge}
              </span>
            </div>
          )}

        {/* =================================================
            ADMIN DELETE BUTTON
        ================================================= */}

        {isAdmin && (
          <button
            type="button"
            onClick={() =>
              deleteProduct(product.id)
            }
            className="absolute top-3 sm:top-4 right-3 sm:right-4 w-7 h-7 sm:w-8 sm:h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-20"
            title="Delete product"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}

        {/* =================================================
            QUICK ACTION
        ================================================= */}

        {affiliateLink && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">

            <motion.a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAffiliateClick}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black rounded-full font-semibold text-xs sm:text-sm shadow-lg"
            >
              View on {platformName}

              <ExternalLink className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </motion.a>

          </div>
        )}
      </div>

      {/* =================================================
          PRODUCT CONTENT
      ================================================= */}

      <div className="p-4 sm:p-5">

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5 sm:mb-2">

          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />

          <span className="text-xs sm:text-sm font-medium text-gray-900">
            {product.rating || '4.5'}
          </span>

          <span className="text-xs text-gray-500 hidden sm:inline">
            (
            {Number(
              product.reviews || 0
            ).toLocaleString()}
            )
          </span>

        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-0.5 sm:mb-1 line-clamp-1 group-hover:text-[#b8860b] transition-colors text-sm sm:text-base">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3 line-clamp-2">
          {product.description}
        </p>

        {/* =================================================
            SIZES
        ================================================= */}

        {product.sizes &&
          product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">

              {product.sizes
                .slice(0, 3)
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

              {product.sizes.length > 3 && (
                <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] sm:text-xs">
                  +
                  {product.sizes.length -
                    3}
                </span>
              )}

            </div>
          )}

        {/* =================================================
            PRICE + PLATFORM BUTTON
        ================================================= */}

        <div className="flex items-center justify-between gap-3">

          <span className="text-base sm:text-xl font-bold text-gray-900">
            {product.price}
          </span>

          {affiliateLink && (
            <motion.a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleAffiliateClick}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 hover:bg-gradient-to-r hover:from-[#d4af37] hover:to-[#b8860b] hover:text-white rounded-full text-[10px] sm:text-xs font-semibold transition-all whitespace-nowrap"
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