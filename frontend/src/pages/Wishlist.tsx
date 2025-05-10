import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  FaStar, 
  FaStarHalfAlt, 
  FaRegStar, 
  FaChevronRight, 
  FaHeart, 
  FaTrashAlt,
  FaShoppingBag
} from 'react-icons/fa';
import { HiOutlineShoppingBag } from 'react-icons/hi';

// Import product data
import productData from '../../../Dataset/1163.json';

interface Product {
  id: number;
  price: number;
  discountedPrice: number;
  productDisplayName: string;
  brandName: string;
  baseColour: string;
  myntraRating: number;
  articleNumber: string;
  displayCategories: string;
  season: string;
  gender: string;
  styleImages: {
    default: { 
      imageURL: string;
      resolutions?: {
        [key: string]: string;
      };
    };
    back: { 
      imageURL: string;
      resolutions?: {
        [key: string]: string;
      };
    };
    front: { 
      imageURL: string;
      resolutions?: {
        [key: string]: string;
      };
    };
  };
  styleOptions: Array<{
    name: string;
    value: string;
    available: boolean;
  }>;
}

const Wishlist: React.FC = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [selectedSize, setSelectedSize] = useState<{[key: number]: string}>({});
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const [isRemoving, setIsRemoving] = useState<{[key: number]: boolean}>({});

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        setWishlist(parsedWishlist);
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
        // If there's an error, initialize with default product
        initializeDefaultWishlist();
      }
    } else {
      // If no wishlist exists, initialize with default product
      initializeDefaultWishlist();
    }
  }, []);

  // Function to initialize default wishlist
  const initializeDefaultWishlist = () => {
    const defaultWishlist = [1163]; // Using the product ID from the JSON file
    setWishlist(defaultWishlist);
    localStorage.setItem('wishlist', JSON.stringify(defaultWishlist));
  };

  // Update wishlistProducts whenever wishlist changes
  useEffect(() => {
    if (wishlist.length === 0) {
      setWishlistProducts([]);
      return;
    }

    // For demo, we'll use the same product data for all items
    const products = wishlist.map(id => ({
      ...productData.data,
      id: id
    }));
    setWishlistProducts(products);
    
    // Initialize selected sizes
    const initialSizes: {[key: number]: string} = {};
    products.forEach(product => {
      const availableSizes = product.styleOptions
        .filter(option => option.name === 'Size' && option.available)
        .map(option => option.value);
      if (availableSizes.length > 0) {
        initialSizes[product.id] = availableSizes[0];
      }
    });
    setSelectedSize(initialSizes);
  }, [wishlist]);

  // Remove item from wishlist
  const removeFromWishlist = (productId: number) => {
    setIsRemoving({...isRemoving, [productId]: true});
    
    setTimeout(() => {
      const updatedWishlist = wishlist.filter(id => id !== productId);
      
      // If the wishlist becomes empty, reinitialize it
      if (updatedWishlist.length === 0) {
        initializeDefaultWishlist();
      } else {
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      }
      
      const newIsRemoving = {...isRemoving};
      delete newIsRemoving[productId];
      setIsRemoving(newIsRemoving);
    }, 300);
  };

  // Handle size selection
  const handleSizeChange = (productId: number, size: string) => {
    setSelectedSize({...selectedSize, [productId]: size});
  };

  // Add to cart
  const addToCart = (productId: number) => {
    const size = selectedSize[productId];
    const product = wishlistProducts.find(p => p.id === productId);
    if (product) {
      alert(`Added ${product.productDisplayName} (Size: ${size}) to cart`);
    }
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
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 }
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
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <span className="text-black font-medium">Wishlist</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600 mt-2">Items you've saved for later</p>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <FaHeart className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">Browse our collections and add your favorite items to your wishlist.</p>
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <AnimatePresence>
              {wishlistProducts.map((product) => (
                <motion.div
                  key={product.id}
                  variants={fadeIn}
                  initial="hidden"
                  animate={isRemoving[product.id] ? "exit" : "visible"}
                  exit="exit"
                  layout
                >
                  <motion.div
                    variants={productHover}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    initial="rest"
                    whileHover="hover"
                    animate={hoveredProduct === product.id ? "hover" : "rest"}
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                  >
                    <div className="relative overflow-hidden">
                      <Link to={`/product/${product.id}`}>
                        <motion.img 
                          src={product.styleImages.default.imageURL} 
                          alt={product.productDisplayName}
                          className="w-full h-64 object-cover"
                          variants={imageVariants}
                        />
                      </Link>
                      {product.discountedPrice !== product.price && (
                        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                          {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                        </div>
                      )}
                      <button 
                        className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition-shadow text-red-500"
                        onClick={() => removeFromWishlist(product.id)}
                        aria-label="Remove from wishlist"
                      >
                        <FaHeart className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-1">
                        <span className="text-xs font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded">
                          {product.gender}
                        </span>
                      </div>
                      <Link to={`/product/${product.id}`} className="block">
                        <h3 className="font-medium text-gray-900 mb-1">{product.productDisplayName}</h3>
                        <div className="flex items-center mb-1">
                          <div className="flex mr-1">
                            {renderStarRating(product.myntraRating)}
                          </div>
                          <span className="text-xs text-gray-500">({product.myntraRating})</span>
                        </div>
                        <div className="flex items-center mb-3">
                          <span className="font-bold text-gray-900">₹{product.price}</span>
                          {product.discountedPrice !== product.price && (
                            <span className="ml-2 text-sm text-gray-500 line-through">₹{product.discountedPrice}</span>
                          )}
                        </div>
                      </Link>
                      
                      {/* Size Selection */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.styleOptions
                            .filter(option => option.name === 'Size' && option.available)
                            .map(option => (
                              <button
                                key={option.value}
                                className={`px-3 py-1 ${
                                  selectedSize[product.id] === option.value 
                                    ? 'bg-black text-white border-black' 
                                    : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                                }`}
                                onClick={() => handleSizeChange(product.id, option.value)}
                              >
                                {option.value}
                              </button>
                            ))}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <button 
                          className="flex-1 py-2 bg-black text-white rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                          onClick={() => addToCart(product.id)}
                        >
                          <FaShoppingBag className="mr-2 h-4 w-4" />
                          Add to Cart
                        </button>
                        <button 
                          className="p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => removeFromWishlist(product.id)}
                          aria-label="Remove from wishlist"
                        >
                          <FaTrashAlt className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Continue Shopping Button */}
        {wishlistProducts.length > 0 && (
          <div className="mt-12 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-black font-medium hover:underline"
            >
              <HiOutlineShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;