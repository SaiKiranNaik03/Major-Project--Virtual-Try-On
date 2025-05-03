import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1 
              className="text-6xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* FIND CLOTHES
              <br />
              THAT MATCHES
              <br />
              YOUR STYLE */}

              Wear It Before 
              <br />
              You Own It.
              <br />
              -Virtually
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 text-lg"
            >
              Step into the future of shopping with our Virtual Try-On feature. Try on garments, mix and match styles, and create your ideal look — all online.
            </motion.p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-black text-[20px] text-white px-10 py-4 rounded-full hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-3 gap-8 pt-8"
            >
              <div>
                <h3 className="text-4xl font-bold">200+</h3>
                <p className="text-gray-600">International Brands</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold">2,000+</h3>
                <p className="text-gray-600">High-Quality Products</p>
              </div>
              <div>
                <h3 className="text-4xl font-bold">30,000+</h3>
                <p className="text-gray-600">Happy Customers</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3"
              alt="Fashion Model"
              className="rounded-lg shadow-2xl"
            />
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-black text-white rounded-full flex items-center justify-center"
            >
              <div className="text-center">
                <div className="text-2xl font-bold">69%</div>
                <div className="text-sm">OFF</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center grayscale">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Versace_Logo.svg/2560px-Versace_Logo.svg.png" alt="Versace" className="h-12" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/2560px-Zara_Logo.svg.png" alt="Zara" className="h-12" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/1960s_Gucci_Logo.svg/2560px-1960s_Gucci_Logo.svg.png" alt="Gucci" className="h-12" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Prada_Logo.svg/2560px-Prada_Logo.svg.png" alt="Prada" className="h-12" />
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Calvin_Klein_logo.svg/2560px-Calvin_Klein_logo.svg.png" alt="Calvin Klein" className="h-12" />
        </div>
      </div>
    </div>
  );
};

export default Hero; 