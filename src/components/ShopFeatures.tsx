
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

  const [wishlist, setWishlist] =
    useState<string[]>(() => {
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

  const getNumericPrice = (price: unknown) => {
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
      .map((product: any) =>
        String(
          product.platformName || 'Amazon'
        ).trim()
      )
      .filter(Boolean);

    return Array.from(new Set(values)).sort();
  }, [products]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== 'all') {
      result = result.filter(
        (product: any) =>
          product.category === categoryFilter
      );
    }

    if (platformFilter !== 'all') {
      result = result.filter(
        (product: any) =>
          String(
            product.platformName || 'Amazon'
          ).toLowerCase() ===
          platformFilter.toLowerCase()
      );
    }

    if (ratingFilter !== 'all') {
      const minimumRating =
        Number(ratingFilter);

      result = result.filter(
        (product: any) =>
          Number(product.rating || 0) >=
          minimumRating
      );
    }

    if (badgeFilter !== 'all') {
      result = result.filter(
        (product: any) =>
          product.badge === badgeFilter
      );
    }

    if (priceFilter !== 'all') {
      if (priceFilter === 'under999') {
        result = result.filter(
          (product: any) =>
            getNumericPrice(product.price) < 999
        );
      }

      if (priceFilter === '999-2499') {
        result = result.filter((product: any) => {
          const price =
            getNumericPrice(product.price);

          return price >= 999 && price <= 2499;
        });
      }

      if (priceFilter === '2500-4999') {
        result = result.filter((product: any) => {
          const price =
            getNumericPrice(product.price);

          return price >= 2500 && price <= 4999;
        });
      }

      if (priceFilter === '5000+') {
        result = result.filter(
          (product: any) =>
            getNumericPrice(product.price) >= 5000
        );
      }
    }

    if (sortBy === 'price-low') {
      result.sort(
        (a: any, b: any) =>
          getNumericPrice(a.price) -
          getNumericPrice(b.price)
      );
    }

    if (sortBy === 'price-high') {
      result.sort(
        (a: any, b: any) =>
          getNumericPrice(b.price) -
          getNumericPrice(a.price)
      );
    }

    if (sortBy === 'rating') {
      result.sort(
        (a: any, b: any) =>
          Number(b.rating || 0) -
          Number(a.rating || 0)
      );
    }

    if (sortBy === 'popular') {
      result.sort(
        (a: any, b: any) =>
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
          (product: any) =>
            product.badge === 'Best Seller' ||
            product.badge === 'Premium' ||
            getNumericPrice(product.price) < 999
        )
        .slice(0, 8);
    }

    if (dealTab === 'best') {
      return sorted
        .sort(
          (a: any, b: any) =>
            Number(b.reviews || 0) -
            Number(a.reviews || 0)
        )
        .slice(0, 8);
    }

    if (dealTab === 'under999') {
      return sorted
        .filter(
          (product: any) =>
            getNumericPrice(product.price) < 999
        )
        .slice(0, 8);
    }

    if (dealTab === 'trending') {
      return sorted
        .filter(
          (product: any) =>
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
      className="bg-white py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =================================================
            DEALS
        ================================================= */}

        <div className="mb-16">
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#d4af37]/10 px-3 py-1.5 text-xs font-semibold text-[#b8860b] sm:text-sm">
              <span>🔥</span>
              Deals & Offers
            </span>

            <h2 className="logo-font mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Discover Great Deals
            </h2>

            <p className="mt-2 text-gray-500">
              Find trending products, popular picks and special offers.
            </p>
          </div>

          <div
            className="mb-6 flex w-full min-w-0 flex-nowrap gap-2 overflow-x-auto overflow-y-hidden pb-2 scroll-smooth"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <DealButton
              active={dealTab === 'today'}
              onClick={() => setDealTab('today')}
              icon="🔥"
              mobileLabel="Today"
            >
              Today's Deals
            </DealButton>

            <DealButton
              active={dealTab === 'best'}
              onClick={() => setDealTab('best')}
              icon="🏷️"
              mobileLabel="Best"
            >
              Best Deals
            </DealButton>

            <DealButton
              active={dealTab === 'under999'}
              onClick={() => setDealTab('under999')}
              icon="🏷️"
              mobileLabel="Under ₹999"
            >
              Under ₹999
            </DealButton>

            <DealButton
              active={dealTab === 'trending'}
              onClick={() => setDealTab('trending')}
              icon="✨"
              mobileLabel="Trending"
            >
              Trending
            </DealButton>

            <DealButton
              active={dealTab === 'new'}
              onClick={() => setDealTab('new')}
              icon="✨"
              mobileLabel="New"
            >
              New Arrivals
            </DealButton>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {dealProducts.map((product: any) => (
              <MiniProductCard
                key={product.id}
                product={product}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                trackAffiliateClick={trackAffiliateClick}
              />
            ))}
          </div>

          {dealProducts.length === 0 && (
            <div className="rounded-2xl bg-gray-50 py-12 text-center">
              <span className="text-3xl">🏷️</span>

              <p className="mt-3 text-gray-500">
                No products available in this section yet.
              </p>
            </div>
          )}
        </div>

        {/* =================================================
            SHOP
        ================================================= */}

        <div>
          <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 sm:text-sm">
                <span>☰</span>
                Shop
              </span>

              <h2 className="logo-font mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">
                Browse Products
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                setShowFilters(!showFilters)
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200 lg:hidden"
            >
              <span>☰</span>
              Filters
            </button>
          </div>

          {/* FILTERS */}

          <div
            className={`${
              showFilters ? 'block' : 'hidden'
            } mb-6 rounded-2xl bg-gray-50 p-4 sm:p-5 lg:block`}
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">

              <FilterSelect
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
              >
                <option value="all">
                  All Categories
                </option>

                {categories.map((category: any) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </FilterSelect>

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

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
                Reset Filters
              </button>
            </div>
          </div>

          {/* RESULTS */}

          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing{' '}
              <span className="font-semibold text-gray-900">
                {filteredProducts.length}
              </span>{' '}
              products
            </p>

            <div className="hidden items-center gap-2 text-xs text-gray-400 sm:flex">
              <span>↕</span>
              Sorted by{' '}
              <span className="font-medium text-gray-600">
                {getSortLabel(sortBy)}
              </span>
            </div>
          </div>

          {/* PRODUCT GRID */}

          <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {filteredProducts.map((product: any) => (
              <MiniProductCard
                key={product.id}
                product={product}
                wishlist={wishlist}
                onWishlist={toggleWishlist}
                trackAffiliateClick={trackAffiliateClick}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="rounded-2xl bg-gray-50 py-16 text-center">
              <span className="text-3xl">☰</span>

              <h3 className="mt-3 font-semibold text-gray-700">
                No products found
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your filters.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
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
  mobileLabel,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: string;
  mobileLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        flex shrink-0 snap-start items-center gap-1.5
        whitespace-nowrap rounded-full px-3.5 py-2.5
        text-xs font-semibold transition-all
        sm:gap-2 sm:px-4 sm:text-sm
        ${
          active
            ? 'bg-gray-900 text-white shadow-md'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      <span>{icon}</span>

      <span className="sm:hidden">
        {mobileLabel}
      </span>

      <span className="hidden sm:inline">
        {children}
      </span>
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
      <label className="mb-1.5 block text-xs font-semibold text-gray-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) =>
            onChange(e.target.value)
          }
          className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-3 py-2.5 pr-9 text-sm text-gray-700 focus:border-[#d4af37] focus:outline-none"
        >
          {children}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
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
  const images = getProductImages(product);

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

    void trackAffiliateClick(
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
      className="
        group flex min-w-0 flex-col overflow-hidden
        rounded-2xl border border-gray-100 bg-white
        transition-all duration-300
        hover:border-gray-200 hover:shadow-xl
      "
    >
      {/* IMAGE */}

      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">

        {image ? (
          <img
            src={image}
            alt={product.name || 'Product'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display =
                'none';
            }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-2xl text-gray-300">
              🏷️
            </span>
          </div>
        )}

        {/* WISHLIST */}

        <button
          type="button"
          onClick={() =>
            onWishlist(product.id)
          }
          className={`
            absolute right-2.5 top-2.5 z-10
            flex h-9 w-9 items-center justify-center
            rounded-full backdrop-blur-md transition-all
            sm:right-3 sm:top-3
            ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-600 hover:bg-white'
            }
          `}
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

        {/* BADGE */}

        {product.badge && (
          <div className="absolute bottom-2.5 left-2.5 sm:bottom-3 sm:left-3">
            <span className="rounded-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] px-2 py-1 text-[9px] font-semibold text-white shadow-sm sm:px-2.5 sm:text-[10px]">
              {product.badge}
            </span>
          </div>
        )}
      </div>

      {/* CONTENT */}

      <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-4">

        {/* RATING */}

        <div className="mb-1.5 flex min-w-0 items-center gap-1">
          <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />

          <span className="shrink-0 text-xs font-medium">
            {product.rating || '4.5'}
          </span>

          <span className="min-w-0 truncate text-xs text-gray-400">
            (
            {Number(
              product.reviews || 0
            ).toLocaleString()}
            )
          </span>
        </div>

        {/* NAME */}

        <h3 className="line-clamp-1 text-sm font-semibold text-gray-900 sm:text-base">
          {product.name || 'Product'}
        </h3>

        {/* DESCRIPTION */}

        <p className="mt-1 min-h-[32px] line-clamp-2 text-xs text-gray-500 sm:text-sm">
          {product.description || ''}
        </p>

        {/* PRICE */}

        <div className="mt-auto flex min-w-0 items-center justify-between gap-2 pt-4">

          <span className="min-w-0 flex-1 truncate text-sm font-bold text-gray-900 sm:text-base">
            {product.price || ''}
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
              className="
                inline-flex shrink-0 items-center
                justify-center gap-1 whitespace-nowrap
                rounded-full bg-gray-900 px-2.5 py-2.5
                text-[10px] font-semibold text-white
                hover:bg-gray-800
                sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs
              "
              aria-label={`View on ${platformName}`}
            >
              <span className="max-w-[70px] truncate sm:hidden">
                {platformName}
              </span>

              <span className="hidden sm:inline">
                View on {platformName}
              </span>

              <ExternalLink className="hidden h-3 w-3 shrink-0 sm:block" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// =========================================================
// IMAGE HELPER
// =========================================================

function getProductImages(product: any): string[] {
  const possibleImages = product?.images;

  // images: ["url1", "url2"]
  if (Array.isArray(possibleImages)) {
    return possibleImages
      .map((image: any) => {
        if (typeof image === 'string') {
          return image.trim();
        }

        // Handles objects such as { url: "..." }
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

  // images: "url1,url2"
  if (typeof possibleImages === 'string') {
    return possibleImages
      .split(',')
      .map((image: string) => image.trim())
      .filter(Boolean);
  }

  // image: "single-url"
  if (
    typeof product?.image === 'string' &&
    product.image.trim()
  ) {
    return [product.image.trim()];
  }

  // imageUrl: "single-url"
  if (
    typeof product?.imageUrl === 'string' &&
    product.imageUrl.trim()
  ) {
    return [product.imageUrl.trim()];
  }

  return [];
}

// =========================================================
// SORT LABEL
// =========================================================

function getSortLabel(sort: SortOption) {
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

