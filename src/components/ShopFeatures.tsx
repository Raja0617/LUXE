
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star,
  ExternalLink,
  ChevronDown,
  X,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';

type SortOption =
  | 'popular'
  | 'price-low'
  | 'price-high'
  | 'rating'
  | 'newest';

type DealTab =
  | 'today'
  | 'best'
  | 'under999'
  | 'trending'
  | 'new';

const WISHLIST_STORAGE_KEY = 'luxefinds_wishlist';

export default function ShopFeatures() {
  const {
    products,
    categories,
    trackAffiliateClick,
  } = useProducts();

  const [sortBy, setSortBy] =
    useState<SortOption>('popular');

  const [categoryFilter, setCategoryFilter] =
    useState('all');

  const [platformFilter, setPlatformFilter] =
    useState('all');

  const [ratingFilter, setRatingFilter] =
    useState('all');

  const [badgeFilter, setBadgeFilter] =
    useState('all');

  const [priceFilter, setPriceFilter] =
    useState('all');

  const [dealTab, setDealTab] =
    useState<DealTab>('today');

  const [showFilters, setShowFilters] =
    useState(false);

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(
        WISHLIST_STORAGE_KEY
      );

      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // =========================================================
  // PRICE HELPER
  // =========================================================

  const getNumericPrice = (price: string) => {
    if (!price) return 0;

    const cleaned = String(price)
      .replace(/,/g, '')
      .replace(/[^\d.]/g, '');

    const value = parseFloat(cleaned);

    return Number.isFinite(value) ? value : 0;
  };

  // =========================================================
  // WISHLIST
  // =========================================================

  const toggleWishlist = (productId: string) => {
    setWishlist((current) => {
      const exists = current.includes(productId);

      const updated = exists
        ? current.filter((id) => id !== productId)
        : [...current, productId];

      localStorage.setItem(
        WISHLIST_STORAGE_KEY,
        JSON.stringify(updated)
      );
      window.dispatchEvent(
  new Event('wishlistUpdated')
);

      return updated;
    });
  };

  // =========================================================
  // PLATFORMS
  // =========================================================

  const platforms = useMemo(() => {
    const values = products
      .map((product) =>
        String(product.platformName || 'Amazon').trim()
      )
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [products]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(
        (product) =>
          product.category === categoryFilter
      );
    }

    // Platform
    if (platformFilter !== 'all') {
      result = result.filter(
        (product) =>
          String(
            product.platformName || 'Amazon'
          ).toLowerCase() ===
          platformFilter.toLowerCase()
      );
    }

    // Rating
    if (ratingFilter !== 'all') {
      const minimumRating =
        Number(ratingFilter);

      result = result.filter(
        (product) =>
          Number(product.rating || 0) >=
          minimumRating
      );
    }

    // Badge
    if (badgeFilter !== 'all') {
      result = result.filter(
        (product) =>
          product.badge === badgeFilter
      );
    }

    // Price
    if (priceFilter !== 'all') {
      if (priceFilter === 'under999') {
        result = result.filter(
          (product) =>
            getNumericPrice(product.price) < 999
        );
      }

      if (priceFilter === '999-2499') {
        result = result.filter((product) => {
          const price = getNumericPrice(
            product.price
          );

          return price >= 999 && price <= 2499;
        });
      }

      if (priceFilter === '2500-4999') {
        result = result.filter((product) => {
          const price = getNumericPrice(
            product.price
          );

          return price >= 2500 && price <= 4999;
        });
      }

      if (priceFilter === '5000+') {
        result = result.filter(
          (product) =>
            getNumericPrice(product.price) >= 5000
        );
      }
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort(
        (a, b) =>
          getNumericPrice(a.price) -
          getNumericPrice(b.price)
      );
    }

    if (sortBy === 'price-high') {
      result.sort(
        (a, b) =>
          getNumericPrice(b.price) -
          getNumericPrice(a.price)
      );
    }

    if (sortBy === 'rating') {
      result.sort(
        (a, b) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sortBy === 'popular') {
      result.sort(
        (a, b) =>
          Number(b.reviews || 0) -
          Number(a.reviews || 0)
      );
    }

    if (sortBy === 'newest') {
      result.reverse();
    }

    return result;
  }, [
    products,
    categoryFilter,
    platformFilter,
    ratingFilter,
    badgeFilter,
    priceFilter,
    sortBy,
  ]);

  // =========================================================
  // DEAL PRODUCTS
  // =========================================================

  const dealProducts = useMemo(() => {
    const sorted = [...products];

    if (dealTab === 'today') {
      return sorted
        .filter(
          (product) =>
            product.badge === 'Best Seller' ||
            product.badge === 'Premium' ||
            getNumericPrice(product.price) < 999
        )
        .slice(0, 8);
    }

    if (dealTab === 'best') {
      return sorted
        .sort(
          (a, b) =>
            Number(b.reviews || 0) -
            Number(a.reviews || 0)
        )
        .slice(0, 8);
    }

    if (dealTab === 'under999') {
      return sorted
        .filter(
          (product) =>
            getNumericPrice(product.price) < 999
        )
        .slice(0, 8);
    }

    if (dealTab === 'trending') {
      return sorted
        .filter(
          (product) =>
            product.badge === 'Trending'
        )
        .slice(0, 8);
    }

    if (dealTab === 'new') {
      return sorted.reverse().slice(0, 8);
    }

    return sorted.slice(0, 8);
  }, [products, dealTab]);

  // =========================================================
  // RESET
  // =========================================================

  const resetFilters = () => {
    setCategoryFilter('all');
    setPlatformFilter('all');
    setRatingFilter('all');
    setBadgeFilter('all');
    setPriceFilter('all');
    setSortBy('popular');
  };

  return (
    <section
      id="shop-features"
      className="py-16 sm:py-20 md:py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* =================================================
            DEALS / OFFERS
        ================================================= */}

        <div className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#d4af37]/10 text-[#b8860b] rounded-full text-xs sm:text-sm font-semibold">
              <span>🔥</span>
              Deals & Offers
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 logo-font">
              Discover Great Deals
            </h2>

            <p className="text-gray-500 mt-2">
              Find trending products, popular picks and special offers.
            </p>
          </div>

          {/* Deal Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            <DealButton
              active={dealTab === 'today'}
              onClick={() => setDealTab('today')}
              icon="🔥"
            >
              Today&apos;s Deals
            </DealButton>

            <DealButton
              active={dealTab === 'best'}
              onClick={() => setDealTab('best')}
              icon="🏷️"
            >
              Best Deals
            </DealButton>

            <DealButton
              active={dealTab === 'under999'}
              onClick={() => setDealTab('under999')}
              icon="🏷️"
            >
              Under ₹999
            </DealButton>

            <DealButton
              active={dealTab === 'trending'}
              onClick={() => setDealTab('trending')}
              icon="✨"
            >
              Trending
            </DealButton>

            <DealButton
              active={dealTab === 'new'}
              onClick={() => setDealTab('new')}
              icon="✨"
            >
              New Arrivals
            </DealButton>
          </div>

          {/* Deal Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {dealProducts.map((product) => (
              <MiniProductCard
                key={product.id}
                product={product}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                trackAffiliateClick={
                  trackAffiliateClick
                }
              />
            ))}
          </div>

          {dealProducts.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-2xl">
              <span className="text-3xl">🏷️</span>

              <p className="text-gray-500 mt-3">
                No products available in this section yet.
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            SHOP FILTER
        ================================================= */}

        <div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5 mb-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-semibold">
                <span>☰</span>
                Shop
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-3 logo-font">
                Browse Products
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm font-semibold text-gray-700 transition-colors lg:hidden"
            >
              <span>☰</span>
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block bg-gray-50 rounded-2xl p-4 sm:p-5 mb-6`}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">

              {/* Category */}
              <FilterSelect
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </FilterSelect>

              {/* Platform */}
              <FilterSelect
                label="Platform"
                value={platformFilter}
                onChange={setPlatformFilter}
              >
                <option value="all">
                  All Platforms
                </option>

                {platforms.map((platform) => (
                  <option
                    key={platform}
                    value={platform}
                  >
                    {platform}
                  </option>
                ))}
              </FilterSelect>

              {/* Price */}
              <FilterSelect
                label="Price"
                value={priceFilter}
                onChange={setPriceFilter}
              >
                <option value="all">
                  All Prices
                </option>

                <option value="under999">
                  Under ₹999
                </option>

                <option value="999-2499">
                  ₹999 - ₹2,499
                </option>

                <option value="2500-4999">
                  ₹2,500 - ₹4,999
                </option>

                <option value="5000+">
                  ₹5,000+
                </option>
              </FilterSelect>

              {/* Rating */}
              <FilterSelect
                label="Rating"
                value={ratingFilter}
                onChange={setRatingFilter}
              >
                <option value="all">
                  All Ratings
                </option>

                <option value="4">
                  4★ & above
                </option>

                <option value="4.5">
                  4.5★ & above
                </option>

                <option value="4.8">
                  4.8★ & above
                </option>
              </FilterSelect>

              {/* Badge */}
              <FilterSelect
                label="Type"
                value={badgeFilter}
                onChange={setBadgeFilter}
              >
                <option value="all">
                  All Products
                </option>

                <option value="Best Seller">
                  Best Seller
                </option>

                <option value="Trending">
                  Trending
                </option>

                <option value="Top Rated">
                  Top Rated
                </option>

                <option value="Premium">
                  Premium
                </option>
              </FilterSelect>

              {/* Sort */}
              <FilterSelect
                label="Sort"
                value={sortBy}
                onChange={(value) =>
                  setSortBy(
                    value as SortOption
                  )
                }
              >
                <option value="popular">
                  Popular
                </option>

                <option value="price-low">
                  Price: Low → High
                </option>

                <option value="price-high">
                  Price: High → Low
                </option>

                <option value="rating">
                  Highest Rated
                </option>

                <option value="newest">
                  Newest
                </option>
              </FilterSelect>
            </div>

            {/* Reset */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{' '}
              products
            </p>

            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
              <span>↕</span>
              Sorted by{' '}
              <span className="font-medium text-gray-600">
                {getSortLabel(sortBy)}
              </span>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <MiniProductCard
                key={product.id}
                product={product}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                trackAffiliateClick={
                  trackAffiliateClick
                }
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <span className="text-3xl">☰</span>

              <h3 className="font-semibold text-gray-700 mt-3">
                No products found
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Try changing your filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 px-5 py-2.5 bg-gray-900 text-white rounded-full text-sm font-semibold"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


// =========================================================
// DEAL BUTTON
// =========================================================

function DealButton({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
        active
          ? 'bg-gray-900 text-white shadow-md'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span>{icon}</span>
      {children}
    </button>
  );
}


// =========================================================
// FILTER SELECT
// =========================================================

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none px-3 py-2.5 pr-9 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-[#d4af37]"
        >
          {children}
        </select>

        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}


// =========================================================
// MINI PRODUCT CARD
// =========================================================

function MiniProductCard({
  product,
  wishlist,
  onWishlist,
  trackAffiliateClick,
}: {
  product: any;
  wishlist: string[];
  onWishlist: (id: string) => void;
  trackAffiliateClick: (
    product: any,
    platform: string
  ) => Promise<void>;
}) {
  const images =
    product.images &&
    product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  const image = images[0] || '';

  const platformName = String(
    product.platformName || 'Amazon'
  ).trim();

  const affiliateLink = String(
    product.affiliateLink || ''
  ).trim();

  const isWishlisted =
    wishlist.includes(product.id);

  const handleClick = () => {
    if (!affiliateLink) return;

    trackAffiliateClick(
      product,
      platformName
    );
  };

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
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
            <span className="text-2xl text-gray-300">
              🏷️
            </span>
          </div>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() =>
            onWishlist(product.id)
          }
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all z-10 ${
            isWishlisted
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-600 hover:bg-white'
          }`}
          aria-label={
            isWishlisted
              ? 'Remove from wishlist'
              : 'Add to wishlist'
          }
        >
          <span className="text-xl leading-none">
            {isWishlisted ? '♥' : '♡'}
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

      {/* Content */}
      <div className="p-4">

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1.5">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />

          <span className="text-xs font-medium">
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
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2 min-h-[32px]">
          {product.description}
        </p>

        {/* Price + Button */}
        <div className="flex items-center justify-between gap-2 mt-4">

          <span className="font-bold text-gray-900 text-sm sm:text-base">
            {product.price}
          </span>

          {affiliateLink && (
            <motion.a
              href={affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap"
            >
              View on {platformName}

              <ExternalLink className="w-3 h-3" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}


// =========================================================
// SORT LABEL
// =========================================================

function getSortLabel(
  sort: SortOption
) {
  switch (sort) {
    case 'price-low':
      return 'Price Low → High';

    case 'price-high':
      return 'Price High → Low';

    case 'rating':
      return 'Highest Rated';

    case 'newest':
      return 'Newest';

    default:
      return 'Popular';
  }
}