import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import {
  ArrowLeft,
  ExternalLink,
  Star,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';

import { motion } from 'framer-motion';

import { useProducts } from '../context/ProductContext';

// =====================================================
// HELPER FUNCTIONS
// =====================================================

const getNumericPrice = (
  value: string | undefined
) => {
  const numeric = Number(
    String(value || '').replace(
      /[^\d.]/g,
      ''
    )
  );

  return Number.isFinite(numeric)
    ? numeric
    : 0;
};

// =====================================================
// INR FORMAT
// =====================================================

const formatINR = (
  value: string | undefined
) => {
  const numeric = getNumericPrice(value);

  if (numeric <= 0) {
    return value || '';
  }

  return `₹${numeric.toLocaleString(
    'en-IN'
  )}`;
};

// =====================================================
// DISCOUNT CALCULATION
// =====================================================

const calculateDiscount = (
  originalPrice: string,
  price: string
) => {
  const original =
    getNumericPrice(originalPrice);

  const selling =
    getNumericPrice(price);

  if (
    original <= 0 ||
    selling <= 0 ||
    original <= selling
  ) {
    return 0;
  }

  return Math.round(
    ((original - selling) / original) *
      100
  );
};

// =====================================================
// COLOR HELPERS
// =====================================================

const getColorValue = (
  color: string
) => {
  const value = color
    .trim()
    .toLowerCase();

  const colorMap: Record<
    string,
    string
  > = {
    white: '#ffffff',
    black: '#000000',
    red: '#ef4444',
    blue: '#3b82f6',
    green: '#22c55e',
    yellow: '#eab308',
    orange: '#f97316',
    pink: '#ec4899',
    purple: '#a855f7',
    violet: '#8b5cf6',
    brown: '#92400e',
    grey: '#6b7280',
    gray: '#6b7280',
    silver: '#c0c0c0',
    gold: '#d4af37',
    beige: '#f5f5dc',
    cream: '#fffdd0',
    navy: '#1e3a8a',
    maroon: '#800000',
    teal: '#14b8a6',
  };

  return (
    colorMap[value] ||
    '#d1d5db'
  );
};

// =====================================================
// PRODUCT DETAILS PAGE
// =====================================================

export default function ProductDetails() {
  const { productId } =
    useParams<{
      productId: string;
    }>();

  const navigate = useNavigate();

  const {
    products,
    categories,
    trackAffiliateClick,
  } = useProducts();

  // ===================================================
  // STATES
  // ===================================================

  const [
    currentImageIndex,
    setCurrentImageIndex,
  ] = useState(0);

  const [
    isWishlisted,
    setIsWishlisted,
  ] = useState(false);

  const [
    selectedColor,
    setSelectedColor,
  ] = useState('');

  const [
    timeLeft,
    setTimeLeft,
  ] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    expired: boolean;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false,
  });

  // ===================================================
  // FIND PRODUCT
  // ===================================================

  const product = products.find(
    (item) =>
      String(item?.id || '') ===
      String(productId || '')
  );

  // ===================================================
  // RESET WHEN PRODUCT CHANGES
  // ===================================================

  useEffect(() => {
    setCurrentImageIndex(0);
    setSelectedColor('');
  }, [productId]);

  // ===================================================
  // PRODUCT NOT FOUND
  // ===================================================

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-16">

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-16 text-center">

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">

              <Package className="w-10 h-10 text-gray-400" />

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Product not found
            </h1>

            <p className="text-gray-500 mb-8">
              This product may have been removed or is no longer available.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate('/')
              }
              className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full font-semibold hover:opacity-90 transition-opacity"
            >
              <ArrowLeft className="w-4 h-4" />

              Back to Store
            </button>

          </div>

        </div>

      </main>
    );
  }

  // ===================================================
  // SAFE IMAGE HANDLING
  // ===================================================

  const images: string[] =
    Array.isArray(product.images)
      ? product.images.filter(
          (
            img: unknown
          ): img is string =>
            typeof img ===
              'string' &&
            img.trim() !== ''
        )
      : [];

  // ===================================================
  // CURRENT IMAGE
  // ===================================================

  const currentImage =
    images[currentImageIndex] ||
    '';

  // ===================================================
  // CATEGORY
  // ===================================================

  const categoryName =
    categories.find(
      (category) =>
        category.id ===
        product.category
    )?.name ||
    product.category ||
    'Product';

  // ===================================================
  // PLATFORM
  // ===================================================

  const platformName =
    String(
      product.platformName || ''
    ).trim() || 'Store';

  // ===================================================
  // AFFILIATE LINK
  // ===================================================

  const affiliateLink =
    String(
      product.affiliateLink || ''
    ).trim();

  // ===================================================
  // STOCK STATUS
  // ===================================================

  const stockStatus =
    product.stockStatus ===
    'Out of Stock'
      ? 'Out of Stock'
      : 'In Stock';

  const isOutOfStock =
    stockStatus ===
    'Out of Stock';

  // ===================================================
  // ORIGINAL PRICE
  // ===================================================

  const originalPrice =
    String(
      product.originalPrice || ''
    ).trim();

  // ===================================================
  // DISCOUNT
  // ===================================================

  const discountPercentage =
    calculateDiscount(
      originalPrice,
      product.price
    );

  // ===================================================
  // COLORS
  // ===================================================

  const colors: string[] =
    Array.isArray(product.colors)
      ? product.colors.filter(
          (
            color
          ): color is string =>
            typeof color ===
              'string' &&
            color.trim() !== ''
        )
      : [];

  // ===================================================
  // DEAL COUNTDOWN
  // ===================================================

  useEffect(() => {
    const dealEndDate =
      product.dealEndDate;

    if (!dealEndDate) {
      setTimeLeft({
        hours: 0,
        minutes: 0,
        seconds: 0,
        expired: false,
      });

      return;
    }

    const calculateTime = () => {
      const endTime =
        new Date(
          dealEndDate
        ).getTime();

      const now =
        Date.now();

      const difference =
        endTime - now;

      if (
        !Number.isFinite(
          endTime
        ) ||
        difference <= 0
      ) {
        setTimeLeft({
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true,
        });

        return;
      }

      const totalSeconds =
        Math.floor(
          difference / 1000
        );

      const hours =
        Math.floor(
          totalSeconds / 3600
        );

      const minutes =
        Math.floor(
          (totalSeconds % 3600) /
            60
        );

      const seconds =
        totalSeconds % 60;

      setTimeLeft({
        hours,
        minutes,
        seconds,
        expired: false,
      });
    };

    calculateTime();

    const timer =
      window.setInterval(
        calculateTime,
        1000
      );

    return () => {
      window.clearInterval(
        timer
      );
    };
  }, [
    product.dealEndDate,
  ]);

  // ===================================================
  // ACTIVE DEAL
  // ===================================================

  const hasDealDate =
    Boolean(
      product.dealEndDate
    );

  const hasActiveDeal =
    hasDealDate &&
    !timeLeft.expired;

  // ===================================================
  // DISCOUNT SHOULD DISPLAY
  // ===================================================

  const discountIsActive =
    discountPercentage > 0 &&
    (!hasDealDate ||
      hasActiveDeal);

  // ===================================================
  // NEXT IMAGE
  // ===================================================

  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrentImageIndex(
      (previous) =>
        (previous + 1) %
        images.length
    );
  };

  // ===================================================
  // PREVIOUS IMAGE
  // ===================================================

  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrentImageIndex(
      (previous) =>
        (previous -
          1 +
          images.length) %
        images.length
    );
  };

  // ===================================================
  // AFFILIATE CLICK
  // ===================================================

  const handleAffiliateClick =
    async () => {
      if (
        !affiliateLink ||
        isOutOfStock
      ) {
        return;
      }

      try {
        await trackAffiliateClick(
          product,
          platformName
        );
      } catch (error) {
        console.error(
          'Affiliate tracking error:',
          error
        );
      }
    };

  // ===================================================
  // WISHLIST
  // ===================================================

  const WISHLIST_KEY =
    'luxefinds_wishlist';

  const getWishlistItems =
    (): unknown[] => {
      try {
        const stored =
          localStorage.getItem(
            WISHLIST_KEY
          );

        if (!stored) {
          return [];
        }

        const parsed =
          JSON.parse(stored);

        return Array.isArray(
          parsed
        )
          ? parsed
          : [];
      } catch (error) {
        console.error(
          'Unable to read wishlist:',
          error
        );

        return [];
      }
    };

  const itemMatchesProduct = (
    item: unknown,
    id: string
  ) => {
    if (
      typeof item ===
        'string' ||
      typeof item ===
        'number'
    ) {
      return (
        String(item) === id
      );
    }

    if (
      item &&
      typeof item ===
        'object'
    ) {
      const wishlistItem =
        item as {
          id?:
            | string
            | number;
          productId?:
            | string
            | number;
        };

      return (
        String(
          wishlistItem.id ??
            ''
        ) === id ||
        String(
          wishlistItem.productId ??
            ''
        ) === id
      );
    }

    return false;
  };

  const syncWishlistState =
    () => {
      if (!product?.id) {
        return;
      }

      const currentProductId =
        String(product.id);

      const items =
        getWishlistItems();

      setIsWishlisted(
        items.some(
          (item) =>
            itemMatchesProduct(
              item,
              currentProductId
            )
        )
      );
    };

  useEffect(() => {
    syncWishlistState();

    const handleWishlistUpdate =
      () => {
        syncWishlistState();
      };

    const handleStorage = (
      event: StorageEvent
    ) => {
      if (
        event.key ===
        WISHLIST_KEY
      ) {
        syncWishlistState();
      }
    };

    window.addEventListener(
      'wishlistUpdated',
      handleWishlistUpdate
    );

    window.addEventListener(
      'storage',
      handleStorage
    );

    return () => {
      window.removeEventListener(
        'wishlistUpdated',
        handleWishlistUpdate
      );

      window.removeEventListener(
        'storage',
        handleStorage
      );
    };
  }, [product?.id]);

  const toggleWishlist = () => {
    if (!product?.id) {
      return;
    }

    const currentProductId =
      String(product.id);

    const items =
      getWishlistItems();

    const alreadyWishlisted =
      items.some(
        (item) =>
          itemMatchesProduct(
            item,
            currentProductId
          )
      );

    const updatedItems =
      alreadyWishlisted
        ? items.filter(
            (item) =>
              !itemMatchesProduct(
                item,
                currentProductId
              )
          )
        : [
            ...items,
            currentProductId,
          ];

    try {
      localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(
          updatedItems
        )
      );

      setIsWishlisted(
        !alreadyWishlisted
      );

      window.dispatchEvent(
        new Event(
          'wishlistUpdated'
        )
      );
    } catch (error) {
      console.error(
        'Unable to update wishlist:',
        error
      );
    }
  };

  // ===================================================
  // IMAGE ERROR
  // ===================================================

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.style.display =
      'none';

    const parent =
      event.currentTarget
        .parentElement;

    if (parent) {
      parent.classList.add(
        'flex',
        'items-center',
        'justify-center'
      );
    }
  };

  // ===================================================
  // PAGE
  // ===================================================

  return (
    <main className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            navigate(-1)
          }
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />

          Back
        </button>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

          {/* IMAGE SECTION */}

          <div>

            <div
              className={`relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm ${
                isOutOfStock
                  ? 'grayscale'
                  : ''
              }`}
            >

              {/* OUT OF STOCK OVERLAY */}

              {isOutOfStock && (
                <div className="absolute inset-0 z-20 bg-black/25 flex items-center justify-center pointer-events-none">

                  <span className="px-5 py-2.5 bg-gray-900/90 text-white rounded-full text-sm sm:text-base font-bold shadow-lg">
                    Out of Stock
                  </span>

                </div>
              )}

              {/* PRODUCT IMAGE */}

              {currentImage ? (
                <img
                  src={currentImage}
                  alt={
                    product.name ||
                    'Product'
                  }
                  className={`w-full h-full object-cover ${
                    isOutOfStock
                      ? 'opacity-60'
                      : ''
                  }`}
                  onError={
                    handleImageError
                  }
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100">

                  <div className="text-center">

                    <Package className="w-14 h-14 mx-auto text-gray-400 mb-3" />

                    <p className="text-sm text-gray-500">
                      No image available
                    </p>

                  </div>

                </div>
              )}

              {/* PRODUCT BADGE */}

              {product.badge &&
                !isOutOfStock && (
                  <div className="absolute top-4 left-4 z-10">

                    <span className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full text-xs font-semibold shadow-lg">
                      {product.badge}
                    </span>

                  </div>
                )}

              {/* DISCOUNT BADGE */}

              {discountIsActive &&
                !isOutOfStock && (
                  <div className="absolute top-4 right-4 z-10">

                    <span className="px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg">
                      {discountPercentage}% OFF
                    </span>

                  </div>
                )}

              {/* PREVIOUS */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={
                    previousImage
                  }
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-800" />
                </button>
              )}

              {/* NEXT */}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={
                    nextImage
                  }
                  aria-label="Next image"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                >
                  <ChevronRight className="w-5 h-5 text-gray-800" />
                </button>
              )}

            </div>

            {/* THUMBNAILS */}

            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                {images.map(
                  (
                    image: string,
                    index: number
                  ) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setCurrentImageIndex(
                          index
                        )
                      }
                      aria-label={`View image ${
                        index + 1
                      }`}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex ===
                        index
                          ? 'border-[#d4af37] shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >

                      <img
                        src={image}
                        alt={`${product.name || 'Product'} ${
                          index + 1
                        }`}
                        className={`w-full h-full object-cover ${
                          isOutOfStock
                            ? 'grayscale opacity-60'
                            : ''
                        }`}
                        onError={
                          handleImageError
                        }
                      />

                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* PRODUCT INFORMATION */}

          <div className="flex flex-col justify-center">

            {/* CATEGORY */}

            <span className="inline-flex w-fit px-3 py-1 bg-[#d4af37]/10 text-[#b8860b] rounded-full text-xs sm:text-sm font-semibold mb-4">
              {categoryName}
            </span>

            {/* PRODUCT NAME */}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
              {product.name ||
                'Product'}
            </h1>

            {/* RATING */}

            <div className="flex items-center gap-3 mb-5">

              <div className="flex items-center gap-1">

                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

                <span className="font-semibold text-gray-900">
                  {product.rating ||
                    '4.5'}
                </span>

              </div>

              <span className="text-gray-300">
                |
              </span>

              <span className="text-gray-500 text-sm">
                {Number(
                  product.reviews ||
                    0
                ).toLocaleString()}{' '}
                reviews
              </span>

            </div>

            {/* PRICE */}

            <div className="mb-5">

              <div className="flex flex-wrap items-center gap-3">

                <span className="text-3xl sm:text-4xl font-bold text-gray-900">
                  {formatINR(
                    product.price
                  ) ||
                    'Price unavailable'}
                </span>

                {/* ORIGINAL PRICE */}

                {originalPrice &&
                  discountPercentage >
                    0 && (
                    <span className="text-lg sm:text-xl text-gray-400 line-through">
                      {formatINR(
                        originalPrice
                      )}
                    </span>
                  )}

                {/* DISCOUNT */}

                {discountIsActive && (
                  <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold">
                    {discountPercentage}% OFF
                  </span>
                )}

              </div>

            </div>

            {/* DEAL COUNTDOWN */}

            {hasActiveDeal &&
              !isOutOfStock && (
                <div className="mb-6">

                  <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl">

                    <span className="text-red-500 font-semibold text-sm">
                      ⏰ Deal ends in
                    </span>

                    <span className="text-red-600 font-bold text-sm">
                      {timeLeft.hours}{' '}
                      hrs{' '}
                      {timeLeft.minutes}{' '}
                      mins
                    </span>

                  </div>

                </div>
              )}

            {/* EXPIRED DEAL */}

            {product.dealEndDate &&
              timeLeft.expired && (
                <div className="mb-6">

                  <span className="inline-flex px-3 py-2 bg-gray-100 text-gray-500 rounded-lg text-sm">
                    Deal expired
                  </span>

                </div>
              )}

            {/* STOCK */}

            <div className="mb-6">

              {isOutOfStock ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm font-semibold">

                  <span className="w-2 h-2 rounded-full bg-red-500" />

                  Out of Stock

                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm font-semibold">

                  <span className="w-2 h-2 rounded-full bg-green-500" />

                  In Stock

                </div>
              )}

            </div>

            {/* DESCRIPTION */}

            {product.description && (
              <div className="mb-6">

                <h2 className="font-semibold text-gray-900 mb-2">
                  About this product
                </h2>

                <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">
                  {
                    product.description
                  }
                </p>

              </div>
            )}

            {/* COLORS */}

            {colors.length > 0 && (
              <div className="mb-6">

                <h2 className="font-semibold text-gray-900 mb-3">

                  Colors

                  {selectedColor && (
                    <span className="font-normal text-gray-500 ml-2">
                      {selectedColor}
                    </span>
                  )}

                </h2>

                <div className="flex flex-wrap gap-3">

                  {colors.map(
                    (
                      color,
                      index
                    ) => {

                      const isSelected =
                        selectedColor.toLowerCase() ===
                        color.toLowerCase();

                      const lightColors = [
                        'white',
                        'yellow',
                        'cream',
                        'beige',
                        'silver',
                      ];

                      const isLightColor =
                        lightColors.includes(
                          color
                            .toLowerCase()
                            .trim()
                        );

                      return (
                        <button
                          key={`${color}-${index}`}
                          type="button"
                          onClick={() =>
                            setSelectedColor(
                              color
                            )
                          }
                          disabled={
                            isOutOfStock
                          }
                          title={color}
                          className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                            isSelected
                              ? 'border-[#b8860b] scale-110 shadow-md'
                              : 'border-gray-200 hover:border-gray-400'
                          } ${
                            isOutOfStock
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          }`}
                          style={{
                            backgroundColor:
                              getColorValue(
                                color
                              ),
                          }}
                        >

                          {isLightColor && (
                            <span className="absolute inset-0 rounded-full border border-gray-200" />
                          )}

                          {isSelected && (
                            <span className="absolute inset-0 flex items-center justify-center">

                              <span
                                className={`text-xs font-bold ${
                                  isLightColor
                                    ? 'text-gray-800'
                                    : 'text-white'
                                }`}
                              >
                                ✓
                              </span>

                            </span>
                          )}

                        </button>
                      );
                    }
                  )}

                </div>

                {/* COLOR NAMES */}

                <div className="flex flex-wrap gap-2 mt-3">

                  {colors.map(
                    (
                      color,
                      index
                    ) => (
                      <button
                        key={`name-${color}-${index}`}
                        type="button"
                        onClick={() =>
                          setSelectedColor(
                            color
                          )
                        }
                        disabled={
                          isOutOfStock
                        }
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          selectedColor.toLowerCase() ===
                          color.toLowerCase()
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#8a6d1d] font-semibold'
                            : 'border-gray-200 bg-white text-gray-600'
                        }`}
                      >
                        {color}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

            {/* SIZES */}

            {Array.isArray(
              product.sizes
            ) &&
              product.sizes.length >
                0 && (
                <div className="mb-6">

                  <h2 className="font-semibold text-gray-900 mb-3">
                    Available Sizes
                  </h2>

                  <div className="flex flex-wrap gap-2">

                    {product.sizes.map(
                      (
                        size: string,
                        index: number
                      ) => (
                        <span
                          key={`${size}-${index}`}
                          className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700"
                        >
                          {size}
                        </span>
                      )
                    )}

                  </div>

                </div>
              )}

            {/* BUTTONS */}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">

              {/* AFFILIATE BUTTON */}

              {affiliateLink &&
                !isOutOfStock && (
                  <motion.a
                    href={
                      affiliateLink
                    }
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
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                  >
                    View on{' '}
                    {platformName}

                    <ExternalLink className="w-5 h-5" />
                  </motion.a>
                )}

              {/* OUT OF STOCK */}

              {isOutOfStock && (
                <div className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                  Out of Stock
                </div>
              )}

              {/* WISHLIST */}

              <button
                type="button"
                onClick={
                  toggleWishlist
                }
                aria-label={
                  isWishlisted
                    ? 'Remove from wishlist'
                    : 'Add to wishlist'
                }
                className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold border transition-all ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-red-500'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >

                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={
                    isWishlisted
                      ? 'currentColor'
                      : 'none'
                  }
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >

                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />

                </svg>

                <span>
                  {isWishlisted
                    ? 'Wishlisted'
                    : 'Wishlist'}
                </span>

              </button>

            </div>

            {/* PLATFORM */}

            <div className="mt-6 p-4 bg-white rounded-xl border border-gray-100">

              <p className="text-xs text-gray-500 mb-1">
                Available on
              </p>

              <p className="font-semibold text-gray-900">
                {platformName}
              </p>

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}