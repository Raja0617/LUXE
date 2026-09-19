import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Star, ExternalLink, Package } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { products, searchProducts, categories } = useProducts();
  
  const searchResults = query.trim() ? searchProducts(query) : [];
  const hasResults = searchResults.length > 0;
  
  // Get related products based on search query category or featured
  const getRelatedProducts = () => {
    if (!query.trim()) return [];
    // Find products from similar categories or with badges
    const related = products
      .filter(p => !searchResults.find(r => r.id === p.id))
      .filter(p => p.badge || searchResults.some(r => r.category === p.category))
      .slice(0, 4);
    return related;
  };
  
  const relatedProducts = getRelatedProducts();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-16 sm:pt-20 md:pt-24"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[85vh] sm:max-h-[80vh] flex flex-col"
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-b border-gray-100">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, categories..."
                className="flex-1 text-base sm:text-lg outline-none placeholder:text-gray-400"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-xs sm:text-sm font-medium text-gray-500"
              >
                ESC
              </button>
            </div>

            {/* Search Results */}
            <div className="overflow-y-auto flex-1 p-3 sm:p-4">
              {!query.trim() ? (
                // Default State - Show Categories
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                    Popular Categories
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => {
                          setQuery(category.name);
                        }}
                        className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{category.name}</p>
                          <p className="text-xs text-gray-500">{category.productCount} products</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : hasResults ? (
                // Results Found
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                    {searchResults.length} Results
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {searchResults.map((product) => {
                      const images = product.images || [];
                      const mainImage = images[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600';
                      
                      return (
                        <motion.a
                          key={product.id}
                          href={product.affiliateLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <img
                            src={mainImage}
                            alt={product.name}
                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover bg-gray-100"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 group-hover:text-[#b8860b] transition-colors truncate text-sm sm:text-base">
                              {product.name}
                            </h4>
                            <p className="text-xs sm:text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            <div className="flex items-center gap-2 mt-0.5 sm:mt-1">
                              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{product.rating}</span>
                              <span className="text-xs font-semibold text-[#b8860b]">{product.price}</span>
                              {product.sizes && product.sizes.length > 0 && (
                                <span className="text-xs text-blue-600">{product.sizes.length} sizes</span>
                              )}
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-gray-300 group-hover:text-[#b8860b] transition-colors flex-shrink-0" />
                        </motion.a>
                      );
                    })}
                  </div>

                  {/* Related Products */}
                  {relatedProducts.length > 0 && (
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 sm:mb-4">
                        You May Also Like
                      </h3>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {relatedProducts.map((product) => {
                          const images = product.images || [];
                          const mainImage = images[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600';
                          
                          return (
                            <a
                              key={product.id}
                              href={product.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-1.5 sm:mb-2">
                                <img
                                  src={mainImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                {product.badge && (
                                  <span className="absolute top-1.5 sm:top-2 left-1.5 sm:left-2 px-1.5 sm:px-2 py-0.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white text-[10px] sm:text-xs rounded-full">
                                    {product.badge}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1 group-hover:text-[#b8860b] transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-[10px] sm:text-xs text-gray-500">{product.price}</p>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // No Results - Coming Soon
                <div className="text-center py-8 sm:py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-[#d4af37]/20 to-[#b8860b]/20 mb-4 sm:mb-6"
                  >
                    <Package className="w-8 h-8 sm:w-10 sm:h-10 text-[#b8860b]" />
                  </motion.div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Coming Soon</h3>
                  <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base px-4">
                    We couldn&apos;t find "{query}" but we&apos;re adding new products daily!
                  </p>
                  
                  {/* Suggested Categories */}
                  <div className="text-left px-2">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">Browse these categories:</h4>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {categories.slice(0, 4).map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => setQuery(cat.name)}
                          className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-100 hover:bg-[#d4af37]/10 hover:text-[#b8860b] rounded-full text-xs sm:text-sm transition-colors"
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Related Products */}
                  {relatedProducts.length > 0 && (
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-left">
                      <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">You might also like:</h4>
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        {relatedProducts.slice(0, 2).map((product) => {
                          const images = product.images || [];
                          const mainImage = images[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600';
                          
                          return (
                            <a
                              key={product.id}
                              href={product.affiliateLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group"
                            >
                              <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-1 sm:mb-2">
                                <img
                                  src={mainImage}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-1">{product.name}</h4>
                              <p className="text-[10px] sm:text-xs text-gray-500">{product.price}</p>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 bg-gray-50 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Press ESC to close</span>
                <span>{products.length} products</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
