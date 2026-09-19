
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  ExternalLink,
  Star,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';

const WISHLIST_STORAGE_KEY = 'luxefinds_wishlist';

export default function Wishlist() {
  const { products, trackAffiliateClick } = useProducts();

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      if (!stored) return [];

      const parsed = JSON.parse(stored);

      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // =====================================================
  // WISHLIST PRODUCTS
  // =====================================================

  const wishlistProducts = useMemo(() => {
    return products.filter((product) =>
      wishlistIds.includes(product.id)
    );
  }, [products, wishlistIds]);

  // =====================================================
  // REMOVE PRODUCT
  // =====================================================

  const removeFromWishlist = (productId: string) => {
    const updated = wishlistIds.filter(
      (id) => id !== productId
    );

    setWishlistIds(updated);

    localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(updated)
    );
  };

  // =====================================================
  // CLEAR ALL
  // =====================================================

  const clearWishlist = () => {
    setWishlistIds([]);

    localStorage.removeItem(
      WISHLIST_STORAGE_KEY
    );
  };

  // =====================================================
  // AFFILIATE CLICK
  // =====================================================

  const handleAffiliateClick = (product: any) => {
    const affiliateLink = String(
      product.affiliateLink || ''
    ).trim();

    const platformName = String(
      product.platformName || 'Amazon'
    ).trim();

    if (!affiliateLink) return;

    trackAffiliateClick(
      product,
      platformName
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">

          <div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>

            <div className="flex items-center gap-3">

              <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center">
                <span className="text-2xl text-red-500">
                  ♥
                </span>
              </div>

              <div>

                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  My Wishlist
                </h1>

                <p className="text-gray-500 mt-1">
                  {wishlistProducts.length === 0
                    ? 'No saved products'
                    : `${wishlistProducts.length} ${
                        wishlistProducts.length === 1
                          ? 'product'
                          : 'products'
                      } saved`}
                </p>

              </div>

            </div>
          </div>

          {/* Clear Wishlist */}

          {wishlistProducts.length > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear Wishlist
            </button>
          )}

        </div>

        {/* =================================================
            EMPTY WISHLIST
        ================================================= */}

        {wishlistProducts.length === 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm py-20 px-6 text-center"
          >

            <div className="w-20 h-20 mx-auto rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <span className="text-4xl text-gray-300">
                ♡
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 max-w-md mx-auto mt-3">
              Save products you love by clicking the ❤️
              button. Your favorite products will appear here.
            </p>

            <Link
              to="/"
              className="inline-flex items-center gap-2 mt-7 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Products
            </Link>

          </motion.div>
        )}

        {/* =================================================
            WISHLIST PRODUCTS
        ================================================= */}

        {wishlistProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">

            {wishlistProducts.map(
              (product, index) => {

                const image =
                  product.images &&
                  product.images.length > 0
                    ? product.images[0]
                    : '';

                const platformName = String(
                  product.platformName || 'Amazon'
                ).trim();

                const affiliateLink = String(
                  product.affiliateLink || ''
                ).trim();

                return (
                  <motion.div
                    key={product.id}
                    initial={{
                      opacity: 0,
                      y: 20,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                      delay: index * 0.04,
                    }}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
                  >

                    {/* =================================================
                        IMAGE
                    ================================================= */}

                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl text-gray-300">
                            ♡
                          </span>
                        </div>
                      )}

                      {/* Remove from Wishlist */}

                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product.id
                          )
                        }
                        className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 text-red-500 flex items-center justify-center shadow-sm hover:bg-red-500 hover:text-white transition-colors z-10"
                        title="Remove from wishlist"
                      >
                        <span className="text-xl">
                          ♥
                        </span>
                      </button>

                      {/* Badge */}

                      {product.badge && (
                        <div className="absolute bottom-3 left-3">
                          <span className="px-2.5 py-1 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full text-[10px] font-semibold shadow-sm">
                            {product.badge}
                          </span>
                        </div>
                      )}

                    </div>

                    {/* =================================================
                        PRODUCT CONTENT
                    ================================================= */}

                    <div className="p-4">

                      {/* Rating */}

                      <div className="flex items-center gap-1 mb-2">

                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                        <span className="text-sm font-medium text-gray-900">
                          {product.rating || '4.5'}
                        </span>

                        <span className="text-xs text-gray-400">
                          (
                          {Number(
                            product.reviews || 0
                          ).toLocaleString()}
                          )
                        </span>

                      </div>

                      {/* Name */}

                      <h2 className="font-semibold text-gray-900 text-base line-clamp-1">
                        {product.name}
                      </h2>

                      {/* Description */}

                      <p className="text-sm text-gray-500 mt-1 line-clamp-2 min-h-[40px]">
                        {product.description}
                      </p>

                      {/* Price + Platform */}

                      <div className="flex items-center justify-between gap-3 mt-5">

                        <span className="text-lg font-bold text-gray-900">
                          {product.price}
                        </span>

                        {affiliateLink && (
                          <motion.a
                            href={affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              handleAffiliateClick(
                                product
                              )
                            }
                            whileHover={{
                              scale: 1.02,
                            }}
                            whileTap={{
                              scale: 0.98,
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-gray-900 text-white rounded-full text-xs font-semibold whitespace-nowrap"
                          >
                            View on{' '}
                            {platformName}

                            <ExternalLink className="w-3.5 h-3.5" />
                          </motion.a>
                        )}

                      </div>

                    </div>
                  </motion.div>
                );
              }
            )}

          </div>
        )}

      </div>
    </div>
  );
}
