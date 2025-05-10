import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import TryOnDialog from '../components/TryOnDialog';
import ErrorBoundary from '../components/ErrorBoundary';

// Icons
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart, FaHeart, FaShare, FaChevronRight, FaTruck, FaUndo, FaExchangeAlt, FaTimes, FaCamera } from 'react-icons/fa';
import { HiOutlinePlus, HiOutlineMinus } from 'react-icons/hi';
import { GiTShirt } from 'react-icons/gi';

// Import product data

interface Review {
  id: number;
  name: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

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
  size_representation?: string;
  productDescriptors: {
    description: { value: string };
    style_note: { value: string };
    materials_care_desc: { value: string };
  };
  articleAttributes: {
    Fit: string;
    Occasion: string;
  };
  styleOptions: Array<{
    name: string;
    value: string;
    available: boolean;
  }>;
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
  brandUserProfile: {
    image: string;
  };
  articleType: {
    typeName: string;
  };
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

const ProductDetailContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for product details
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<number>(0);
  const [isWishlist, setIsWishlist] = useState<boolean>(false);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [isTryingOn, setIsTryingOn] = useState<boolean>(false);
  const [reviewFilter, setReviewFilter] = useState<string>('latest');
  const [showReviewForm, setShowReviewForm] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [showTryOn, setShowTryOn] = useState<boolean>(false);
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<RelatedProduct[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState<boolean>(true);

  // Fetch product data when component mounts
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        if (response.data.success && response.data.data) {
          setProduct(response.data.data);
          setSelectedColor(response.data.data.baseColour.toLowerCase());
        } else {
          setError('Product not found');
        }
      } catch (err: any) {
        console.error('Error fetching product:', err);
        setError(err.response?.status === 404 ? 'Product not found' : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    } else {
      setError('Product ID is missing');
    }
  }, [id]);

  // Toggle wishlist
  const toggleWishlist = () => {
    if (!product) {
      toast.error('Product not found');
      return;
    }

    const savedWishlist = localStorage.getItem('wishlist');
    let wishlistItems: number[] = [];
    
    if (savedWishlist) {
      try {
        wishlistItems = JSON.parse(savedWishlist);
        if (!Array.isArray(wishlistItems)) {
          wishlistItems = [];
        }
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        wishlistItems = [];
      }
    }

    if (isWishlist) {
      // Remove from wishlist
      wishlistItems = wishlistItems.filter(id => id !== product.id);
      toast.success('Removed from wishlist');
    } else {
      // Check if product is already in wishlist
      if (wishlistItems.includes(product.id)) {
        toast.error('Product is already in wishlist');
        return;
      }
      // Add to wishlist
      wishlistItems.push(product.id);
      toast.success('Added to wishlist');
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    setIsWishlist(!isWishlist);
  };

  // Check if product is in wishlist on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist && product?.id) {
      try {
        const wishlistItems = JSON.parse(savedWishlist);
        if (Array.isArray(wishlistItems)) {
          setIsWishlist(wishlistItems.includes(product.id));
        }
      } catch (error) {
        console.error('Error parsing wishlist:', error);
        setIsWishlist(false);
      }
    }
  }, [product?.id]);

  // Share product
  const shareProduct = async () => {
    const shareData = {
      title: product?.productDisplayName,
      text: `Check out this ${product?.brandName} ${product?.productDisplayName} on our store!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast.success('Product shared successfully!');
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(window.location.href);
        toast.success('Product link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share product');
    }
  };

  // Try on product
  const handleTryOn = () => {
    setShowTryOn(true);
  };

  // Close try on modal
  const closeTryOn = () => {
    setShowTryOn(false);
  };

  // Handle size selection
  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  // Handle add to cart with size validation
  const handleAddToCart = () => {
    if (!product) {
      toast.error('Product not found');
      return;
    }

    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.productDisplayName,
      price: product.price,
      image: product.styleImages.default.imageURL,
      size: selectedSize,
      quantity: 1,
      brand: product.brandName,
      color: product.baseColour
    };

    const savedCart = localStorage.getItem('cart');
    let cartItems = [];

    if (savedCart) {
      try {
        cartItems = JSON.parse(savedCart);
        if (!Array.isArray(cartItems)) {
          cartItems = [];
        }
      } catch (error) {
        console.error('Error parsing cart:', error);
        cartItems = [];
      }
    }

    // Check if item with same size already exists
    const existingItemIndex = cartItems.findIndex(
      (item: any) => item.id === cartItem.id && item.size === cartItem.size
    );

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push(cartItem);
    }

    localStorage.setItem('cart', JSON.stringify(cartItems));
    toast.success('Added to cart');
  };

  // Handlers
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  
  // Form handlers
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewEmail, setReviewEmail] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');
  
  const handleReviewSubmit = () => {
    // Validation
    if (!reviewName || !reviewEmail || !reviewComment) {
      // alert('Please fill in all required fields');
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

  // Handle person image upload
  const handlePersonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPersonImage(e.target?.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  // Convert image to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  // Process try-on
  const processTryOn = async () => {
    if (!personImage) {
      setError('Please upload your photo first');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert person image to base64
      const personImageBase64 = personImage.split(',')[1];
      
      // Get product image
      const imageUrl = product?.styleImages.default.imageURL;
      if (!imageUrl) {
        throw new Error('Product image not found');
      }
      
      const productImageResponse = await fetch(imageUrl);
      const productImageBlob = await productImageResponse.blob();
      const productImageBase64 = await fileToBase64(new File([productImageBlob], 'product.jpg'));

      // API call to Segmind
      const response = await axios.post(
        import.meta.env.VITE_SEGMIND_API_ENDPOINT || 'https://api.segmind.com/v1/try-on-diffusion',
        {
          model_image: personImageBase64,
          cloth_image: productImageBase64,
          category: 'Upper body',
          num_inference_steps: 35,
          guidance_scale: 2,
          seed: 50000,
          base64: true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_SEGMIND_API_KEY || '',
          },
        }
      );

      if (response.data && response.data.image) {
        const imageUrl = `data:image/jpeg;base64,${response.data.image}`;
        setTryOnResult(imageUrl);
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || 'Failed to perform virtual try-on. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Reset try-on
  const resetTryOn = () => {
    setPersonImage(null);
    setTryOnResult(null);
    setError(null);
  };

  // Fetch recommendations when product data is loaded
  useEffect(() => {
    let isMounted = true;
    
    const loadRecommendations = async () => {
      if (!product?.id) {
        return; // Don't fetch recommendations if we don't have a product
      }

      setIsLoadingRecommendations(true);
      try {
        console.log('Fetching recommendations for product:', product.id);
        
        // Fetch the product image as a blob
        const imageResponse = await fetch(product.styleImages.default.imageURL);
        if (!imageResponse.ok) {
          throw new Error(`Failed to fetch product image: ${imageResponse.status}`);
        }
        
        const imageBlob = await imageResponse.blob();
        const formData = new FormData();
        formData.append('file', new File([imageBlob], `${product.id}.jpg`, { type: imageBlob.type }));

        // POST the image to the backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/recommend`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const recommendedIds = await response.json();
        if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
          console.error('No recommended IDs received');
          setRecommendedProducts([]);
          return;
        }

        const recommendedProducts: RelatedProduct[] = [];
        for (const id of recommendedIds) {
          try {
            const productData = await import(`../../../Dataset/styles/${id}.json`);
            if (!productData || !productData.data) {
              console.error(`Invalid product data for ID ${id}`);
              continue;
            }

            const recProduct = productData.data;
            recommendedProducts.push({
              id: recProduct.id,
              name: recProduct.productDisplayName,
              price: recProduct.price,
              originalPrice: recProduct.discountedPrice !== recProduct.price ? recProduct.price : undefined,
              discount: recProduct.discountedPrice !== recProduct.price 
                ? Math.round((1 - recProduct.discountedPrice / recProduct.price) * 100) 
                : undefined,
              rating: recProduct.myntraRating || 0,
              reviews: Math.floor(Math.random() * 100) + 1,
              image: recProduct.styleImages.default.imageURL,
              colors: [recProduct.baseColour.toLowerCase()]
            });
          } catch (error) {
            console.error(`Error loading product ${id}:`, error);
          }
        }
        
        if (isMounted && recommendedProducts.length > 0) {
          setRecommendedProducts(recommendedProducts);
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        if (isMounted) {
          toast.error('Failed to load recommendations');
        }
      } finally {
        if (isMounted) {
          setIsLoadingRecommendations(false);
        }
      }
    };

    loadRecommendations();

    return () => {
      isMounted = false;
    };
  }, [product?.id]); // Only run when product ID changes

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  // Show error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Product not found'}</p>
          <Link to="/" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  // Product images from JSON
  const productImages = [
    product?.styleImages?.default?.imageURL,
    product?.styleImages?.back?.imageURL,
    product?.styleImages?.front?.imageURL,
    product?.brandUserProfile?.image,
  ].filter(Boolean); // Remove any undefined values

  // Sizes available from JSON
  const sizes = Array.isArray(product?.styleOptions) 
    ? product.styleOptions
        .filter(option => option?.name === 'Size' && option?.value)
        .map(option => ({
          value: option.value || '',
          available: Boolean(option?.available)
        }))
    : [];

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

  // Helper function to safely get nested values
  const getNestedValue = (obj: any, path: string[], defaultValue: any = '') => {
    return path.reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : defaultValue), obj);
  };

  // Get product descriptors with fallbacks
  const productDescriptors = {
    description: getNestedValue(product, ['productDescriptors', 'description', 'value'], 'No description available'),
    style_note: getNestedValue(product, ['productDescriptors', 'style_note', 'value'], 'No style notes available'),
    materials_care_desc: getNestedValue(product, ['productDescriptors', 'materials_care_desc', 'value'], 'No materials and care information available')
  };

  // Get article attributes with fallbacks
  const articleAttributes = {
    Fit: getNestedValue(product, ['articleAttributes', 'Fit'], 'Regular'),
    Occasion: getNestedValue(product, ['articleAttributes', 'Occasion'], 'Casual')
  };

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Product Images and Description */}
          <div>
            {/* Product Images */}
            <motion.div 
              className="relative mb-5"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              {/* Wishlist and Share Buttons */}
              <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                <motion.button
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isWishlist ? 'bg-red-50 text-red-500' : 'bg-white text-gray-600'
                  } shadow-md`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleWishlist}
                >
                  <FaHeart className={isWishlist ? 'fill-current' : ''} />
                </motion.button>
                <motion.button
                  className="w-10 h-10 bg-white text-gray-600 rounded-full flex items-center justify-center shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={shareProduct}
                >
                  <FaShare />
                </motion.button>
              </div>

              {/* Main Image */}
              <motion.div 
                className="rounded-xl overflow-hidden bg-white"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img 
                  src={productImages[activeImage] || ''} 
                  alt={product.productDisplayName} 
                  className="w-full h-[500px] object-contain"
                />
              </motion.div>

              {/* Thumbnails */}
              <div className="flex gap-2 justify-center">
                {productImages.map((img, index) => (
                  <motion.div 
                    key={index}
                    className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                      activeImage === index ? 'border-black' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImage(index)}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img 
                      src={img || ''} 
                      alt={`Product view ${index + 1}`} 
                      className="w-16 h-16 object-cover"
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Product Description */}
            <motion.div 
              variants={fadeIn}
              className="bg-white rounded-xl p-6 pt-0 border border-gray-100"
            >
              <h3 className="text-xl font-bold mb-4">Product Description</h3>
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: productDescriptors.description }} />
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: productDescriptors.style_note }} />
              </div>
            </motion.div>
          </div>

          {/* Right Column - Product Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="flex flex-col"
          >
            <motion.div variants={fadeIn} className="mb-4">
              <h2 className="text-sm text-gray-500">{product.brandName}</h2>
              <h1 className="text-2xl font-bold tracking-tight mt-1">
                {product.productDisplayName}
              </h1>
            </motion.div>

            <motion.div variants={fadeIn} className="flex items-center mb-4">
              <div className="flex mr-2">
                {renderStarRating(product.myntraRating)}
              </div>
              <span className="text-gray-600 text-sm">({product.myntraRating} rating)</span>
            </motion.div>

            <motion.div variants={fadeIn} className="mb-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold">₹{product.price}</span>
                {product.discountedPrice !== product.price && (
                  <>
                    <span className="ml-3 text-lg text-gray-500 line-through">₹{product.price}</span>
                    <span className="ml-3 bg-red-100 text-red-700 px-2 py-1 rounded text-sm font-medium">
                      {Math.round((1 - product.discountedPrice / product.price) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">inclusive of all taxes</p>
            </motion.div>

            {/* Size Selection */}
            <motion.div variants={fadeIn} className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-base sm:text-lg">Select Size</h3>
                <button 
                  className="text-sm text-gray-600 underline"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                >
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-2">
                {sizes.map(size => (
                  <button
                    key={size.value}
                    className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full border text-sm sm:text-base transition-all ${
                      selectedSize === size.value 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => handleSizeSelect(size.value)}
                  >
                    {size.value}
                  </button>
                ))}
              </div>
            </motion.div>


            {/* Quantity */}
            <motion.div variants={fadeIn} className="mb-6">
              <h3 className="font-medium mb-2">Quantity</h3>
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
            <motion.div variants={fadeIn} className="mb-6">
              <div className="flex space-x-4">
                <motion.button
                  className={`w-full bg-black text-white py-3 px-6 rounded-md font-medium flex items-center justify-center ${
                    isTryingOn ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: isTryingOn ? 1 : 1.02 }}
                  whileTap={{ scale: isTryingOn ? 1 : 0.98 }}
                  onClick={handleTryOn}
                  disabled={isTryingOn}
                >
                  <GiTShirt className="mr-2" />
                  Try On
                </motion.button>
                <motion.button
                  className={`w-full bg-black text-white py-3 px-6 rounded-md font-medium flex items-center justify-center ${
                    isAddingToCart ? 'opacity-75 cursor-not-allowed' : ''
                  }`}
                  whileHover={{ scale: isAddingToCart ? 1 : 1.02 }}
                  whileTap={{ scale: isAddingToCart ? 1 : 0.98 }}
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                >
                  <FaShoppingCart className="mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </motion.button>
              </div>
            </motion.div>

            {/* Product Features */}
            <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaTruck className="text-gray-600 mr-3" />
                <div>
                  <h4 className="font-medium">Free Delivery</h4>
                  <p className="text-sm text-gray-500">On orders above ₹999</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaUndo className="text-gray-600 mr-3" />
                <div>
                  <h4 className="font-medium">Easy Returns</h4>
                  <p className="text-sm text-gray-500">30 days return policy</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <FaExchangeAlt className="text-gray-600 mr-3" />
                <div>
                  <h4 className="font-medium">Exchange</h4>
                  <p className="text-sm text-gray-500">Try & Buy available</p>
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div variants={fadeIn} className="border-t border-gray-200 pt-6">
              <h3 className="font-medium mb-4">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Article Number</p>
                  <p>{product.articleNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Category</p>
                  <p>{product.displayCategories}</p>
                </div>
                <div>
                  <p className="text-gray-500">Material</p>
                  <p dangerouslySetInnerHTML={{ __html: productDescriptors.materials_care_desc }} />
                </div>
                <div>
                  <p className="text-gray-500">Fit</p>
                  <p>{articleAttributes.Fit}</p>
                </div>
                <div>
                  <p className="text-gray-500">Occasion</p>
                  <p>{articleAttributes.Occasion}</p>
                </div>
                <div>
                  <p className="text-gray-500">Season</p>
                  <p>{product.season}</p>
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
          className="mb-8 p-6"
        >
          <motion.h2 
            variants={fadeIn}
            className="text-2xl font-bold mb-2"
          >
            Recommended Products
          </motion.h2>
          
          {isLoadingRecommendations ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
          ) : recommendedProducts.length > 0 ? (
            <motion.div
              className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
                {recommendedProducts.map((product) => (
                  <motion.div
                    variants={fadeIn}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col h-[420px] group relative overflow-hidden border border-gray-100"
                >
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-10">
                      -{product.discount}%
                    </div>
                  )}
                  {/* Product Image */}
                  <div className="relative h-56 w-full overflow-hidden flex items-center justify-center bg-gray-50">
                      <img
                        src={product.image}
                        alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 rounded-t-xl"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x400?text=Image+Not+Found';
                        }}
                      />
                        </div>
                  {/* Product Info */}
                    <div className="flex-1 flex flex-col p-4">
                    <h3 className="font-semibold text-base line-clamp-2 mb-1 text-gray-900 group-hover:text-blue-700 transition-colors">{product.name}</h3>
                    {/* Rating and reviews */}
                    <div className="flex items-center mt-1 mb-2">
                        <div className="flex text-xs text-yellow-400">
                          {renderStarRating(product.rating)}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                      </div>
                    {/* Price */}
                    <div className="mt-1 flex items-center">
                      <span className="font-bold text-lg text-black">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    {/* Color Swatches */}
                      <div className="mt-3 flex space-x-1">
                        {product.colors.map((color, i) => (
                          <div
                            key={i}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color }}
                          ></div>
                        ))}
                      </div>
                    {/* View Details Button */}
                      <Link
                        to={`/product/${product.id}`}
                      className="mt-auto w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm font-medium transition-colors block text-center shadow-sm group-hover:bg-blue-200 group-hover:text-blue-900"
                      >
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
            </motion.div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No recommendations available at the moment
            </div>
          )}
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

        {/* Size Guide Modal */}
        <AnimatePresence>
          {showSizeGuide && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowSizeGuide(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-2xl w-full"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold mb-4">Size Guide</h3>
                {product.size_representation && (
                  <img 
                    src={product.size_representation} 
                    alt="Size Guide" 
                    className="w-full rounded-lg"
                  />
                )}
                <button
                  className="mt-4 w-full py-2 bg-black text-white rounded-md"
                  onClick={() => setShowSizeGuide(false)}
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Try On Dialog */}
        <TryOnDialog
          isOpen={showTryOn}
          onClose={closeTryOn}
          productImage={productImages[activeImage] || ''}
          productName={product.productDisplayName || ''}
          onAddToCart={handleAddToCart}
          price={product.price || 0}
        />
      </div>
    </div>
  );
};

const ProductDetail: React.FC = () => {
  return (
    <ErrorBoundary>
      <ProductDetailContent />
    </ErrorBoundary>
  );
};

export default ProductDetail;