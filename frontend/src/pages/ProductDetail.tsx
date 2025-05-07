import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// Icons
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaChevronRight } from 'react-icons/fa';
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';

// Import product data
import productData from '../../../Dataset/1163.json';

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface RelatedProduct {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviews: number;
  image: string;
  colors: string[];
}

const ProductDetail: React.FC = () => {
  // Extract product info from JSON
  const product = productData.data;
  
  // State for product details
  const [selectedColor, setSelectedColor] = useState<string>('blue');
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isWishlist, setIsWishlist] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<string>('latest');
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);

  // Product images from JSON
  const productImages = [
    product.styleImages.default.imageURL,
    product.styleImages.back.imageURL,
    product.styleImages.front.imageURL,
    product.brandUserProfile.image,
  ];

  // Colors available - using the baseColour from JSON
  const colors = [
    { name: 'blue', hex: '#000080' },
    { name: 'navy', hex: '#000040' },
    { name: 'lightblue', hex: '#ADD8E6' },
  ];

  // Sizes available from JSON
  const sizes = product.styleOptions
    .filter(option => option.name === 'Size')
    .map(option => option.value);

  // Reviews
  const reviews: Review[] = [
    {
      id: 1,
      name: 'Alex Johnson',
      rating: 5,
      date: '12 Aug 2023',
      comment: "This jersey is amazing! The fabric is so comfortable. I've been wearing it non-stop since I got it. The design is eye-catching and I've received many compliments.",
      helpful: 24,
    },
    {
      id: 2,
      name: 'Sarah Miller',
      rating: 4,
      date: '28 Jul 2023',
      comment: "Great quality jersey. The fit is perfect and the material feels premium. The only reason I'm giving 4 stars is because the color is slightly different from what I expected.",
      helpful: 16,
    },
    {
      id: 3,
      name: 'Michael Chen',
      rating: 4.5,
      date: '15 Jul 2023',
      comment: 'Excellent product for the price. The design is unique and the fabric is breathable. Perfect for cricket matches. Would definitely recommend!',
      helpful: 9,
    },
  ];

  // Related products
  const relatedProducts: RelatedProduct[] = [
    {
      id: 1,
      name: 'NIKE TEAM INDIA JERSEY',
      price: 895,
      originalPrice: 1200,
      discount: 25,
      rating: 4.3,
      reviews: 42,
      image: product.styleImages.default.imageURL,
      colors: ['#000080', '#6B8E23', '#4682B4'],
    },
    {
      id: 2,
      name: 'NIKE DRI-FIT SPORTS TEE',
      price: 795,
      rating: 4.7,
      reviews: 56,
      image: product.styleImages.front.imageURL,
      colors: ['#000080', '#FFF', '#8B4513'],
    },
    {
      id: 3,
      name: 'NIKE CRICKET FANWEAR',
      price: 995,
      originalPrice: 1250,
      discount: 20,
      rating: 4.1,
      reviews: 28,
      image: product.styleImages.back.imageURL,
      colors: ['#000080', '#000', '#8B0000'],
    },
    {
      id: 4,
      name: 'NIKE PERFORMANCE JERSEY',
      price: 1095,
      rating: 4.8,
      reviews: 64,
      image: product.styleImages.default.resolutions['360X480'],
      colors: ['#000080', '#000', '#4B0082'],
    },
    {
      id: 5,
      name: 'NIKE TEAM SUPPORTER TEE',
      price: 780,
      rating: 4.8,
      reviews: 85,
      image: product.styleImages.front.resolutions['360X480'],
      colors: ['#000080', '#000', '#4B0082'],
    },
  ];

  // Handlers
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const toggleWishlist = () => setIsWishlist(prev => !prev);
  
  // Form handlers
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewEmail, setReviewEmail] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  
  const handleReviewSubmit = () => {
    // Validation
    if (!reviewName || !reviewEmail || !reviewComment) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Here you would typically send the review to your backend
    console.log({
      name: reviewName,
      email: reviewEmail,
      rating: reviewRating,
      comment: reviewComment
    });
    
    // Reset form and close it
    setReviewName('');
    setReviewEmail('');
    setReviewComment('');
    setReviewRating(5);
    setShowReviewForm(false);
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
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

  const thumbnailHover = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
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

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <Link to={`/shop/${product.gender.toLowerCase()}`} className="hover:text-black transition-colors">{product.gender}</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <Link to={`/shop/${product.gender.toLowerCase()}/${product.articleType.typeName.toLowerCase()}`} className="hover:text-black transition-colors">{product.articleType.typeName}</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <span className="text-black font-medium">{product.brandName}</span>
        </nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          {/* Product Images */}
          <motion.div 
            className="flex flex-col-reverse md:flex-row gap-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            {/* Thumbnails */}
            <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
              {productImages.map((img, index) => (
                <motion.div 
                  key={index}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    activeImage === index ? 'border-black' : 'border-transparent'
                  }`}
                  onClick={() => setActiveImage(index)}
                  whileHover="hover"
                  variants={thumbnailHover}
                >
                  <img 
                    src={img} 
                    alt={`Product view ${index + 1}`} 
                    className="w-16 h-16 md:w-20 md:h-20 object-cover"
                  />
                </motion.div>
              ))}
            </div>

            {/* Main Image */}
            <motion.div 
              className="flex-1 rounded-xl overflow-hidden bg-white"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                src={productImages[activeImage]} 
                alt="ONE LIFE GRAPHIC T-SHIRT" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.h1 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold tracking-tight"
            >
              {product.productDisplayName}
            </motion.h1>

            <motion.div 
              variants={fadeIn}
              className="flex items-center mt-2"
            >
              <div className="flex mr-2">
                {renderStarRating(product.myntraRating || 4)}
              </div>
              <span className="text-gray-600 text-sm">{product.myntraRating || 4} ({reviews.length} reviews)</span>
            </motion.div>

            <motion.div 
              variants={fadeIn}
              className="mt-4 flex items-center"
            >
              <span className="text-2xl md:text-3xl font-bold">₹{product.price}</span>
              {product.price !== product.discountedPrice && (
                <>
                  <span className="ml-3 text-lg text-gray-500 line-through">₹{product.price * 1.15}</span>
                  <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">-15%</span>
                </>
              )}
            </motion.div>

            <motion.p 
              variants={fadeIn}
              className="mt-6 text-gray-600"
            >
              {product.productDescriptors.description.value.replace(/<\/?p>|<\/?br>/g, '')}
            </motion.p>

            {/* Color Selection */}
            <motion.div variants={fadeIn} className="mt-8">
              <h3 className="font-medium mb-3">Color</h3>
              <div className="flex space-x-3">
                {colors.map(color => (
                  <div 
                    key={color.name}
                    className={`relative cursor-pointer rounded-full transition-transform ${
                      selectedColor === color.name ? 'transform scale-110' : ''
                    }`}
                    onClick={() => setSelectedColor(color.name)}
                  >
                    <div 
                      className="w-8 h-8 rounded-full" 
                      style={{ backgroundColor: color.hex }}
                    ></div>
                    {selectedColor === color.name && (
                      <div className="absolute inset-0 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Size Selection */}
            <motion.div variants={fadeIn} className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium">Size</h3>
                <button className="text-sm text-gray-600 underline">Size Guide</button>
              </div>
              <div className="flex space-x-3">
                {sizes.map(size => (
                  <button
                    key={size}
                    className={`w-12 h-12 rounded-md border transition-all ${
                      selectedSize === size 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Quantity */}
            <motion.div variants={fadeIn} className="mt-8">
              <h3 className="font-medium mb-3">Quantity</h3>
              <div className="flex items-center border border-gray-300 rounded-md w-32">
                <button 
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black"
                  onClick={decrementQuantity}
                >
                  <HiOutlineMinus />
                </button>
                <span className="flex-1 text-center">{quantity}</span>
                <button 
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-black"
                  onClick={incrementQuantity}
                >
                  <HiOutlinePlus />
                </button>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={fadeIn} className="mt-8 flex flex-col sm:flex-row gap-4">
              {product.otherFlags?.some(flag => flag.name === 'isTryAndBuyEnabled' && flag.value === 'true') && (
                <motion.button
                  className="flex-1 bg-black text-white py-3 px-6 rounded-md font-medium flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try-On
                </motion.button>
              )}
              <motion.button
                className="flex-1 bg-black text-white py-3 px-6 rounded-md font-medium flex items-center justify-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaShoppingCart className="mr-2" />
                Add to Cart
              </motion.button>
              <motion.button
                className={`w-12 h-12 rounded-md flex items-center justify-center ${
                  isWishlist ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
              >
                <FaHeart className={isWishlist ? 'fill-current' : ''} />
              </motion.button>
              <motion.button
                className="w-12 h-12 bg-gray-100 text-gray-600 rounded-md flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaShare />
              </motion.button>
            </motion.div>

            {/* Product Details */}
            <motion.div variants={fadeIn} className="mt-8 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-5 text-sm">
                <div>
                  <p className="text-gray-500">SKU</p>
                  <p>{product.articleNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{product.displayCategories}</p>
                </div>
                <div>
                  <p className="text-gray-500">Material</p>
                  <p>{product.productDescriptors.materials_care_desc.value.replace(/<\/?p>|<\/?br>/g, ', ')}</p>
                </div>
                <div>
                  <p className="text-gray-500">Brand</p>
                  <p>{product.brandName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Fit</p>
                  <p>{product.articleAttributes.Fit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Occasion</p>
                  <p>{product.articleAttributes.Occasion}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Related Products */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-2xl font-bold mb-8"
          >
            More {product.brandName} {product.articleType.typeName}
          </motion.h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {relatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                variants={fadeIn}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-64 object-cover"
                  />
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      -{product.discount}%
                    </div>
                  )}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 transition-colors">
                    <FaHeart />
                  </button>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium">{product.name}</h3>
                  <div className="flex items-center mt-1">
                    <div className="flex text-xs text-yellow-400">
                      {renderStarRating(product.rating)}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                  </div>
                  
                  <div className="mt-2 flex items-center">
                    <span className="font-bold">₹{product.price}</span>
                    {product.originalPrice && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>
                  
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
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="flex justify-between items-center mb-8 ">
            <motion.h2 
              variants={fadeIn}
              className="text-2xl font-bold"
            >
              Ratings & Reviews
            </motion.h2>
            
            <motion.div variants={fadeIn} className="flex items-center space-x-4">
              <div className="relative">
                <select 
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  value={reviewFilter}
                  onChange={(e) => setReviewFilter(e.target.value)}
                >
                  <option value="latest">Latest</option>
                  <option value="highest">Highest Rating</option>
                  <option value="lowest">Lowest Rating</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-black text-white py-2 px-4 rounded-md text-sm font-medium"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                Write a Review
              </motion.button>
            </motion.div>
          </div>
          
          {/* Review Form */}
          <AnimatePresence>
            {showReviewForm && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white rounded-xl p-6 mb-8 overflow-hidden"
              >
                <h3 className="text-lg font-medium mb-4">Write Your Review</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Enter your name"
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Your email (won't be published)"
                      value={reviewEmail}
                      onChange={(e) => setReviewEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <div className="flex text-2xl">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star} 
                        className={`${star <= reviewRating ? 'text-yellow-400' : 'text-gray-300'} mr-1`}
                        onClick={() => setReviewRating(star)}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
                  <textarea 
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black h-32"
                    placeholder="Share your experience with this product..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button 
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium"
                    onClick={() => setShowReviewForm(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium"
                    onClick={handleReviewSubmit}
                  >
                    Submit Review
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Reviews List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                variants={fadeIn}
                className="bg-white rounded-xl p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{review.name}</h3>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {renderStarRating(review.rating)}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <button className="text-gray-500 hover:text-black transition-colors">
                      <span className="mr-1">Helpful ({review.helpful})</span>
                    </button>
                  </div>
                </div>
                
                <p className="mt-4 text-gray-600">{review.comment}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <button className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
              Load More Reviews
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default ProductDetail;