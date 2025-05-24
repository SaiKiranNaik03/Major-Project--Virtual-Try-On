import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CartSkeleton } from '../components/Skeletons';

// Icons
import { 
  FaChevronRight, 
  FaTrashAlt, 
  FaMinus, 
  FaPlus, 
  FaLongArrowAltRight,
  FaShoppingBag,
  FaTag,
  FaTruck,
  FaLock
} from 'react-icons/fa';

interface CartItem {
  id: number;
  name: string;
  price: number;
  discountedPrice: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  brand: string;
}

// Delivery fee
const DELIVERY_FEE = 15;

// Discount percentage
const DISCOUNT_PERCENTAGE = 20;

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isRemoving, setIsRemoving] = useState<{[key: number]: boolean}>({});
  const [isLoading, setIsLoading] = useState(true);

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const items = JSON.parse(savedCart);
        if (Array.isArray(items)) {
          setCartItems(items);
        }
      } catch (error) {
        console.error('Error parsing cart:', error);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.discountedPrice * item.quantity), 0);
  const discount = promoApplied ? (subtotal * DISCOUNT_PERCENTAGE / 100) : 0;
  const total = subtotal - discount + DELIVERY_FEE;

  // Update quantity
  const updateQuantity = (id: number, size: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    const updatedItems = cartItems.map(item => 
      (item.id === id && item.size === size) ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
    
    toast.success(`Quantity updated to ${newQuantity}`, {
      icon: '🔄',
      duration: 2000,
    });
  };

  // Remove item from cart
  const removeFromCart = (id: number, size: string) => {
    setIsRemoving({...isRemoving, [id]: true});
    
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      const updatedItems = cartItems.filter(item => !(item.id === id && item.size === size));
      setCartItems(updatedItems);
      localStorage.setItem('cart', JSON.stringify(updatedItems));
      setIsRemoving({...isRemoving, [id]: false});
      
      // Dispatch custom event for cart update
      window.dispatchEvent(new Event('cartUpdated'));
      
      toast.success('Item removed from cart', {
        icon: '🗑️',
        duration: 2000,
      });
    }, 300);
  };

  // Apply promo code
  const applyPromoCode = () => {
    // In a real app, you would validate the promo code with your backend
    if (promoCode.toLowerCase() === 'discount20') {
      setPromoApplied(true);
      toast.success('Promo code applied successfully!', {
        icon: '🎉',
        duration: 3000,
      });
    } else {
      toast.error('Invalid promo code', {
        icon: '❌',
        duration: 3000,
      });
    }
  };

  // Enhanced animation variants
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
    },
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
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

  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <span className="text-black font-medium">Cart</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">Review your items and proceed to checkout</p>
        </div>

        {cartItems.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-12 shadow-sm text-center border border-gray-100"
          >
            <div className="flex justify-center mb-4">
              <FaShoppingBag className="h-16 w-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Cart Items */}
            <div className="flex-1">
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
              >
                <AnimatePresence>
                  {cartItems.map((item) => (
                    !isRemoving[item.id] && (
                      <motion.div
                        key={`${item.id}-${item.size}`}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        whileHover="hover"
                        layout
                        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                      >
                        <div className="flex items-center">
                          {/* Product Image */}
                          <Link to={`/product/${item.id}`} className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </Link>
                          
                          {/* Product Details */}
                          <Link to={`/product/${item.id}`} className="ml-6 flex-1">
                            <h3 className="font-medium text-lg text-gray-900 mb-1 hover:text-gray-700 transition-colors">{item.name}</h3>
                            <p className="text-sm text-gray-500 mb-1">{item.brand}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center">
                                <span 
                                  className="w-4 h-4 rounded-full border border-gray-200 mr-2"
                                  style={{ backgroundColor: item.color.toLowerCase() }}
                                ></span>
                                {item.color}
                              </span>
                              <span>Size: {item.size}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-gray-900">₹{item.discountedPrice}</span>
                              {item.discountedPrice < item.price && (
                                <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
                              )}
                            </div>
                          </Link>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                            <button 
                              className="px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="h-3 w-3" />
                            </button>
                            <span className="px-4 py-2 text-gray-900 font-medium border-x border-gray-200">{item.quantity}</span>
                            <button 
                              className="px-3 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors"
                              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            >
                              <FaPlus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Delete Button */}
                          <button 
                            className="ml-6 text-gray-400 hover:text-red-500 transition-colors"
                            onClick={() => removeFromCart(item.id, item.size)}
                            aria-label="Remove item"
                          >
                            <FaTrashAlt className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="lg:w-96">
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between items-center">
                      <span className="text-green-600 flex items-center">
                        <FaTag className="mr-2" />
                        Discount ({DISCOUNT_PERCENTAGE}%)
                      </span>
                      <span className="text-green-600">-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 flex items-center">
                      <FaTruck className="mr-2" />
                      Delivery Fee
                    </span>
                    <span className="font-medium text-gray-900">₹{DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">₹{total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Promo Code Input */}
                <div className="mb-6">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add promo code"
                      className="flex-1 border border-gray-200 rounded-l-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      className="bg-black text-white px-6 py-3 rounded-r-lg font-medium hover:bg-gray-800 transition-colors"
                      onClick={applyPromoCode}
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-2 flex items-center">
                      <FaTag className="mr-1" /> Promo code applied successfully!
                    </p>
                  )}
                </div>
                
                {/* Checkout Button */}
                <motion.button 
                  className="w-full bg-black text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaLock className="mr-2" />
                  <span>Proceed to Checkout</span>
                  <FaLongArrowAltRight className="ml-2" />
                </motion.button>

                {/* Security Notice */}
                <p className="text-center text-sm text-gray-500 mt-4 flex items-center justify-center">
                  <FaLock className="mr-2 h-3 w-3" />
                  Secure Checkout
                </p>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;