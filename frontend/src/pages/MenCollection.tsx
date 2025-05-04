import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaChevronRight, 
  FaChevronLeft, 
  FaChevronDown, 
  FaFilter, 
  FaTimes,
  FaHeart
} from 'react-icons/fa';

// Sample product data - Men's collection
const products = [
  {
    id: 1,
    name: 'Men\'s Classic Fit Shirt',
    price: 120,
    originalPrice: 150,
    discount: 20,
    rating: 4.5,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#6B8E23', '#4682B4'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Shirts',
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 2,
    name: 'Men\'s Slim Fit Jeans',
    price: 95,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#1E3A8A', '#8B4513'],
    sizes: ['30', '32', '34', '36'],
    category: 'Jeans',
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 3,
    name: 'Men\'s Wool Blazer',
    price: 180,
    originalPrice: 220,
    discount: 18,
    rating: 4.1,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#D3D3D3', '#000080', '#8B0000'],
    sizes: ['S', 'M', 'L'],
    category: 'Blazers',
    style: 'Formal',
    gender: 'Men'
  },
  {
    id: 4,
    name: 'Men\'s Casual Polo',
    price: 110,
    rating: 4.8,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#FFF', '#000', '#4B0082'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Polos',
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 5,
    name: 'Men\'s Chino Shorts',
    price: 85,
    originalPrice: 100,
    discount: 15,
    rating: 4.3,
    reviews: 37,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#FFD700'],
    sizes: ['30', '32', '34', '36'],
    category: 'Shorts',
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 6,
    name: 'Men\'s Graphic T-shirt',
    price: 75,
    rating: 4.6,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#FF6347'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'T-shirts',
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 7,
    name: 'Men\'s Zip-up Hoodie',
    price: 160,
    originalPrice: 190,
    discount: 16,
    rating: 4.4,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1578768079050-7b3a5ec23744?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#808080', '#8B4513'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    category: 'Hoodies',
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 8,
    name: 'Men\'s Formal Trousers',
    price: 90,
    rating: 4.2,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#1F2937', '#4B5563'],
    sizes: ['30', '32', '34', '36'],
    category: 'Trousers',
    style: 'Formal',
    gender: 'Men'
  },
  {
    id: 9,
    name: 'Men\'s Denim Jacket',
    price: 115,
    originalPrice: 140,
    discount: 18,
    rating: 4.7,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#1E3A8A', '#4169E1'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Jackets',
    style: 'Casual',
    gender: 'Men'
  }
];

// Filter options
const categories = ['T-shirts', 'Shirts', 'Jeans', 'Trousers', 'Shorts', 'Blazers', 'Jackets', 'Hoodies', 'Polos'];
const sizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38', '40'];
const styles = ['Casual', 'Formal', 'Party', 'Sport'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Burgundy', hex: '#800020' }
];

const MenCollection: React.FC = () => {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('popular');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Pagination
  const productsPerPage = 9;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Toggle wishlist
  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter(id => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  // Handle filter changes
  const handleCategoryChange = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleColorChange = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color));
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  const handleSizeChange = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleStyleChange = (style: string) => {
    if (selectedStyles.includes(style)) {
      setSelectedStyles(selectedStyles.filter(s => s !== style));
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    const newPriceRange = [...priceRange] as [number, number];
    newPriceRange[index] = newValue;
    
    // Ensure min <= max
    if (index === 0 && newValue > priceRange[1]) {
      newPriceRange[1] = newValue;
    } else if (index === 1 && newValue < priceRange[0]) {
      newPriceRange[0] = newValue;
    }
    
    setPriceRange(newPriceRange);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setPriceRange([50, 300]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedStyles([]);
  };

  // Apply filters
  const applyFilters = () => {
    // In a real app, this would filter the products based on selected filters
    console.log('Applying filters:', {
      categories: selectedCategories,
      priceRange,
      colors: selectedColors,
      sizes: selectedSizes,
      styles: selectedStyles
    });
    
    // Reset to first page when filters change
    setCurrentPage(1);
  };

  // Render star rating
  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    
    return stars;
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const productHover = {
    rest: { scale: 1, transition: { duration: 0.3, ease: "easeInOut" } },
    hover: { scale: 1.03, transition: { duration: 0.3, ease: "easeInOut" } }
  };

  const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.5 } },
    rest: { scale: 1, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <span className="text-black font-medium">Men</span>
        </nav>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button 
            className="w-full py-3 bg-black text-white rounded-md flex items-center justify-center font-medium"
            onClick={() => setShowMobileFilters(true)}
          >
            <FaFilter className="mr-2" />
            Show Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold">Filters</h2>
                <button 
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Category</h3>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className="ml-2 text-gray-700">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">${priceRange[0]}</span>
                    <span className="text-sm text-gray-600">${priceRange[1]}</span>
                  </div>
                  <div className="relative h-1 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-1 bg-black rounded-full"
                      style={{ 
                        left: `${(priceRange[0] - 50) / 2.5}%`, 
                        right: `${100 - (priceRange[1] - 50) / 2.5}%` 
                      }}
                    ></div>
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Min</label>
                      <input 
                        type="number" 
                        min="50" 
                        max="300" 
                        value={priceRange[0]} 
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Max</label>
                      <input 
                        type="number" 
                        min="50" 
                        max="300" 
                        value={priceRange[1]} 
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color.name) ? 'border-black' : 'border-transparent'}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => handleColorChange(color.name)}
                      aria-label={`Select ${color.name} color`}
                    />
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      className={`px-3 py-1 border rounded-md text-sm ${
                        selectedSizes.includes(size) 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Styles */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Style</h3>
                <div className="space-y-2">
                  {styles.map(style => (
                    <label key={style} className="flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                        checked={selectedStyles.includes(style)}
                        onChange={() => handleStyleChange(style)}
                      />
                      <span className="ml-2 text-gray-700">{style}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button 
                className="w-full py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div 
                className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="absolute right-0 top-0 h-full w-4/5 max-w-md bg-white overflow-y-auto"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'tween' }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold">Filters</h2>
                      <button 
                        className="text-gray-500 hover:text-black"
                        onClick={() => setShowMobileFilters(false)}
                      >
                        <FaTimes className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Mobile filter content - same as desktop but in a slide-over panel */}
                    {/* Categories */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Category</h3>
                      <div className="space-y-2">
                        {categories.map(category => (
                          <label key={category} className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                              checked={selectedCategories.includes(category)}
                              onChange={() => handleCategoryChange(category)}
                            />
                            <span className="ml-2 text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Price Range</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">${priceRange[0]}</span>
                          <span className="text-sm text-gray-600">${priceRange[1]}</span>
                        </div>
                        <div className="relative h-1 bg-gray-200 rounded-full">
                          <div 
                            className="absolute h-1 bg-black rounded-full"
                            style={{ 
                              left: `${(priceRange[0] - 50) / 2.5}%`, 
                              right: `${100 - (priceRange[1] - 50) / 2.5}%` 
                            }}
                          ></div>
                        </div>
                        <div className="flex space-x-4">
                          <div>
                            <label className="text-sm text-gray-600 block mb-1">Min</label>
                            <input 
                              type="number" 
                              min="50" 
                              max="300" 
                              value={priceRange[0]} 
                              onChange={(e) => handlePriceChange(e, 0)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-sm text-gray-600 block mb-1">Max</label>
                            <input 
                              type="number" 
                              min="50" 
                              max="300" 
                              value={priceRange[1]} 
                              onChange={(e) => handlePriceChange(e, 1)}
                              className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colors */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Colors</h3>
                      <div className="flex flex-wrap gap-2">
                        {colors.map(color => (
                          <button
                            key={color.name}
                            className={`w-8 h-8 rounded-full border-2 ${selectedColors.includes(color.name) ? 'border-black' : 'border-transparent'}`}
                            style={{ backgroundColor: color.hex }}
                            onClick={() => handleColorChange(color.name)}
                            aria-label={`Select ${color.name} color`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Sizes */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Size</h3>
                      <div className="flex flex-wrap gap-2">
                        {sizes.map(size => (
                          <button
                            key={size}
                            className={`px-3 py-1 border rounded-md text-sm ${
                              selectedSizes.includes(size) 
                                ? 'bg-black text-white border-black' 
                                : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                            }`}
                            onClick={() => handleSizeChange(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Styles */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Style</h3>
                      <div className="space-y-2">
                        {styles.map(style => (
                          <label key={style} className="flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                              checked={selectedStyles.includes(style)}
                              onChange={() => handleStyleChange(style)}
                            />
                            <span className="ml-2 text-gray-700">{style}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <button 
                        className="flex-1 py-2 border border-black text-black rounded-md font-medium hover:bg-gray-100 transition-colors"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </button>
                      <button 
                        className="flex-1 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => {
                          applyFilters();
                          setShowMobileFilters(false);
                        }}
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <p className="text-gray-500">Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, products.length)} of {products.length} products</p>
              </div>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">Sort by:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-transparent border border-gray-300 rounded-md pl-3 pr-8 py-1 focus:outline-none focus:ring-1 focus:ring-black focus:border-black cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="popular">Most Popular</option>
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaChevronDown className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={productHover}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  initial="rest"
                  whileHover="hover"
                  animate={hoveredProduct === product.id ? "hover" : "rest"}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden">
                      <motion.img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-64 object-cover"
                        variants={imageVariants}
                      />
                      {product.discount && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-2 py-1 rounded">
                          {product.discount}% OFF
                        </div>
                      )}
                      <button 
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                      >
                        <FaHeart className={`h-4 w-4 ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </Link>
                  <div className="p-4">
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                      <div className="flex items-center mb-1">
                        <div className="flex mr-1">
                          {renderStarRating(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500">({product.reviews})</span>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                        )}
                      </div>
                    </Link>
                    <div className="mt-3 flex items-center space-x-2">
                      {product.colors.slice(0, 3).map((color, index) => (
                        <div 
                          key={index} 
                          className="w-4 h-4 rounded-full border border-gray-300" 
                          style={{ backgroundColor: color }}
                        />
                      ))}
                      {product.colors.length > 3 && (
                        <span className="text-xs text-gray-500">+{product.colors.length - 3} more</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button 
                  className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`w-10 h-10 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-black text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
                <button 
                  className="p-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                >
                  <FaChevronRight className="h-4 w-4" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenCollection;