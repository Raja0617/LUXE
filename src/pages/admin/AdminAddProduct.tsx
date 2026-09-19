import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FirebaseError } from 'firebase/app';
import {
  Upload,
  X,
  Check,
  ArrowLeft,
  Star,
  ExternalLink,
} from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import {
  useNavigate,
  useSearchParams,
  Link,
} from 'react-router-dom';

const sizeOptions = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
];

export default function AdminAddProduct() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const {
    products,
    categories,
    addProduct,
    editProduct,
  } = useProducts();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [showSuccess, setShowSuccess] =
    useState(false);

  const [submitError, setSubmitError] =
    useState('');

  const [, setSelectedCategory] =
    useState('');

  // =========================================================
  // FORM DATA
  // =========================================================

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: '4.5',
    reviews: '0',
    images: [] as string[],
    category: '',

    platformName: '',
    affiliateLink: '',

    badge: '',
    sizes: [] as string[],
  });

  // =========================================================
  // LOAD PRODUCT FOR EDITING
  // =========================================================

  useEffect(() => {
    if (editId) {
      const product = products.find(
        (p) => p.id === editId
      );

      if (product) {
        // Remove ₹ and commas so the input
        // contains only the numeric value.
        const cleanPrice = String(
          product.price || ''
        )
          .replace(/₹/g, '')
          .replace(/,/g, '')
          .trim();

        setFormData({
          name: product.name || '',
          description:
            product.description || '',
          price: cleanPrice,
          rating: String(
            product.rating ?? 4.5
          ),
          reviews: String(
            product.reviews ?? 0
          ),
          images: product.images || [],
          category:
            product.category || '',

          platformName:
            product.platformName || 'Amazon',

          affiliateLink:
            product.affiliateLink || '',

          badge: product.badge || '',
          sizes: product.sizes || [],
        });

        setSelectedCategory(
          product.category || ''
        );
      }
    } else if (categories.length > 0) {
      setFormData((prev) => ({
        ...prev,
        category:
          categories[0].id,
      }));

      setSelectedCategory(
        categories[0].id
      );
    }
  }, [
    editId,
    products,
    categories,
  ]);

  // =========================================================
  // IMAGE UPLOAD
  // =========================================================

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      return;
    }

    Array.from(files).forEach(
      (file) => {
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
      }
    );

    e.target.value = '';
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

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

  // =========================================================
  // SIZE SELECTION
  // =========================================================

  const toggleSize = (
    size: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      sizes:
        prev.sizes.includes(size)
          ? prev.sizes.filter(
              (s) => s !== size
            )
          : [
              ...prev.sizes,
              size,
            ],
    }));
  };

  // =========================================================
  // PRICE INPUT
  // =========================================================

  const handlePriceChange = (
    value: string
  ) => {
    // Allow only numbers.
    const numericValue =
      value.replace(/\D/g, '');

    setFormData((prev) => ({
      ...prev,
      price: numericValue,
    }));
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (
    e?: React.FormEvent
  ) => {
    e?.preventDefault();

    setSubmitError('');

    const numericPrice =
      formData.price
        .replace(/₹/g, '')
        .replace(/,/g, '')
        .trim();

    // =======================================================
    // REQUIRED FIELDS
    // =======================================================

    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !numericPrice ||
      !formData.category ||
      !formData.platformName.trim() ||
      !formData.affiliateLink.trim()
    ) {
      setSubmitError(
        'Complete all required fields before saving.'
      );
      return;
    }

    // =======================================================
    // VALIDATE PRICE
    // =======================================================

    const priceNumber =
      Number(numericPrice);

    if (
      !Number.isFinite(priceNumber) ||
      priceNumber <= 0
    ) {
      setSubmitError(
        'Enter a valid price in INR.'
      );
      return;
    }

    // =======================================================
    // FORMAT INR PRICE
    // =======================================================

    const formattedPrice =
      `₹${priceNumber.toLocaleString(
        'en-IN'
      )}`;

    // =======================================================
    // VALIDATE AFFILIATE URL
    // =======================================================

    try {
      const affiliateUrl =
        new URL(
          formData.affiliateLink.trim()
        );

      if (
        !['http:', 'https:'].includes(
          affiliateUrl.protocol
        )
      ) {
        throw new Error(
          'Unsupported URL protocol'
        );
      }
    } catch {
      setSubmitError(
        'Enter a valid affiliate link beginning with https://'
      );
      return;
    }

    // =======================================================
    // PRODUCT DATA
    // =======================================================

    const productData = {
      name:
        formData.name.trim(),

      description:
        formData.description.trim(),

      price: formattedPrice,

      rating:
        parseFloat(
          formData.rating
        ) || 4.5,

      reviews:
        parseInt(
          formData.reviews,
          10
        ) || 0,

      images:
        formData.images.length > 0
          ? formData.images
          : [
              'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600',
            ],

      category:
        formData.category,

      // Dynamic marketplace
      platformName:
        formData.platformName.trim(),

      affiliateLink:
        formData.affiliateLink.trim(),

      badge:
        formData.badge || undefined,

      sizes:
        formData.sizes.length > 0
          ? formData.sizes
          : undefined,
    };

    // =======================================================
    // SAVE
    // =======================================================

    try {
      if (editId) {
        await editProduct(
          editId,
          productData
        );
      } else {
        await addProduct(
          productData
        );
      }
    } catch (error) {
      const detail =
        error instanceof FirebaseError
          ? error.code
          : 'unknown-error';

      setSubmitError(
        `Unable to save this product (${detail}).`
      );

      return;
    }

    // =======================================================
    // SUCCESS
    // =======================================================

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);

      if (!editId) {
        setFormData({
          name: '',
          description: '',
          price: '',
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

        setSelectedCategory(
          categories[0]?.id || ''
        );
      } else {
        navigate(
          '/admin/products'
        );
      }
    }, 1500);
  };

  // =========================================================
  // FASHION CATEGORY
  // =========================================================

  const isFashionCategory =
    categories
      .find(
        (c) =>
          c.id ===
          formData.category
      )
      ?.name.toLowerCase()
      .includes('fashion');

  // =========================================================
  // FORMAT PRICE FOR DISPLAY
  // =========================================================

  const pricePreview =
    formData.price
      ? `₹${Number(
          formData.price
            .replace(/,/g, '')
        ).toLocaleString('en-IN')}`
      : '₹0';

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="max-w-4xl mx-auto">

      {/* ===================================================
          BACK
      =================================================== */}

      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Link>

      {/* ===================================================
          SUCCESS
      =================================================== */}

      {showSuccess && (
        <motion.div
          initial={{
            opacity: 0,
            y: -20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
        >
          <Check className="w-5 h-5" />

          {editId
            ? 'Product updated successfully!'
            : 'Product added successfully!'}
        </motion.div>
      )}

      {/* ===================================================
          ERROR
      =================================================== */}

      {submitError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
          {submitError}
        </div>
      )}

      {/* ===================================================
          FORM CARD
      =================================================== */}

      <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {editId
            ? 'Edit Product'
            : 'Add New Product'}
        </h1>

        <p className="text-gray-500 mb-8">
          {editId
            ? 'Update the product details below.'
            : 'Fill in the details to add a new product to your store.'}
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="space-y-8"
        >

          {/* =================================================
              CATEGORY
          ================================================= */}

          <section>

            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Category{' '}
              <span className="text-red-500">
                *
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">

              {categories.map(
                (cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setFormData(
                        (prev) => ({
                          ...prev,
                          category:
                            cat.id,
                        })
                      );

                      setSelectedCategory(
                        cat.id
                      );
                    }}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] group ${
                      formData.category ===
                      cat.id
                        ? 'ring-2 ring-[#d4af37] ring-offset-2'
                        : ''
                    }`}
                  >

                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />

                    <div
                      className={`absolute inset-0 flex items-end p-3 ${
                        formData.category ===
                        cat.id
                          ? 'bg-gradient-to-t from-[#d4af37]/90 to-transparent'
                          : 'bg-gradient-to-t from-black/70 to-transparent'
                      }`}
                    >
                      <span className="font-medium text-sm text-white">
                        {cat.name}
                      </span>
                    </div>

                    {formData.category ===
                      cat.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-[#d4af37]" />
                      </div>
                    )}

                  </button>
                )
              )}

            </div>
          </section>

          {/* =================================================
              IMAGES
          ================================================= */}

          <section>

            <label className="block text-sm font-medium text-gray-700 mb-3">
              Product Images
            </label>

            <div className="space-y-4">

              {formData.images.length >
                0 && (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">

                  {formData.images.map(
                    (img, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
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
                          className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>

                      </div>
                    )
                  )}

                </div>
              )}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex items-center gap-2 px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#d4af37] hover:text-[#b8860b] transition-colors"
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
                  if (e.key === 'Enter') {
                    e.preventDefault();

                    const input =
                      e.target as HTMLInputElement;

                    const value =
                      input.value.trim();

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

                      input.value = '';
                    }
                  }
                }}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37]"
              />

            </div>
          </section>

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          <section className="grid md:grid-cols-2 gap-6">

            {/* PRODUCT NAME */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      name:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="e.g., Premium Wireless Headphones"
              />

            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <textarea
                required
                value={formData.description}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      description:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 resize-none"
                rows={3}
                placeholder="Describe the product features and benefits..."
              />

            </div>

            {/* PRICE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (INR){' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-semibold">
                  ₹
                </span>

                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    handlePriceChange(
                      e.target.value
                    )
                  }
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                  placeholder="1,000"
                />

              </div>

              {formData.price && (
                <p className="text-xs text-gray-500 mt-2">
                  Will be displayed as:{' '}
                  <span className="font-semibold text-gray-700">
                    {pricePreview}
                  </span>
                </p>
              )}

            </div>

            {/* PLATFORM NAME */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Platform Name{' '}
                <span className="text-red-500">
                  *
                </span>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="Amazon, Flipkart, Myntra, Meesho..."
              />

              <p className="text-xs text-gray-500 mt-2">
                Enter any marketplace name.
              </p>

            </div>

            {/* AFFILIATE LINK */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Affiliate Link{' '}
                <span className="text-red-500">
                  *
                </span>
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="https://..."
              />

            </div>

            {/* BUTTON PREVIEW */}

            {formData.platformName.trim() && (
              <div className="md:col-span-2">

                <div className="bg-gradient-to-r from-[#d4af37]/5 to-[#b8860b]/5 border border-[#d4af37]/20 rounded-xl p-4">

                  <p className="text-xs font-medium text-gray-500 mb-2">
                    Button Preview
                  </p>

                  <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold text-sm shadow-sm">
                    View on{' '}
                    {formData.platformName.trim()}

                    <ExternalLink className="w-4 h-4" />
                  </div>

                </div>

              </div>
            )}

            {/* RATING */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>

              <div className="relative">

                <Star className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-yellow-400" />

                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData(
                      (prev) => ({
                        ...prev,
                        rating:
                          e.target.value,
                      })
                    )
                  }
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                />

              </div>
            </div>

            {/* REVIEWS */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Reviews
              </label>

              <input
                type="number"
                min="0"
                value={formData.reviews}
                onChange={(e) =>
                  setFormData(
                    (prev) => ({
                      ...prev,
                      reviews:
                        e.target.value,
                    })
                  )
                }
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
                placeholder="0"
              />

            </div>

            {/* BADGE */}

            <div>

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Badge (Optional)
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
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
              >
                <option value="">
                  No Badge
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
              </select>

            </div>

          </section>

          {/* =================================================
              SIZES
          ================================================= */}

          {(isFashionCategory ||
            formData.sizes.length > 0) && (
            <section>

              <label className="block text-sm font-medium text-gray-700 mb-3">
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
                      className={`w-12 h-12 rounded-lg font-medium transition-colors ${
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
            </section>
          )}

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">

            <button
              type="submit"
              className="relative z-10 flex-1 cursor-pointer py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-[#d4af37]/30"
            >
              {editId
                ? 'Update Product'
                : 'Add Product'}
            </button>

            <Link
              to="/admin/products"
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
            >
              Cancel
            </Link>

          </div>

        </form>
      </div>
    </div>
  );
}