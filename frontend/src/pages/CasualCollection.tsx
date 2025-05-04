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
// import { HiOutlineAdjustments } from 'react-icons/hi';

// Sample product data
const products = [
  {
    id: 1,
    name: 'Gradient Graphic T-shirt',
    price: 120,
    originalPrice: 150,
    discount: 20,
    rating: 4.5,
    reviews: 42,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#6B8E23', '#4682B4'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'T-shirts',
    style: 'Casual'
  },
  {
    id: 2,
    name: 'Minimal Logo Shirt',
    price: 95,
    rating: 4.7,
    reviews: 56,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#8B4513'],
    sizes: ['M', 'L', 'XL'],
    category: 'Shirts',
    style: 'Casual'
  },
  {
    id: 3,
    name: 'Vintage Wash Hoodie',
    price: 180,
    originalPrice: 220,
    discount: 18,
    rating: 4.1,
    reviews: 28,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#D3D3D3', '#000080', '#8B0000'],
    sizes: ['S', 'M', 'L'],
    category: 'Hoodies',
    style: 'Casual'
  },
  {
    id: 4,
    name: 'Abstract Art Shirt',
    price: 110,
    rating: 4.8,
    reviews: 64,
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#FFF', '#000', '#4B0082'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    category: 'Shirts',
    style: 'Casual'
  },
  {
    id: 5,
    name: 'Summer Shorts',
    price: 85,
    originalPrice: 100,
    discount: 15,
    rating: 4.3,
    reviews: 37,
    image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#FFD700'],
    sizes: ['S', 'M', 'L'],
    category: 'Shorts',
    style: 'Casual'
  },
  {
    id: 6,
    name: 'Classic Fit T-shirt',
    price: 75,
    rating: 4.6,
    reviews: 52,
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#FF6347'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'T-shirts',
    style: 'Casual'
  },
  {
    id: 7,
    name: 'Comfort Hoodie',
    price: 160,
    originalPrice: 190,
    discount: 16,
    rating: 4.4,
    reviews: 45,
    image: 'https://images.unsplash.com/photo-1578768079050-7b3a5ec23744?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#808080', '#8B4513'],
    sizes: ['M', 'L', 'XL', 'XXL'],
    category: 'Hoodies',
    style: 'Casual'
  },
  {
    id: 8,
    name: 'Relaxed Fit Shorts',
    price: 90,
    rating: 4.2,
    reviews: 31,
    image: 'https://images.unsplash.com/photo-1592301933927-35b597393c0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#32CD32'],
    sizes: ['S', 'M', 'L'],
    category: 'Shorts',
    style: 'Casual'
  },
  {
    id: 9,
    name: 'Urban Graphic T-shirt',
    price: 115,
    originalPrice: 140,
    discount: 18,
    rating: 4.7,
    reviews: 58,
    image: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#4169E1'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'T-shirts',
    style: 'Casual'
  }
];

// Filter options
const categories = ['T-shirts', 'Shorts', 'Shirts', 'Hoodies'];
const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const styles = ['Casual', 'Formal', 'Party', 'Gym'];
const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Yellow', hex: '#FFEB3B' },
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Pink', hex: '#E91E63' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Purple', hex: '#9C27B0' }
];

const CasualCollection: React.FC = () => {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 300]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(['Casual']);
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
    setSelectedStyles(['Casual']);
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
  // const fadeIn = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: { 
  //     opacity: 1, 
  //     y: 0,
  //     transition: { duration: 0.4 }
  //   }
  // };

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
          <span className="text-black font-medium">Casual</span>
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
                    <div 
                      key={color.name}
                      className={`relative cursor-pointer rounded-full transition-transform ${
                        selectedColors.includes(color.name) ? 'transform scale-110' : ''
                      }`}
                      onClick={() => handleColorChange(color.name)}
                    >
                      <div 
                        className="w-8 h-8 rounded-full border border-gray-200" 
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      {selectedColors.includes(color.name) && (
                        <div className="absolute inset-0 rounded-full border-2 border-black"></div>
                      )}
                    </div>
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
                      className={`w-10 h-10 rounded-md border transition-all ${
                        selectedSizes.includes(size) 
                          ? 'border-black bg-black text-white' 
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dress Style */}
              <div className="mb-6">
                <h3 className="font-medium mb-3">Dress Style</h3>
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

              {/* Apply Button */}
              <button 
                className="w-full py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors"
                onClick={applyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Mobile Filters Sidebar */}
          <AnimatePresence>
            {showMobileFilters && (
              <motion.div 
                className="fixed inset-0 z-50 lg:hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowMobileFilters(false)}></div>
                <motion.div 
                  className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold">Filters</h2>
                      <button onClick={() => setShowMobileFilters(false)}>
                        <FaTimes className="text-gray-500" />
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
                          <div 
                            key={color.name}
                            className={`relative cursor-pointer rounded-full transition-transform ${
                              selectedColors.includes(color.name) ? 'transform scale-110' : ''
                            }`}
                            onClick={() => handleColorChange(color.name)}
                          >
                            <div 
                              className="w-8 h-8 rounded-full border border-gray-200" 
                              style={{ backgroundColor: color.hex }}
                            ></div>
                            {selectedColors.includes(color.name) && (
                              <div className="absolute inset-0 rounded-full border-2 border-black"></div>
                            )}
                          </div>
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
                            className={`w-10 h-10 rounded-md border transition-all ${
                              selectedSizes.includes(size) 
                                ? 'border-black bg-black text-white' 
                                : 'border-gray-300 hover:border-gray-400 text-gray-700'
                            }`}
                            onClick={() => handleSizeChange(size)}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Dress Style */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Dress Style</h3>
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

                    <div className="flex space-x-3">
                      <button 
                        className="flex-1 py-3 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
                        onClick={clearAllFilters}
                      >
                        Clear All
                      </button>
                      <button 
                        className="flex-1 py-3 bg-black text-white rounded-md font-medium hover:bg-gray-900 transition-colors"
                        onClick={() => {
                          applyFilters();
                          setShowMobileFilters(false);
                        }}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Top Controls */}
            <div className="bg-white rounded-xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold">Casual</h1>
                <p className="text-gray-500 text-sm mt-1">Showing 1–{Math.min(productsPerPage, products.length)} of {products.length} Products</p>
              </div>
              <div className="mt-3 sm:mt-0 relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="popular">Sort by Most Popular</option>
                  <option value="newest">Sort by Newest</option>
                  <option value="price-low">Sort by Price: Low to High</option>
                  <option value="price-high">Sort by Price: High to Low</option>
                  <option value="rating">Sort by Rating</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <FaChevronDown className="text-gray-400 text-xs" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
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
                        className="w-full h-80 object-cover"
                        variants={imageVariants}
                      />
                      {product.discount && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                          -{product.discount}%
                        </div>
                      )}
                      <button 
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          wishlist.includes(product.id) 
                            ? 'bg-red-50 text-red-500' 
                            : 'bg-white text-gray-600 hover:text-red-500'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                      >
                        <FaHeart className={wishlist.includes(product.id) ? 'fill-current' : ''} />
                      </button>
                    </div>
                  </Link>
                  
                  <div className="p-4">
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-medium hover:text-gray-700 transition-colors">{product.name}</h3>
                      <div className="flex items-center mt-1">
                        <div className="flex text-xs text-yellow-400">
                          {renderStarRating(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                      
                      <div className="mt-2 flex items-center">
                        <span className="font-bold">${product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </Link>
                    
                    <div className="mt-3 flex space-x-1">
                      {product.colors.map((color, i) => (
                        <div 
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                    
                    <button className="mt-3 w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm font-medium transition-colors">
                      Quick View
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-10 flex justify-center">
              <nav className="flex items-center space-x-1">
                <button 
                  className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }).map((_, index) => {
                  const pageNumber = index + 1;
                  return (
                    <button
                      key={pageNumber}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === pageNumber
                          ? 'bg-black text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                
                {totalPages > 5 && (
                  <>
                    <span className="px-2">...</span>
                    <button
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
                
                <button 
                  className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

export default CasualCollection;