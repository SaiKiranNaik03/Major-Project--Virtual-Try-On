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

// Sample product data - this would normally come from your global state or API
const allProducts = [
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
    style: 'Casual',
    gender: 'Men'
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
    style: 'Casual',
    gender: 'Men'
  },
  {
    id: 3,
    name: 'Women\'s Floral Dress',
    price: 135,
    originalPrice: 170,
    discount: 20,
    rating: 4.6,
    reviews: 48,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FF69B4', '#4682B4'],
    sizes: ['XS', 'S', 'M', 'L'],
    category: 'Dresses',
    style: 'Casual',
    gender: 'Women'
  },
  {
    id: 4,
    name: 'Women\'s Blazer',
    price: 180,
    originalPrice: 220,
    discount: 18,
    rating: 4.3,
    reviews: 32,
    image: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#D3D3D3', '#000080', '#8B0000'],
    sizes: ['XS', 'S', 'M', 'L'],
    category: 'Blazers',
    style: 'Formal',
    gender: 'Women'
  },
  {
    id: 5,
    name: 'Modern Minimalist Shirt',
    price: 125,
    rating: 4.8,
    reviews: 12,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#000', '#FFF', '#4682B4'],
    sizes: ['S', 'M', 'L', 'XL'],
    category: 'Shirts',
    style: 'Casual',
    gender: 'Men',
    isNew: true
  },
  {
    id: 6,
    name: 'Women\'s Summer Dress',
    price: 145,
    rating: 4.7,
    reviews: 14,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    colors: ['#FFF', '#FF69B4', '#4682B4'],
    sizes: ['XS', 'S', 'M', 'L'],
    category: 'Dresses',
    style: 'Casual',
    gender: 'Women',
    isNew: true
  }
];

const Wishlist: React.FC = () => {
  // In a real app, this would be stored in global state (Redux, Context API, etc.)
  // For this example, we'll use localStorage to persist the wishlist
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
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
      }
    } else {
      // For demo purposes, initialize with some items
      const demoWishlist = [1, 3, 5];
      setWishlist(demoWishlist);
      localStorage.setItem('wishlist', JSON.stringify(demoWishlist));
    }
  }, []);

  // Update wishlistProducts whenever wishlist changes
  useEffect(() => {
    const products = allProducts.filter(product => wishlist.includes(product.id));
    setWishlistProducts(products);
    
    // Initialize selected sizes
    const initialSizes: {[key: number]: string} = {};
    products.forEach(product => {
      initialSizes[product.id] = product.sizes[0];
    });
    setSelectedSize(initialSizes);
  }, [wishlist]);

  // Remove item from wishlist
  const removeFromWishlist = (productId: number) => {
    setIsRemoving({...isRemoving, [productId]: true});
    
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      const updatedWishlist = wishlist.filter(id => id !== productId);
      setWishlist(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      
      // Reset the removing state for this product
      const newIsRemoving = {...isRemoving};
      delete newIsRemoving[productId]; // Remove this product from the isRemoving state
      setIsRemoving(newIsRemoving);
    }, 300);
  };

  // Handle size selection
  const handleSizeChange = (productId: number, size: string) => {
    setSelectedSize({...selectedSize, [productId]: size});
  };

  // Add to cart (in a real app, this would dispatch to your cart state)
  const addToCart = (productId: number) => {
    const size = selectedSize[productId];
    console.log(`Added product ${productId} with size ${size} to cart`);
    // Here you would dispatch to your cart state
    alert(`Added ${wishlistProducts.find(p => p.id === productId)?.name} (Size: ${size}) to cart`);
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
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
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
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-64 object-cover"
                            variants={imageVariants}
                          />
                        </Link>
                        {product.discount && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.discount}% OFF
                          </div>
                        )}
                        {product.isNew && (
                          <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">
                            NEW
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
                          <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                          <div className="flex items-center mb-1">
                            <div className="flex mr-1">
                              {renderStarRating(product.rating)}
                            </div>
                            <span className="text-xs text-gray-500">({product.reviews})</span>
                          </div>
                          <div className="flex items-center mb-3">
                            <span className="font-bold text-gray-900">${product.price}</span>
                            {product.originalPrice && (
                              <span className="ml-2 text-sm text-gray-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                        </Link>
                        
                        {/* Size Selection */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Size
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {product.sizes.map((size: string) => (
                              <button
                              key={size}
                              className={`px-3 py-1 ${
                                selectedSize[product.id] === size 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-gray-700 border-gray-300 hover:border-black'
                              }`}
                                onClick={() => handleSizeChange(product.id, size)}
                              >
                                {size}
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