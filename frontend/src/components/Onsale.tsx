import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa';
import api from '../config/axios';

interface Product {
  id: number;
  price: number;
  discountedPrice: number;
  productDisplayName: string;
  brandName: string;
  baseColour: string;
  styleImages: {
    default: {
      imageURL: string;
    };
  };
  rating: number;
}

const Onsale = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [wishlist, setWishlist] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaleProducts = async () => {
      try {
        // Fetch the latest 4 products and mark them as on sale
        const response = await api.get('/products/latest', {
          params: {
            limit: 4
          }
        });
        
        // Add a discount to the products to show them as on sale
        const saleProducts = response.data.data.map((product: Product) => ({
          ...product,
          discountedPrice: Math.round(product.price * 0.8), // 20% discount
        }));
        
        setProducts(saleProducts);
      } catch (error) {
        console.error('Error fetching sale products:', error);
        // Fallback to sample data if API fails
        setProducts([
          {
            id: 1,
            price: 150,
            discountedPrice: 120,
            productDisplayName: 'Vintage Denim Jacket',
            brandName: 'Levi\'s',
            baseColour: 'Blue',
            styleImages: {
              default: {
                imageURL: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?ixlib=rb-4.0.3'
              }
            },
            rating: 4.5
          },
          {
            id: 2,
            price: 200,
            discountedPrice: 160,
            productDisplayName: 'Classic Leather Boots',
            brandName: 'Dr. Martens',
            baseColour: 'Brown',
            styleImages: {
              default: {
                imageURL: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3'
              }
            },
            rating: 4.5
          },
          {
            id: 3,
            price: 80,
            discountedPrice: 64,
            productDisplayName: 'Stylish Sunglasses',
            brandName: 'Ray-Ban',
            baseColour: 'Black',
            styleImages: {
              default: {
                imageURL: 'https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?ixlib=rb-4.0.3'
              }
            },
            rating: 4.5
          },
          {
            id: 4,
            price: 120,
            discountedPrice: 96,
            productDisplayName: 'Casual Weekend Shirt',
            brandName: 'Tommy Hilfiger',
            baseColour: 'White',
            styleImages: {
              default: {
                imageURL: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3'
              }
            },
            rating: 4.5
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSaleProducts();
  }, []);

  const toggleWishlist = (productId: number) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id: number) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const renderStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="w-4 h-4 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="w-4 h-4 text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="w-4 h-4 text-yellow-400" />);
      }
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            ON SALE
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Grab these amazing deals before they're gone
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Link to={`/product/${product.id}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.styleImages.default.imageURL}
                      alt={product.productDisplayName}
                      className="w-full h-80 object-cover object-center transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3">
                      <div className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] animate-pulse">
                        SALE{product.discountedPrice < product.price && (
                      <div className="">
                        {Math.round(((product.price - product.discountedPrice) / product.price) * 100)}%
                      </div>
                    )}
                      </div>
                    </div>
                    
                    <div className="absolute top-3 right-3">
                      <button 
                        className="bg-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product.id);
                        }}
                      >
                        <FaHeart className={`h-5 w-5 ${wishlist.includes(product.id) ? 'text-red-500' : 'text-gray-400'}`} />
                      </button>
                    </div>
                  </div>
                </Link>
                
                <div className="p-5">
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">{product.brandName}</span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{product.baseColour}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{product.productDisplayName}</h3>
                    <div className="flex items-center space-x-1 mb-3">
                      {renderStarRating(product.rating || 4.5)}
                      <span className="text-gray-500 text-sm">({product.rating || 4.5})</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">₹{product.discountedPrice}</span>
                      {product.discountedPrice < product.price && (
                        <span className="text-gray-500 line-through">₹{product.price}</span>
                      )}
                    </div>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <Link 
            to="/sale"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Sale Items
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Onsale;