
import { useEffect, useState } from 'react';
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
// PRODUCT DETAILS PAGE
// =====================================================

export default function ProductDetails() {
  const { productId } = useParams<{
    productId: string;
  }>();

  const navigate = useNavigate();

  const {
    products,
    categories,
    trackAffiliateClick,
  } = useProducts();

  const [currentImageIndex, setCurrentImageIndex] =
    useState(0);

  const [isWishlisted, setIsWishlisted] =
    useState(false);


  // =====================================================
  // FIND PRODUCT
  // =====================================================

  const product = products.find(
    (item: any) =>
      String(item?.id || '') ===
      String(productId || '')
  );


  // =====================================================
  // RESET IMAGE WHEN PRODUCT CHANGES
  // =====================================================

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [productId]);


  // =====================================================
  // PRODUCT NOT FOUND
  // =====================================================

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50 pt-28 pb-16">

        <div className="max-w-5xl mx-auto px-4 sm:px-6">

          <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-16 text-center">

            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">

              <Package
                className="w-10 h-10 text-gray-400"
              />

            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Product not found
            </h1>

            <p className="text-gray-500 mb-8">
              This product may have been removed or is no longer available.
            </p>

            <button
              type="button"
              onClick={() => navigate('/')}
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


  // =====================================================
  // SAFE IMAGE HANDLING
  // =====================================================
  // Only use the current "images" array.
  // This avoids the TypeScript error from product.image.
  // =====================================================

  const images: string[] = Array.isArray(product.images)
    ? product.images.filter(
        (img: unknown): img is string =>
          typeof img === 'string' &&
          img.trim() !== ''
      )
    : [];


  // =====================================================
  // SAFE CURRENT IMAGE
  // =====================================================

  const currentImage =
    images[currentImageIndex] || '';


  // =====================================================
  // CATEGORY
  // =====================================================

  const categoryName =
    categories.find(
      (category: any) =>
        category.id === product.category
    )?.name ||
    product.category ||
    'Product';


  // =====================================================
  // PLATFORM
  // =====================================================

  const platformName =
    String(
      product.platformName || ''
    ).trim() || 'Store';


  // =====================================================
  // AFFILIATE LINK
  // =====================================================

  const affiliateLink =
    String(
      product.affiliateLink || ''
    ).trim();


  // =====================================================
  // NEXT IMAGE
  // =====================================================

  const nextImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrentImageIndex(
      (previous) =>
        (previous + 1) % images.length
    );
  };


  // =====================================================
  // PREVIOUS IMAGE
  // =====================================================

  const previousImage = () => {
    if (images.length <= 1) {
      return;
    }

    setCurrentImageIndex(
      (previous) =>
        (previous - 1 + images.length) %
        images.length
    );
  };


  // =====================================================
  // AFFILIATE CLICK
  // =====================================================

  const handleAffiliateClick = async () => {
    if (!affiliateLink) {
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


  // =====================================================
  // WISHLIST
  // =====================================================

  const toggleWishlist = () => {
    setIsWishlisted(
      (previous) => !previous
    );
  };


  // =====================================================
  // IMAGE ERROR
  // =====================================================

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>
  ) => {
    event.currentTarget.style.display = 'none';

    const parent =
      event.currentTarget.parentElement;

    if (parent) {
      parent.classList.add(
        'flex',
        'items-center',
        'justify-center'
      );
    }
  };


  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-50 pt-24 sm:pt-28 pb-16">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 sm:mb-8 transition-colors text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>


        {/* =================================================
            MAIN PRODUCT
        ================================================= */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">


          {/* =================================================
              IMAGE SECTION
          ================================================= */}

          <div>

            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-sm">

              {currentImage ? (

                <img
                  src={currentImage}
                  alt={product.name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
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


              {/* =================================================
                  BADGE
              ================================================= */}

              {product.badge && (

                <div className="absolute top-4 left-4 z-10">

                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full text-xs font-semibold shadow-lg">

                    {product.badge}

                  </span>

                </div>

              )}


              {/* =================================================
                  PREVIOUS IMAGE
              ================================================= */}

              {images.length > 1 && (

                <button
                  type="button"
                  onClick={previousImage}
                  aria-label="Previous image"
                  className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                >

                  <ChevronLeft className="w-5 h-5 text-gray-800" />

                </button>

              )}


              {/* =================================================
                  NEXT IMAGE
              ================================================= */}

              {images.length > 1 && (

                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
                >

                  <ChevronRight className="w-5 h-5 text-gray-800" />

                </button>

              )}

            </div>


            {/* =================================================
                IMAGE THUMBNAILS
            ================================================= */}

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
                      aria-label={`View image ${index + 1}`}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        currentImageIndex ===
                        index
                          ? 'border-[#d4af37] shadow-md'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >

                      <img
                        src={image}
                        alt={`${product.name || 'Product'} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="flex flex-col justify-center">


            {/* CATEGORY */}

            <span className="inline-flex w-fit px-3 py-1 bg-[#d4af37]/10 text-[#b8860b] rounded-full text-xs sm:text-sm font-semibold mb-4">

              {categoryName}

            </span>


            {/* PRODUCT NAME */}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">

              {product.name || 'Product'}

            </h1>


            {/* =================================================
                RATING
            ================================================= */}

            <div className="flex items-center gap-3 mb-5">

              <div className="flex items-center gap-1">

                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />

                <span className="font-semibold text-gray-900">

                  {product.rating || '4.5'}

                </span>

              </div>

              <span className="text-gray-300">
                |
              </span>

              <span className="text-gray-500 text-sm">

                {Number(
                  product.reviews || 0
                ).toLocaleString()}{' '}

                reviews

              </span>

            </div>


            {/* =================================================
                PRICE
            ================================================= */}

            <div className="mb-6">

              <span className="text-3xl sm:text-4xl font-bold text-gray-900">

                {product.price || 'Price unavailable'}

              </span>

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {product.description && (

              <div className="mb-6">

                <h2 className="font-semibold text-gray-900 mb-2">
                  About this product
                </h2>

                <p className="text-gray-600 leading-relaxed text-sm sm:text-base whitespace-pre-line">

                  {product.description}

                </p>

              </div>

            )}


            {/* =================================================
                SIZES
            ================================================= */}

            {Array.isArray(product.sizes) &&
              product.sizes.length > 0 && (

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


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="flex flex-col sm:flex-row gap-3 mt-2">


              {/* =================================================
                  VIEW ON PLATFORM
              ================================================= */}

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

                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >

                  View on {platformName}

                  <ExternalLink className="w-5 h-5" />

                </motion.a>

              )}


              {/* =================================================
                  WISHLIST BUTTON
              ================================================= */}

              <button
                type="button"
                onClick={toggleWishlist}
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

                {/* HEART ICON */}

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


            {/* =================================================
                PLATFORM INFO
            ================================================= */}

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

