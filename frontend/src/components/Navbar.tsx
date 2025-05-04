import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCartIcon, UserIcon, MagnifyingGlassIcon, HeartIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect
  useState(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full bg-white  z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <motion.h1 
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold"
            >
            <Link to="/">
                Snapkart
            </Link>
              
            </motion.h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/men">Men</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/women">WoMen</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/sale">On Sale</motion.a>
            <motion.a whileHover={{ scale: 1.05 }} className="hover:text-gray-600" href="/new-arrivals">New Arrivals</motion.a>

            <motion.a
                whileHover={{ scale: 1.05 }}
                className="relative text-black-500 font-medium"
            >
              <Link to="/try-on">
                Try-On
                <span className="absolute -top-2 -right-5 text-[10px] bg-black text-white px-1 py-0.4 rounded-full">
                  NEW
                </span>
              </Link>
            </motion.a>
  
        </div>


          <div className="flex items-center space-x-6">
            <div className="relative flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search for products..."
                className="pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              />
            </div>
            
            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <Link to="/Wishlist"><HeartIcon className="h-6 w-6" /></Link>
            </motion.div>

            
            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <Link to="/Profile"><UserIcon className="h-6 w-6" /></Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
              <Link to="/Cart"><ShoppingCartIcon className="h-6 w-6" /></Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;