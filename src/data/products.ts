export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  rating: number;
  reviews: number;
  images: string[];
  category: string;

  // Affiliate marketplace
  platformName?: string;
  affiliateLink: string;

  badge?: string;
  sizes?: string[];
  isCustomCategory?: boolean;
}

export type AffiliatePlatform = string;

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
  isCustom?: boolean;
}

export const defaultCategories: Category[] = [
  {
    id: 'tech',
    name: 'Tech & Gadgets',
    description: 'Cutting-edge electronics and smart devices',
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80',
    productCount: 48
  },
  {
    id: 'home',
    name: 'Home & Living',
    description: 'Premium furniture and home essentials',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80',
    productCount: 36
  },
  {
    id: 'fashion',
    name: 'Fashion & Style',
    description: 'Trending apparel and accessories',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80',
    productCount: 52
  },
  {
    id: 'beauty',
    name: 'Beauty & Care',
    description: 'Luxury skincare and personal care',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    productCount: 41
  },
  {
    id: 'fitness',
    name: 'Fitness & Health',
    description: 'Workout gear and wellness products',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
    productCount: 29
  },
  {
    id: 'kitchen',
    name: 'Kitchen & Dining',
    description: 'Professional-grade kitchen tools',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80',
    productCount: 33
  }
];

// Default products
export const products: Product[] = [
  {
    id: '1',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with 30-hour battery life',
    price: '₹34,800',
    rating: 4.8,
    reviews: 12543,
    images: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80'],
    category: 'tech',
    affiliateLink: 'https://amzn.to/placeholder1',
    platformName: 'Amazon',
    badge: 'Best Seller',
  },
  {
    id: '2',
    name: 'Apple Watch Series 9',
    description: 'Advanced health features, fitness tracking, and seamless connectivity',
    price: '₹39,900',
    rating: 4.9,
    reviews: 8921,
    images: ['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&q=80'],
    category: 'tech',
    affiliateLink: 'https://amzn.to/placeholder2',
    platformName: 'Amazon',
    badge: 'Trending',
  },
  {
    id: '3',
    name: 'Dyson V15 Detect',
    description: 'Laser reveals microscopic dust, intelligently optimizes suction',
    price: '₹74,999',
    rating: 4.7,
    reviews: 5632,
    images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&q=80'],
    category: 'home',
    affiliateLink: 'https://amzn.to/placeholder3',
    platformName: 'Amazon',
  },
  {
    id: '4',
    name: 'Nespresso Vertuo Plus',
    description: 'Barista-quality coffee and espresso with one touch',
    price: '₹19,900',
    rating: 4.6,
    reviews: 15234,
    images: ['https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?w=600&q=80'],
    category: 'kitchen',
    affiliateLink: 'https://amzn.to/placeholder4',
    platformName: 'Amazon',
    badge: 'Top Rated',
  },
  {
    id: '5',
    name: 'Premium Cotton T-Shirt',
    description: '100% organic cotton, breathable and comfortable for everyday wear',
    price: '₹4,900',
    rating: 4.5,
    reviews: 3241,
    images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80'],
    category: 'fashion',
    affiliateLink: 'https://amzn.to/placeholder5',
    platformName: 'Amazon',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    id: '6',
    name: 'Leather Crossbody Bag',
    description: 'Genuine Italian leather, timeless design, perfect for everyday',
    price: '₹18,900',
    rating: 4.5,
    reviews: 2156,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'],
    category: 'fashion',
    affiliateLink: 'https://amzn.to/placeholder6',
    platformName: 'Amazon',
  },
  {
    id: '7',
    name: 'La Mer Moisturizing Cream',
    description: 'Luxury skincare, deeply moisturizes and renews skin',
    price: '₹38,000',
    rating: 4.7,
    reviews: 3421,
    images: ['https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&q=80'],
    category: 'beauty',
    affiliateLink: 'https://amzn.to/placeholder7',
    platformName: 'Amazon',
    badge: 'Premium',
  },
  {
    id: '8',
    name: 'Bowflex SelectTech 552',
    description: 'Adjustable dumbbells, space-saving design, 5-52.5 lbs',
    price: '₹42,900',
    rating: 4.8,
    reviews: 18765,
    images: ['https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=600&q=80'],
    category: 'fitness',
    affiliateLink: 'https://amzn.to/placeholder8',
    platformName: 'Amazon',
  },
];
