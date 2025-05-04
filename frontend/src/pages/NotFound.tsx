import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const NotFound = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  // const [, setCount] = useState(0);

  // Handle mouse movement for interactive effect
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    setPosition({ x: moveX / 25, y: moveY / 25 });
  };

  // Easter egg counter
  // const incrementCount = () => {
  //   setCount(prev => {
  //     const newCount = prev + 1;
  //     if (newCount === 10) {
  //       alert("You found the easter egg! You're really persistent!");
  //     }
  //     return newCount;
  //   });
  // };

  // Random clothing items that are "lost"
  const lostItems = [
    "sock", "hat", "pant", "scarf", "shoe", "shirt", "jacket", "tie"
  ];

  // Shuffle and get 3 random items
  const [randomItems, setRandomItems] = useState<string[]>([]);
  
  useEffect(() => {
    const shuffled = [...lostItems].sort(() => 0.5 - Math.random());
    setRandomItems(shuffled.slice(0, 7));
  }, []);

  return (
    <div 
      className="min-h-screen bg-white flex items-center justify-center px-4"
      onMouseMove={handleMouseMove}
    >
      <div className="max-w-4xl w-full text-center">
        {/* <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        > */}
          <motion.div 
            animate={{ 
              x: position.x, 
              y: position.y,
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{ 
              x: { type: "spring", stiffness: 100 },
              y: { type: "spring", stiffness: 100 },
              rotate: { duration: 5, repeat: Infinity }
            }}
            className="relative z-10"
          >
            <h1 
              className="text-9xl font-extrabold text-black opacity-90 mb-8 cursor-pointer"
            >
              404
            </h1>
          </motion.div>
          
          {/* Floating clothing items
          {randomItems.map((item, index) => (
            <motion.div
              key={index}
              className="absolute text-black text-opacity-50 text-6xl font-bold"
              initial={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 400 - 200,
                opacity: 0.1
              }}
              animate={{ 
                x: Math.random() * 400 - 200, 
                y: Math.random() * 400 - 200,
                opacity: [0.1, 0.2, 0.1],
                rotate: Math.random() * 360
              }}
              transition={{ 
                duration: 30 + Math.random() * 15, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              {item}
            </motion.div>
          ))}
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
            PAGE NOT FOUND
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Just like that one {randomItems[0]} you can never find, this page seems to have 
            disappeared from our collection. Let's get you back to our latest styles.
          </p>

          <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/" 
                className="inline-block px-8 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
              >
                Back to Homepage
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link 
                to="/new-arrivals" 
                className="inline-block px-8 py-4 bg-transparent border-2 border-black text-black font-bold hover:bg-black hover:text-white transition-colors"
              >
                Browse New Arrivals
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;