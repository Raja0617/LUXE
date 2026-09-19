import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Package, ExternalLink, ChevronLeft, Edit2, Upload, FolderPlus, Settings } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useProducts } from '../context/ProductContext';
import ContactSettings from './ContactSettings';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { isAdmin } = useAdmin();
  const { products, categories, addProduct, editProduct, deleteProduct, addCategory, deleteCategory } = useProducts();
  const [view, setView] = useState<'list' | 'add' | 'edit' | 'categories'>('list');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [showContactSettings, setShowContactSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state with default values
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: '4.5',
    reviews: '0',
    images: [] as string[],
    category: '',
    affiliateLink: '',
    badge: '',
    sizes: [] as string[],
  });

  // Set default category when categories load
  useEffect(() => {
    if (categories.length > 0 && !formData.category) {
      setFormData(prev => ({ ...prev, category: categories[0].id }));
    }
  }, [categories]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      rating: '4.5',
      reviews: '0',
      images: [],
      category: categories[0]?.id || '',
      affiliateLink: '',
      badge: '',
      sizes: [],
    });
    setEditingProduct(null);
  };

  const startEdit = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        rating: String(product.rating),
        reviews: String(product.reviews),
        images: product.images || [],
        category: product.category,
        affiliateLink: product.affiliateLink,
        badge: product.badge || '',
        sizes: product.sizes || [],
      });
      setEditingProduct(productId);
      setView('edit');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setFormData(prev => ({ ...prev, images: [...prev.images, result] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ 
      ...prev, 
      images: prev.images.filter((_, i) => i !== index) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.category || !formData.affiliateLink) {
      alert('Please fill in all required fields');
      return;
    }

    const productData = {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      rating: parseFloat(formData.rating) || 4.5,
      reviews: parseInt(formData.reviews) || 0,
      images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'],
      category: formData.category,
      affiliateLink: formData.affiliateLink,
      badge: formData.badge || undefined,
      sizes: formData.sizes.length > 0 ? formData.sizes : undefined,
    };

    if (editingProduct) {
      editProduct(editingProduct, productData);
    } else {
      addProduct(productData);
    }

    resetForm();
    setView('list');
  };

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: '',
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      alert('Category name is required');
      return;
    }
    addCategory({
      name: categoryForm.name,
      description: categoryForm.description,
      image: categoryForm.image || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800',
    });
    setCategoryForm({ name: '', description: '', image: '' });
  };

  if (!isAdmin) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                {(view === 'add' || view === 'edit' || view === 'categories') && (
                  <button
                    onClick={() => {
                      setView('list');
                      resetForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                )}
                <div className="w-10 h-10 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-xl flex items-center justify-center">
                  {view === 'categories' ? <FolderPlus className="w-5 h-5 text-white" /> : <Package className="w-5 h-5 text-white" />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {view === 'list' && 'Admin Panel'}
                    {view === 'add' && 'Add Product'}
                    {view === 'edit' && 'Edit Product'}
                    {view === 'categories' && 'Categories'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {view === 'list' && `${products.length} products`}
                    {view === 'categories' && `${categories.length} categories`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {view === 'list' && (
                  <>
                    <button
                      onClick={() => setView('categories')}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Categories
                    </button>
                    <button
                      onClick={() => setShowContactSettings(true)}
                      className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <button
                      onClick={() => setView('add')}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-lg font-medium hover:opacity-90 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="hidden sm:inline">Add Product</span>
                      <span className="sm:hidden">Add</span>
                    </button>
                  </>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {view === 'list' && (
                <div className="space-y-3">
                  {/* Mobile buttons */}
                  <div className="sm:hidden grid grid-cols-2 gap-2 mb-4">
                    <button
                      onClick={() => setView('categories')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                    >
                      <FolderPlus className="w-4 h-4" />
                      Categories
                    </button>
                    <button
                      onClick={() => setShowContactSettings(true)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500 mb-4">No products yet</p>
                      <button
                        onClick={() => setView('add')}
                        className="px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-full font-medium"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    products.map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600'}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate text-sm">{product.name}</h4>
                          <p className="text-sm text-gray-500">{product.price}</p>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <span className="text-xs px-2 py-0.5 bg-gray-200 rounded-full text-gray-600">
                              {categories.find(c => c.id === product.category)?.name}
                            </span>
                            {product.badge && (
                              <span className="text-xs px-2 py-0.5 bg-[#d4af37]/20 text-[#b8860b] rounded-full">
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => startEdit(product.id)}
                            className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <a
                            href={product.affiliateLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                            title="View on Amazon"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                          {deleteConfirm === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  deleteProduct(product.id);
                                  setDeleteConfirm(null);
                                }}
                                className="px-2 py-1 bg-red-500 text-white text-xs rounded-lg"
                              >
                                Yes
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(product.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}

              {(view === 'add' || view === 'edit') && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-2xl p-4"
                >
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                      <div className="space-y-3">
                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-4 gap-2">
                            {formData.images.map((img, index) => (
                              <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-200">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#d4af37] hover:text-[#b8860b] transition-colors"
                          >
                            <Upload className="w-4 h-4" />
                            <span className="text-sm">Upload Images</span>
                          </button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                        
                        <input
                          type="url"
                          placeholder="Or paste image URL and press Enter..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const value = (e.target as HTMLInputElement).value;
                              if (value) {
                                setFormData(prev => ({ ...prev, images: [...prev.images, value] }));
                                (e.target as HTMLInputElement).value = '';
                              }
                            }
                          }}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                          placeholder="e.g., Sony WH-1000XM5"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea
                          required
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37] resize-none"
                          rows={2}
                          placeholder="Brief product description"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                        <input
                          type="text"
                          required
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                          placeholder="$99.99"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating}
                          onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reviews</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.reviews}
                          onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Amazon Affiliate Link *</label>
                        <input
                          type="url"
                          required
                          value={formData.affiliateLink}
                          onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                          placeholder="https://amzn.to/..."
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Badge (Optional)</label>
                        <select
                          value={formData.badge}
                          onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                        >
                          <option value="">No Badge</option>
                          <option value="Best Seller">Best Seller</option>
                          <option value="Trending">Trending</option>
                          <option value="Top Rated">Top Rated</option>
                          <option value="Premium">Premium</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-xl font-semibold hover:opacity-90 transition-opacity"
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </button>
                  </form>
                </motion.div>
              )}

              {view === 'categories' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="bg-gray-50 rounded-2xl p-4">
                    <h3 className="font-semibold text-gray-900 mb-4">Add New Category</h3>
                    <form onSubmit={handleAddCategory} className="space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="Category name"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                      />
                      <input
                        type="text"
                        placeholder="Description"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                      />
                      <input
                        type="url"
                        placeholder="Category image URL"
                        value={categoryForm.image}
                        onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#d4af37]"
                      />
                      <button
                        type="submit"
                        className="w-full py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                      >
                        Add Category
                      </button>
                    </form>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">All Categories</h3>
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{category.name}</h4>
                          <p className="text-sm text-gray-500">{category.productCount} products</p>
                        </div>
                        {category.isCustom && (
                          <button
                            onClick={() => deleteCategory(category.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ContactSettings isOpen={showContactSettings} onClose={() => setShowContactSettings(false)} />
    </>
  );
}
