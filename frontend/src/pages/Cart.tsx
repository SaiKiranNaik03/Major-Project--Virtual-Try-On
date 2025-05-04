import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import { 
  FaChevronRight, 
  FaTrashAlt, 
  FaMinus, 
  FaPlus, 
  FaLongArrowAltRight 
} from 'react-icons/fa';

// Sample cart data - this would normally come from your global state or API
const initialCartItems = [
  {
    id: 1,
    name: 'Gradient Graphic T-shirt',
    price: 120,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    color: 'Black',
    size: 'M',
    quantity: 1
  },
  {
    id: 3,
    name: 'Women\'s Floral Dress',
    price: 135,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    color: 'Pink',
    size: 'S',
    quantity: 1
  },
  {
    id: 5,
    name: 'Modern Minimalist Shirt',
    price: 125,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
    color: 'White',
    size: 'L',
    quantity: 2
  }
];

// Delivery fee
const DELIVERY_FEE = 15;

// Discount percentage
const DISCOUNT_PERCENTAGE = 20;

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isRemoving, setIsRemoving] = useState<{[key: number]: boolean}>({});

  // Calculate cart totals
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = promoApplied ? (subtotal * DISCOUNT_PERCENTAGE / 100) : 0;
  const total = subtotal - discount + DELIVERY_FEE;

  // Update quantity
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove item from cart
  const removeFromCart = (id: number) => {
    setIsRemoving({...isRemoving, [id]: true});
    
    // Delay actual removal to allow animation to complete
    setTimeout(() => {
      setCartItems(cartItems.filter(item => item.id !== id));
      setIsRemoving({...isRemoving, [id]: false});
    }, 300);
  };

  // Apply promo code
  const applyPromoCode = () => {
    // In a real app, you would validate the promo code with your backend
    if (promoCode.toLowerCase() === 'discount20') {
      setPromoApplied(true);
      alert('Promo code applied successfully!');
    } else {
      alert('Invalid promo code');
    }
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

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex py-4 text-sm text-gray-500">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <FaChevronRight className="mx-2 mt-1" />
          <span className="text-black font-medium">Cart</span>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">YOUR CART</h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center">
            <div className="flex justify-center mb-4">
              <svg className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link 
              to="/" 
              className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
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
                        key={item.id}
                        variants={fadeIn}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        layout
                        className="bg-white rounded-xl p-4 shadow-sm"
                      >
                        <div className="flex items-center">
                          {/* Product Image */}
                          <div className="w-20 h-20 flex-shrink-0 rounded-md overflow-hidden">
                            <img 
                              src={item.image} 
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Product Details */}
                          <div className="ml-4 flex-1">
                            <h3 className="font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">
                              Size: {item.size} | Color: {item.color}
                            </p>
                            <div className="mt-1 font-bold">${item.price}</div>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button 
                              className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus className="h-3 w-3" />
                            </button>
                            <span className="px-3 py-1 text-gray-900 font-medium">{item.quantity}</span>
                            <button 
                              className="px-2 py-1 text-gray-500 hover:text-black transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <FaPlus className="h-3 w-3" />
                            </button>
                          </div>
                          
                          {/* Delete Button */}
                          <button 
                            className="ml-4 text-black-500 hover:text-red-600 transition-colors"
                            onClick={() => removeFromCart(item.id)}
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
            <div className="lg:w-100">
              <motion.div 
                className="bg-white rounded-xl p-6 shadow-sm sticky top-24"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between">
                      <span className="text-red-500">Discount ({DISCOUNT_PERCENTAGE}%)</span>
                      <span className="text-red-500">-${discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-medium">${DELIVERY_FEE.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">${total.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Promo Code Input */}
                <div className="mb-6">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add promo code"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <button 
                      className="bg-black text-white px-4 py-2 rounded-r-md font-medium hover:bg-gray-800 transition-colors"
                      onClick={applyPromoCode}
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <p className="text-green-600 text-sm mt-1">Promo code applied!</p>
                  )}
                </div>
                
                {/* Checkout Button */}
                <motion.button 
                  className="w-full bg-black text-white py-3 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Go to Checkout</span>
                  <FaLongArrowAltRight className="ml-2" />
                </motion.button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;