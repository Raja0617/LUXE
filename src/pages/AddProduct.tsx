import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Plus,
  Upload,
  Star,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useNavigate } from 'react-router-dom';

const sizeOptions = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
];

// =====================================================
// FORMAT INR
// =====================================================

const formatINR = (value: string) => {
  const cleaned = value.replace(/[^\d.]/g, '');

  if (!cleaned) return '';

  const [whole, decimal] = cleaned.split('.');

  const formattedWhole = Number(
    whole || 0
  ).toLocaleString('en-IN');

  return decimal !== undefined
    ? `₹${formattedWhole}.${decimal.slice(0, 2)}`
    : `₹${formattedWhole}`;
};

// =====================================================
// GET NUMERIC PRICE
// =====================================================

const getNumericPrice = (value: string) => {
  const numeric = Number(
    value.replace(/[^\d.]/g, '')
  );

  return Number.isFinite(numeric)
    ? numeric
    : 0;
};

// =====================================================
// CALCULATE DISCOUNT
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
    ((original - selling) / original) * 100
  );
};

// =====================================================
// COMPONENT
// =====================================================

export default function AddProduct() {
  const navigate = useNavigate();

  const {
    categories,
    addProduct,
  } = useProducts();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [success, setSuccess] =
    useState(false);

  // ===================================================
  // FORM DATA
  // ===================================================

  const [formData, setFormData] = useState({
    name: '',
    description: '',

    // Selling price
    price: '',

    // Optional MRP
    originalPrice: '',

    // Optional colors
    colors: '',

    // Optional stock
    stockStatus:
      'In Stock' as
        | 'In Stock'
        | 'Out of Stock',

    // Optional deal expiry
    dealEndDate: '',

    rating: '4.5',
    reviews: '0',

    images: [] as string[],

    category:
      categories[0]?.id || '',

    // Affiliate
    platformName: '',
    affiliateLink: '',

    // Badge
    badge: '',

    // Sizes
    sizes: [] as string[],
  });

  // ===================================================
  // IMAGE UPLOAD
  // ===================================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (
      !files ||
      files.length === 0
    ) {
      return;
    }

    Array.from(files).forEach((file) => {
      const reader =
        new FileReader();

      reader.onloadend = () => {
        const result =
          reader.result as string;

        setFormData((prev) => ({
          ...prev,
          images: [
            ...prev.images,
            result,
          ],
        }));
      };

      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const removeImage = (
    index: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // ===================================================
  // TOGGLE SIZE
  // ===================================================

  const toggleSize = (
    size: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(
            (s) => s !== size
          )
        : [
            ...prev.sizes,
            size,
          ],
    }));
  };

  // ===================================================
  // AUTOMATIC DISCOUNT
  // ===================================================

  const discountPercentage =
    calculateDiscount(
      formData.originalPrice,
      formData.price
    );

  // ===================================================
  // PRICE VALIDATION MESSAGE
  // ===================================================

  const originalPriceNumber =
    getNumericPrice(
      formData.originalPrice
    );

  const sellingPriceNumber =
    getNumericPrice(
      formData.price
    );

  const invalidMRP =
    originalPriceNumber > 0 &&
    sellingPriceNumber > 0 &&
    originalPriceNumber <=
      sellingPriceNumber;

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Required fields
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.price.trim() ||
      !formData.category ||
      !formData.platformName.trim() ||
      !formData.affiliateLink.trim()
    ) {
      alert(
        'Please fill in Product Name, Description, Price, Category, Platform Name, and Affiliate Link.'
      );

      return;
    }

    // Validate MRP
    if (invalidMRP) {
      alert(
        'Original Price / MRP must be greater than the Selling Price.'
      );

      return;
    }

    try {
      // =================================================
      // COLORS
      // =================================================

      const colorsArray =
        formData.colors
          .split(',')
          .map((color) =>
            color.trim()
          )
          .filter(Boolean);

      // =================================================
      // PRODUCT DATA
      // =================================================

      const productData = {
        name: formData.name.trim(),

        description:
          formData.description.trim(),

        // Selling price
        price:
          formatINR(formData.price) ||
          formData.price.trim(),

        // Optional MRP
        originalPrice:
          formData.originalPrice.trim()
            ? formatINR(
                formData.originalPrice
              )
            : undefined,

        // Optional colors
        colors:
          colorsArray.length > 0
            ? colorsArray
            : undefined,

        // Stock
        stockStatus:
          formData.stockStatus,

        // Deal expiry
        dealEndDate:
          formData.dealEndDate ||
          undefined,

        // Rating
        rating:
          parseFloat(
            formData.rating
          ) || 4.5,

        // Reviews
        reviews:
          parseInt(
            formData.reviews,
            10
          ) || 0,

        // Images
        images:
          formData.images.length > 0
            ? formData.images
            : [
                'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600',
              ],

        // Category
        category:
          formData.category,

        // Affiliate platform
        platformName:
          formData.platformName.trim(),

        // Affiliate URL
        affiliateLink:
          formData.affiliateLink.trim(),

        // Badge
        badge:
          formData.badge ||
          undefined,

        // Sizes
        sizes:
          formData.sizes.length > 0
            ? formData.sizes
            : undefined,
      };

      // =================================================
      // SAVE TO FIREBASE
      // =================================================

      await addProduct(
        productData
      );

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);

        setFormData({
          name: '',
          description: '',
          price: '',
          originalPrice: '',
          colors: '',
          stockStatus: 'In Stock',
          dealEndDate: '',
          rating: '4.5',
          reviews: '0',
          images: [],
          category:
            categories[0]?.id || '',
          platformName: '',
          affiliateLink: '',
          badge: '',
          sizes: [],
        });
      }, 2000);
    } catch (error) {
      console.error(
        'Failed to add product:',
        error
      );

      alert(
        'Unable to add product. Please try again.'
      );
    }
  };

  // ===================================================
  // CATEGORY CHECK
  // ===================================================

  const isClothingCategory =
    categories
      .find(
        (c) =>
          c.id ===
          formData.category
      )
      ?.name.toLowerCase()
      .includes('fashion');

  // ===================================================
  // COMPONENT
  // ===================================================

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

          <div className="flex items-center justify-between gap-4">

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/admin/products'
                )
              }
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />

              <span className="font-medium">
                Back to Products
              </span>
            </button>

            <h1 className="text-xl font-bold text-gray-900">
              Add New Product
            </h1>

            <div className="w-20" />

          </div>

        </div>
      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />

          Product added successfully!
        </motion.div>
      )}

      {/* =================================================
          FORM
      ================================================= */}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 space-y-6"
        >

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="bg-[#d4af37]/5 rounded-xl p-4">

            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Select Category *
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

              {categories.map(
                (cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          category:
                            cat.id,
                        })
                      )
                    }
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                      formData.category ===
                      cat.id
                        ? 'border-[#d4af37] bg-[#d4af37]/10'
                        : 'border-gray-200 hover:border-[#d4af37]/50'
                    }`}
                  >

                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />

                    <span className="font-medium text-sm">
                      {cat.name}
                    </span>

                  </button>
                )
              )}

            </div>

          </div>

          {/* =================================================
              IMAGES
          ================================================= */}

          <div>

            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Product Images
            </label>

            <div className="space-y-3">

              {formData.images.length >
                0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">

                  {formData.images.map(
                    (
                      img,
                      index
                    ) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-xl overflow-hidden bg-gray-100"
                      >

                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeImage(
                              index
                            )
                          }
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#d4af37] hover:text-[#b8860b] transition-colors"
                >

                  <Upload className="w-5 h-5" />

                  <span>
                    Upload Images
                  </span>

                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={
                    handleImageUpload
                  }
                  className="hidden"
                />

              </div>

              <input
                type="url"
                placeholder="Or paste image URL and press Enter..."
                onKeyDown={(e) => {
                  if (
                    e.key ===
                    'Enter'
                  ) {
                    e.preventDefault();

                    const value = (
                      e.target as HTMLInputElement
                    ).value.trim();

                    if (value) {
                      setFormData(
                        (prev) => ({
                          ...prev,
                          images: [
                            ...prev.images,
                            value,
                          ],
                        })
                      );

                      (
                        e.target as HTMLInputElement
                      ).value = '';
                    }
                  }
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />

            </div>

          </div>

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="grid sm:grid-cols-2 gap-4">

            {/* PRODUCT NAME */}

            <div className="sm:col-span-2">

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Product Name *
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      name: e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="e.g., Sony WH-1000XM5 Headphones"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="sm:col-span-2">

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Description *
              </label>

              <textarea
                required
                value={
                  formData.description
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 resize-none"
                rows={3}
                placeholder="Describe the product features and benefits..."
              />

            </div>

            {/* =================================================
                SELLING PRICE
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Selling Price *
              </label>

              <input
                type="text"
                required
                inputMode="decimal"
                value={formData.price}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      price: formatINR(
                        e.target.value
                      ),
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="₹649"
              />

            </div>

            {/* =================================================
                ORIGINAL PRICE / MRP
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Original Price / MRP
                <span className="font-normal text-gray-500">
                  {' '}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                inputMode="decimal"
                value={
                  formData.originalPrice
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      originalPrice:
                        formatINR(
                          e.target.value
                        ),
                    })
                  )
                }
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                  invalidMRP
                    ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
                    : 'border-gray-200 focus:border-[#d4af37] focus:ring-[#d4af37]/20'
                }`}
                placeholder="₹2,299"
              />

              {/* Automatic discount */}
              {discountPercentage >
                0 && (
                <div className="mt-2 flex items-center gap-2">

                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                    {discountPercentage}% OFF
                  </span>

                  <span className="text-xs text-green-600">
                    Discount calculated automatically
                  </span>

                </div>
              )}

              {/* Invalid MRP */}
              {invalidMRP && (
                <p className="text-xs text-red-500 mt-2">
                  MRP must be greater than the selling price.
                </p>
              )}

            </div>

            {/* =================================================
                COLORS
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Colors
                <span className="font-normal text-gray-500">
                  {' '}
                  (Optional)
                </span>
              </label>

              <input
                type="text"
                value={formData.colors}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      colors:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="White, Black, Pink"
              />

              <p className="text-xs text-gray-500 mt-2">
                Separate colors with commas.
              </p>

            </div>

            {/* =================================================
                STOCK STATUS
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Stock Status
                <span className="font-normal text-gray-500">
                  {' '}
                  (Optional)
                </span>
              </label>

              <select
                value={
                  formData.stockStatus
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      stockStatus:
                        e.target
                          .value as
                          | 'In Stock'
                          | 'Out of Stock',
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
              >

                <option value="In Stock">
                  In Stock
                </option>

                <option value="Out of Stock">
                  Out of Stock
                </option>

              </select>

            </div>

            {/* =================================================
                DEAL END DATE
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Deal End Date & Time
                <span className="font-normal text-gray-500">
                  {' '}
                  (Optional)
                </span>
              </label>

              <input
                type="datetime-local"
                value={
                  formData.dealEndDate
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      dealEndDate:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
              />

              <p className="text-xs text-gray-500 mt-2">
                Optional countdown for limited-time deals.
              </p>

            </div>

            {/* =================================================
                BADGE
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Badge
                <span className="font-normal text-gray-500">
                  {' '}
                  (Optional)
                </span>
              </label>

              <select
                value={formData.badge}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      badge:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
              >

                <option value="">
                  No Badge
                </option>

                <option value="Best Seller">
                  🔥 Best Seller
                </option>

                <option value="Trending">
                  ✨ Trending
                </option>

                <option value="Top Rated">
                  ⭐ Top Rated
                </option>

                <option value="Premium">
                  💎 Premium
                </option>

                <option value="Top Brand">
                  🏆 Top Brand
                </option>

                <option value="Limited Deal">
                  🔥 Limited Deal
                </option>

                <option value="New Arrival">
                  🆕 New Arrival
                </option>

              </select>

            </div>

            {/* =================================================
                RATING
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Rating
              </label>

              <div className="relative">

                <Star className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={
                    formData.rating
                  }
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        rating:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                />

              </div>

            </div>

            {/* =================================================
                REVIEWS
            ================================================= */}

            <div>

              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Reviews Count
              </label>

              <input
                type="number"
                min="0"
                value={
                  formData.reviews
                }
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      reviews:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
              />

            </div>

            {/* =================================================
                PLATFORM
            ================================================= */}

            <div className="sm:col-span-2">

              <div className="rounded-2xl border border-[#d4af37]/30 bg-[#d4af37]/5 p-4 sm:p-5">

                {/* PLATFORM NAME */}

                <div className="mb-4">

                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Platform Name *
                  </label>

                  <input
                    type="text"
                    required
                    value={
                      formData.platformName
                    }
                    onChange={(e) =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          platformName:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                    placeholder="e.g., Amazon, Flipkart, Myntra, Meesho, AJIO"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Enter the marketplace name exactly how you want it displayed.
                  </p>

                </div>

                {/* AFFILIATE LINK */}

                <div>

                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Affiliate Link *
                  </label>

                  <input
                    type="url"
                    required
                    value={
                      formData.affiliateLink
                    }
                    onChange={(e) =>
                      setFormData(
                        (prev) => ({
                          ...prev,
                          affiliateLink:
                            e.target.value,
                        })
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-200 bg-white rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                    placeholder="https://..."
                  />

                </div>

                {/* BUTTON PREVIEW */}

                {formData.platformName.trim() && (
                  <div className="mt-4">

                    <p className="text-xs font-medium text-gray-500 mb-2">
                      Button Preview
                    </p>

                    <div className="flex items-center">

                      <div className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold text-sm shadow-sm">

                        View on{' '}
                        {
                          formData.platformName.trim()
                        }

                        <ExternalLink className="w-4 h-4" />

                      </div>

                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* =================================================
                CLOTHING SIZES
            ================================================= */}

            {isClothingCategory && (
              <div className="sm:col-span-2">

                <label className="block text-sm font-semibold text-gray-900 mb-3">
                  Available Sizes
                </label>

                <div className="flex flex-wrap gap-2">

                  {sizeOptions.map(
                    (size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() =>
                          toggleSize(
                            size
                          )
                        }
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          formData.sizes.includes(
                            size
                          )
                            ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    )
                  )}

                </div>

              </div>
            )}

          </div>

          {/* =================================================
              SUBMIT BUTTONS
          ================================================= */}

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/admin/products'
                )
              }
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />

              Add Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}