import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon, HeartIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update cart count when cart changes
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart);
          if (Array.isArray(cartItems)) {
            const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
            setCartCount(totalItems);
          }
        } catch (error) {
          console.error('Error parsing cart:', error);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };

    // Initial update
    updateCartCount();

    // Listen for custom cart update event
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full bg-white shadow-md z-50  ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <motion.h1 whileHover={{ scale: 1.02 }}>
              <Link to="/">
                <h1 className="text-3xl md:text-4xl font-semibold font-['Great_Vibes'] tracking-wide">
                  Snapkart
                </h1>
                {/* <img src="logo.png" alt="Snapkart" style={{ width: '190px', height: '60px' }}/> */}
              </Link>
            </motion.h1>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/men">Men</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/women">WoMen</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/sale">On Sale</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/new-arrivals">New Arrivals</motion.a>
            <motion.div whileHover={{ scale: 1.05 }} className="relative text-black-500 font-medium">
              <Link to="/try-on" className="relative">
                Try-On
                <span className="absolute -top-2 -right-5 text-[10px] bg-black text-white px-1 py-0.4 rounded-full">
                  NEW
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Desktop Search Input */}
            <div className="relative hidden md:flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            
            {/* Mobile Search Icon */}
            <motion.div whileHover={{ scale: 1.1 }} className="md:hidden cursor-pointer">
              <MagnifyingGlassIcon className="h-5 w-5 md:h-6 md:w-6" />
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <Link to="/Wishlist"><HeartIcon className="h-5 w-5 md:h-6 md:w-6" /></Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <Link to="/Profile"><UserIcon className="h-5 w-5 md:h-6 md:w-6" /></Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer relative">
              <Link to="/Cart">
                <ShoppingCartIcon className="h-5 w-5 md:h-6 md:w-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-[12px] rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="md:hidden cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <XMarkIcon className="h- w-6 md:h-6 md:w-6" /> : <Bars3Icon className="h-6 w-6 md:h-6 md:w-6" />}
            </motion.button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-20 right-0 w-64 bg-white shadow-lg z-50 p-4"
          >
            <div className="flex flex-col space-y-4">
              <Link to="/men" className="hover:text-gray-600">Men</Link>
              <Link to="/women" className="hover:text-gray-600">WoMen</Link>
              <Link to="/sale" className="hover:text-gray-600">On Sale</Link>
              <Link to="/new-arrivals" className="hover:text-gray-600">New Arrivals</Link>
              <Link to="/try-on" className="hover:text-gray-600">Try-On</Link>
            </div>
          </motion.div>

        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;