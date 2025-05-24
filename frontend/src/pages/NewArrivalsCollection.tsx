import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../config/axios';
import { CollectionPageSkeleton } from '../components/Skeletons';

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

// Product interface based on JSON structure
interface Product {
  id: number;
  price: number;
  discountedPrice: number;
  productDisplayName: string;
  brandName: string;
  baseColour: string;
  gender: string;
  usage: string;
  styleImages: {
    default: {
      imageURL: string;
    };
  };
  articleType: {
    typeName: string;
  };
  masterCategory: {
    typeName: string;
  };
  subCategory: {
    typeName: string;
  };
}

interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  totalPages: number;
}

// Add color mapping for visual representation
const colorMap: { [key: string]: string } = {
  'Black': '#000000',
  'White': '#FFFFFF',
  'Blue': '#0000FF',
  'Red': '#FF0000',
  'Green': '#008000',
  'Yellow': '#FFFF00',
  'Purple': '#800080',
  'Pink': '#FFC0CB',
  'Orange': '#FFA500',
  'Brown': '#A52A2A',
  'Grey': '#808080',
  'Navy': '#000080',
  'Beige': '#F5F5DC',
  'Maroon': '#800000',
  'Teal': '#008080',
  'Olive': '#808000',
  'Lavender': '#E6E6FA',
  'Cyan': '#00FFFF',
  'Magenta': '#FF00FF',
  'Gold': '#FFD700',
  'Silver': '#C0C0C0',
  'Khaki': '#F0E68C',
  'Indigo': '#4B0082',
  'Turquoise': '#40E0D0',
  'Coral': '#FF7F50',
  'Cream': '#FFFDD0',
  'Mint': '#98FF98',
  'Peach': '#FFDAB9',
  'Tan': '#D2B48C',
  'Wine': '#722F37'
};

const NewArrivalsCollection: React.FC = () => {
  // State for filters
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Fetch products using React Query
  const { data: productsData, isLoading } = useQuery<ProductsResponse>({
    queryKey: ['latestProducts', currentPage, sortBy, selectedCategories, selectedColors, selectedBrands, priceRange],
    queryFn: async () => {
      const response = await api.get<ProductsResponse>('/products/latest', {
        params: {
          page: currentPage,
          limit: 12,
          sort: sortBy,
          categories: selectedCategories.join(','),
          colors: selectedColors.join(','),
          brands: selectedBrands.join(','),
          minPrice: priceRange[0],
          maxPrice: priceRange[1]
        }
      });
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  const products = productsData?.data || [];
  const totalPages = productsData?.totalPages || 1;
  const totalProducts = productsData?.total || 0;

  // Get unique values for filters
  const categories = Array.from(new Set(products.map((p: Product) => p.articleType.typeName)));
  const colors = Array.from(new Set(products.map((p: Product) => p.baseColour)));
  const brands = Array.from(new Set(products.map((p: Product) => p.brandName)));

  // Initialize wishlist from localStorage
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlistIds = JSON.parse(savedWishlist);
        if (Array.isArray(wishlistIds)) {
          setWishlist(wishlistIds);
        }
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        setWishlist([]);
      }
    }
  }, []);

  // Toggle wishlist
  const toggleWishlist = (productId: number) => {
    const savedWishlist = localStorage.getItem('wishlist');
    let wishlistIds: number[] = [];
    
    if (savedWishlist) {
      try {
        wishlistIds = JSON.parse(savedWishlist);
        if (!Array.isArray(wishlistIds)) {
          wishlistIds = [];
        }
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        wishlistIds = [];
      }
    }

    if (wishlistIds.includes(productId)) {
      // Remove from wishlist
      wishlistIds = wishlistIds.filter(id => id !== productId);
    } else {
      // Add to wishlist
      wishlistIds.push(productId);
    }

    // Save to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlistIds));
    setWishlist(wishlistIds);
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

  const handleBrandChange = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter(b => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  // Update price range handling
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newValue = parseInt(e.target.value);
    const newPriceRange = [...priceRange] as [number, number];
    
    // Ensure min doesn't exceed max and vice versa
    if (index === 0) {
      newPriceRange[0] = Math.min(newValue, priceRange[1]);
    } else {
      newPriceRange[1] = Math.max(newValue, priceRange[0]);
    }
    
    setPriceRange(newPriceRange);
  };

  // Get min and max prices from products
  const minPrice = Math.min(...products.map(p => p.price));
  const maxPrice = Math.max(...products.map(p => p.price));

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedBrands([]);
    const prices = products.map((p: Product) => p.price);
    setPriceRange([Math.min(...prices), Math.max(...prices)]);
  };

  // Render star rating (placeholder since we don't have ratings in the JSON)
  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  // Animation variants
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

  if (isLoading) {
    return <CollectionPageSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm text-gray-500 mb-8">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <span className="text-black font-medium">New Arrivals</span>
        </nav>

        {/* New Arrivals Banner */}
        <div className="relative mb-12 overflow-hidden rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90 z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
            alt="New Arrivals"
            className="w-full h-[250px] object-cover"
          />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">NEW ARRIVALS</h1>
            <p className="text-xl max-w-2xl">Discover our latest collection of fresh styles and trends</p>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button 
            className="w-full py-3 bg-black text-white rounded-xl flex items-center justify-center font-medium shadow-lg hover:bg-gray-800 transition-all duration-300"
            onClick={() => setShowMobileFilters(true)}
          >
            <FaFilter className="mr-2" />
            Show Filters
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button 
                  className="text-sm text-gray-500 hover:text-black transition-colors"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </div>

              {/* Categories */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Category</h3>
                <div className="space-y-3">
                  {categories.map(category => (
                    <label key={category} className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                        checked={selectedCategories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-black transition-colors">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Price Range</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                    <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div 
                      className="absolute h-2 bg-grey-50 rounded-full"
                      style={{ 
                        left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`, 
                        right: `${100 - ((priceRange[1] - minPrice) / (maxPrice - minPrice)) * 100}%` 
                      }}
                    ></div>
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[0]}
                      onChange={(e) => handlePriceChange(e, 0)}
                      className="absolute w-full h-2 opacity-0 cursor-pointer"
                    />
                    <input
                      type="range"
                      min={minPrice}
                      max={maxPrice}
                      value={priceRange[1]}
                      onChange={(e) => handlePriceChange(e, 1)}
                      className="absolute w-full h-2 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Min</label>
                      <input 
                        type="number" 
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange[0]} 
                        onChange={(e) => handlePriceChange(e, 0)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">Max</label>
                      <input 
                        type="number" 
                        min={minPrice}
                        max={maxPrice}
                        value={priceRange[1]} 
                        onChange={(e) => handlePriceChange(e, 1)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Colors</h3>
                <div className="flex flex-wrap gap-3">
                  {colors.map(color => {
                    const colorHex = colorMap[color] || '#CCCCCC';
                    return (
                      <button
                        key={color}
                        className={`relative w-8 h-8 rounded-full transition-all duration-300 ${
                          selectedColors.includes(color) 
                            ? 'ring-2 ring-black ring-offset-2' 
                            : 'hover:ring-2 hover:ring-gray-300'
                        }`}
                        style={{ backgroundColor: colorHex }}
                        onClick={() => handleColorChange(color)}
                        title={color}
                      >
                        {selectedColors.includes(color) && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4 text-lg">Brands</h3>
                <div className="space-y-3">
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center cursor-pointer group">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-5 w-5 text-black rounded border-gray-300 focus:ring-black"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-black transition-colors">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Apply Filters Button */}
              <button 
                className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 shadow-lg"
                onClick={() => {
                  // Implement apply filters logic
                }}
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results Count */}
            <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-[20px] font-bold text-gray-800 mb-2">New Arrivals</h1>
                <p className="text-gray-600">Showing <span className="font-semibold text-black">{totalProducts}</span> products</p>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 mr-3">Sort by:</span>
                <div className="relative">
                  <select 
                    className="appearance-none bg-white border border-gray-300 rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="popular">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                    <FaChevronDown className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {products.map((product: Product) => (
                <motion.div
                  key={product.id}
                  variants={productHover}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                  initial="rest"
                  whileHover="hover"
                  animate={hoveredProduct === product.id ? "hover" : "rest"}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="relative overflow-hidden group">
                      <motion.img 
                        src={product.styleImages.default.imageURL} 
                        alt={product.productDisplayName}
                        className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                        variants={imageVariants}
                      />
                      <div className="absolute top-3 left-3 bg-indigo-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        NEW
                      </div>
                      <button 
                        className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                      >
                        <FaHeart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </Link>
                  <div className="p-5">
                    <Link to={`/product/${product.id}`} className="block">
                      <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{product.productDisplayName}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.brandName}</p>
                      <div className="flex items-center mb-3">
                        <div className="flex mr-2">
                          {renderStarRating()}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 text-lg">₹{product.discountedPrice}</span>
                        {product.discountedPrice < product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price}</span>
                        )}
                      </div>
                    </Link>
                    <div className="mt-3">
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.baseColour}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button 
                  className="p-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                >
                  <FaChevronLeft className="h-4 w-4" />
                </button>
                {[...Array(totalPages)].map((_, index) => {
                  const shouldShow = 
                    index === 0 || 
                    index === totalPages - 1 || 
                    Math.abs(currentPage - (index + 1)) <= 1;

                  if (!shouldShow) {
                    if (index === 1 || index === totalPages - 2) {
                      return <span key={index} className="px-3">...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={index}
                      className={`w-12 h-12 rounded-xl text-sm font-medium transition-all duration-300 ${
                        currentPage === index + 1
                          ? 'bg-black text-white shadow-lg'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-100'
                      }`}
                      onClick={() => setCurrentPage(index + 1)}
                    >
                      {index + 1}
                    </button>
                  );
                })}
                <button 
                  className="p-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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

export default NewArrivalsCollection;