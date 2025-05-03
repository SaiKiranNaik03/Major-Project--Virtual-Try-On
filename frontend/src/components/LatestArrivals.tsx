import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const latestProducts = [
  {
    id: 1,
    name: 'Vintage Denim Jacket',
    price: 150,
    originalPrice: 180,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3',
  },
  {
    id: 2,
    name: 'Classic Leather Boots',
    price: 200,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3',
  },
  {
    id: 3,
    name: 'Stylish Sunglasses',
    price: 80,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?ixlib=rb-4.0.3',
  },
  {
    id: 4,
    name: 'Casual Weekend Shirt',
    price: 120,
    originalPrice: 150,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3',
  }
];

const LatestArrivals = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold mb-4">LATEST ARRIVALS</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {latestProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-80 object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                />
                {product.originalPrice && (
                  <div className="absolute top-1 right-1 bg-black text-white px-2 py-1 rounded-full text-sm">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>
              
              <div className="mt-4 space-y-2">
                <h3 className="text-lg font-medium">{product.name}</h3>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="text-gray-500 text-sm">({product.rating})</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold">Rs.{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-gray-500 line-through">Rs.{product.originalPrice}</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <button className="text-gray-600 font-medium hover:text-black transition-colors">
            View All
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default LatestArrivals;