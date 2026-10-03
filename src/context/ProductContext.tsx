import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
  writeBatch,
} from 'firebase/firestore';

import {
  defaultCategories,
  products as initialProducts,
  type Category,
  type Product,
} from '../data/products';

import { db } from '../lib/firebase';

interface ProductContextType {
  products: Product[];
  categories: Category[];

  trackAffiliateClick: (
    product: Product,
    platform: string
  ) => Promise<void>;

  addProduct: (
    product: Omit<Product, 'id'>
  ) => Promise<void>;

  editProduct: (
    id: string,
    updates: Partial<Product>
  ) => Promise<void>;

  deleteProduct: (
    id: string
  ) => Promise<void>;

  addCategory: (
    category: Omit<Category, 'id' | 'productCount'>
  ) => void;

  deleteCategory: (
    id: string
  ) => void;

  getProductsByCategory: (
    categoryId: string
  ) => Product[];

  getFeaturedProducts: () => Product[];

  searchProducts: (
    query: string
  ) => Product[];

  activeCategory: string;

  setActiveCategory: (
    category: string
  ) => void;

  searchQuery: string;

  setSearchQuery: (
    query: string
  ) => void;
}

const ProductContext =
  createContext<ProductContextType | undefined>(
    undefined
  );

const CATEGORIES_STORAGE_KEY =
  'luxefinds_categories';

const productsCollection = collection(
  db,
  'products'
);

const affiliateClicksCollection = collection(
  db,
  'affiliateClicks'
);

// =====================================================
// REMOVE UNDEFINED FIELDS
// =====================================================

const removeUndefinedFields = <
  T extends Record<string, unknown>
>(
  data: T
) =>
  Object.fromEntries(
    Object.entries(data).filter(
      ([, value]) => value !== undefined
    )
  ) as T;

// =====================================================
// NORMALIZE PRODUCT
// =====================================================

const normalizeProduct = (
  id: string,
  data: Record<string, unknown>
): Product => {
  let colors: string[] = [];

  // Handle colors saved as an array
  if (Array.isArray(data.colors)) {
    colors = data.colors
      .map((color) => String(color).trim())
      .filter(Boolean);
  }

  // Handle colors saved as comma-separated text
  else if (
    typeof data.colors === 'string'
  ) {
    colors = data.colors
      .split(',')
      .map((color) => color.trim())
      .filter(Boolean);
  }

  const stockStatus =
    data.stockStatus === 'Out of Stock'
      ? 'Out of Stock'
      : 'In Stock';

  return {
    ...(data as Omit<Product, 'id'>),

    id,

    originalPrice:
      typeof data.originalPrice === 'string'
        ? data.originalPrice
        : '',

    colors,

    stockStatus,

    dealEndDate:
      typeof data.dealEndDate === 'string'
        ? data.dealEndDate
        : '',
  };
};

// =====================================================
// CATEGORY COUNTS
// =====================================================

const calculateCategoryCounts = (
  products: Product[],
  categories: Category[]
): Category[] =>
  categories.map((category) => ({
    ...category,

    productCount: products.filter(
      (product) =>
        product.category === category.id
    ).length,
  }));

// =====================================================
// SEED DEFAULT PRODUCTS
// =====================================================

async function seedDefaultProducts() {
  const existing = await getDocs(
    productsCollection
  );

  if (!existing.empty) {
    return;
  }

  const batch = writeBatch(db);

  initialProducts.forEach(
    ({ id, ...product }) => {
      batch.set(
        doc(productsCollection, id),
        removeUndefinedFields(
          product as Record<string, unknown>
        )
      );
    }
  );

  await batch.commit();
}

// =====================================================
// PROVIDER
// =====================================================

export function ProductProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [products, setProducts] =
    useState<Product[]>(
      initialProducts
    );

  const [baseCategories, setBaseCategories] =
    useState<Category[]>(() => {
      const stored =
        localStorage.getItem(
          CATEGORIES_STORAGE_KEY
        );

      if (!stored) {
        return defaultCategories;
      }

      try {
        return JSON.parse(stored);
      } catch {
        return defaultCategories;
      }
    });

  const [activeCategory, setActiveCategory] =
    useState('all');

  const [searchQuery, setSearchQuery] =
    useState('');

  // ===================================================
  // LOAD PRODUCTS FROM FIREBASE
  // ===================================================

  useEffect(() => {
    return onSnapshot(
      productsCollection,
      (snapshot) => {
        if (snapshot.empty) {
          return;
        }

        const firebaseProducts =
          snapshot.docs.map((item) =>
            normalizeProduct(
              item.id,
              item.data() as Record<
                string,
                unknown
              >
            )
          );

        setProducts(firebaseProducts);
      },
      (error) => {
        console.error(
          'Unable to load products from Firebase.',
          error
        );
      }
    );
  }, []);

  // ===================================================
  // SAVE CATEGORIES
  // ===================================================

  useEffect(() => {
    localStorage.setItem(
      CATEGORIES_STORAGE_KEY,
      JSON.stringify(baseCategories)
    );
  }, [baseCategories]);

  // ===================================================
  // CATEGORIES
  // ===================================================

  const categories = useMemo(
    () =>
      calculateCategoryCounts(
        products,
        baseCategories
      ),
    [products, baseCategories]
  );

  // ===================================================
  // ADD PRODUCT
  // ===================================================

  const addProduct = useCallback(
    async (
      product: Omit<Product, 'id'>
    ) => {
      await seedDefaultProducts();

      const cleanProduct =
        removeUndefinedFields(
          product as Record<string, unknown>
        );

      await addDoc(
        productsCollection,
        cleanProduct
      );
    },
    []
  );

  // ===================================================
  // EDIT PRODUCT
  // ===================================================

  const editProduct = useCallback(
    async (
      id: string,
      updates: Partial<Product>
    ) => {
      await seedDefaultProducts();

      const productUpdates = {
        ...updates,
      };

      delete productUpdates.id;

      const cleanUpdates =
        removeUndefinedFields(
          productUpdates as Record<
            string,
            unknown
          >
        );

      await setDoc(
        doc(productsCollection, id),
        cleanUpdates,
        {
          merge: true,
        }
      );
    },
    []
  );

  // ===================================================
  // DELETE PRODUCT
  // ===================================================

  const deleteProduct = useCallback(
    async (id: string) => {
      await seedDefaultProducts();

      await deleteDoc(
        doc(productsCollection, id)
      );
    },
    []
  );

  // ===================================================
  // TRACK AFFILIATE CLICK
  // ===================================================

  const trackAffiliateClick =
    useCallback(
      async (
        product: Product,
        platform: string
      ) => {
        try {
          const affiliateUrl =
            product.affiliateLink || '';

          if (!affiliateUrl) {
            console.warn(
              `No affiliate link for ${product.name}`
            );

            return;
          }

          const platformValue =
            platform?.trim() || 'Unknown';

          await addDoc(
            affiliateClicksCollection,
            {
              productId: product.id,
              productName: product.name,
              platform: platformValue,
              affiliateUrl,
              category:
                product.category ||
                'uncategorized',

              timestamp:
                serverTimestamp(),

              pageUrl:
                typeof window !==
                'undefined'
                  ? window.location.href
                  : '',
            }
          );

          console.log(
            `${platformValue} click tracked:`,
            product.name
          );
        } catch (error) {
          console.error(
            `Failed to track affiliate click for ${platform}:`,
            error
          );
        }
      },
      []
    );

  // ===================================================
  // ADD CATEGORY
  // ===================================================

  const addCategory = useCallback(
    (
      category: Omit<
        Category,
        'id' | 'productCount'
      >
    ) => {
      setBaseCategories(
        (current) => [
          ...current,

          {
            ...category,
            id: `custom-${Date.now()}`,
            productCount: 0,
            isCustom: true,
          },
        ]
      );
    },
    []
  );

  // ===================================================
  // DELETE CATEGORY
  // ===================================================

  const deleteCategory =
    useCallback(
      (id: string) => {
        if (
          products.some(
            (product) =>
              product.category === id
          )
        ) {
          alert(
            'Cannot delete a category with existing products. Move or delete its products first.'
          );

          return;
        }

        setBaseCategories(
          (current) =>
            current.filter(
              (category) =>
                category.id !== id
            )
        );
      },
      [products]
    );

  // ===================================================
  // CATEGORY PRODUCTS
  // ===================================================

  const getProductsByCategory =
    useCallback(
      (categoryId: string) =>
        products.filter(
          (product) =>
            product.category ===
            categoryId
        ),
      [products]
    );

  // ===================================================
  // FEATURED PRODUCTS
  // ===================================================

  const getFeaturedProducts =
    useCallback(
      () =>
        products.filter(
          (product) =>
            product.badge
        ),
      [products]
    );

  // ===================================================
  // SEARCH PRODUCTS
  // ===================================================

  const searchProducts =
    useCallback(
      (query: string) => {
        if (!query.trim()) {
          return products;
        }

        const value =
          query.toLowerCase();

        return products.filter(
          (product) =>
            product.name
              .toLowerCase()
              .includes(value) ||

            product.description
              .toLowerCase()
              .includes(value) ||

            product.category
              .toLowerCase()
              .includes(value) ||

            product.platformName
              ?.toLowerCase()
              .includes(value)
        );
      },
      [products]
    );

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,

        addProduct,
        editProduct,
        deleteProduct,

        addCategory,
        deleteCategory,

        trackAffiliateClick,

        getProductsByCategory,
        getFeaturedProducts,
        searchProducts,

        activeCategory,
        setActiveCategory,

        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

export function useProducts() {
  const context =
    useContext(ProductContext);

  if (!context) {
    throw new Error(
      'useProducts must be used within a ProductProvider'
    );
  }

  return context;
}