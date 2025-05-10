import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FaTimes, FaCamera, FaSpinner, FaShoppingCart } from 'react-icons/fa';

interface TryOnDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productImage: string;
  productName: string;
  onAddToCart: () => void;
  price: number;
}

const TryOnDialog: React.FC<TryOnDialogProps> = ({
  isOpen,
  onClose,
  productImage,
  productName,
  onAddToCart,
  price,
}) => {
  const [personImage, setPersonImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [tryOnResult, setTryOnResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('Upper body');
  const [lastErrorTime, setLastErrorTime] = useState<number>(0);

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

  // Process try-on with retry logic
  const processTryOn = async () => {
    if (!personImage) {
      setError('Please upload your photo first');
      return;
    }

    // Check if we're still in the rate limit window
    const now = Date.now();
    if (lastErrorTime > 0 && now - lastErrorTime < 60000) { // 1 minute cooldown
      const secondsLeft = Math.ceil((60000 - (now - lastErrorTime)) / 1000);
      setError(`Please wait ${secondsLeft} seconds before trying again. The API has rate limits.`);
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Convert person image to base64
      const personImageBase64 = personImage.split(',')[1];
      
      // Get product image
      const productImageResponse = await fetch(productImage);
      const productImageBlob = await productImageResponse.blob();
      const productImageBase64 = await fileToBase64(new File([productImageBlob], 'product.jpg'));

      // API call to Segmind with retry logic
      const makeApiCall = async (retryCount: number) => {
        try {
          const response = await axios.post(
            import.meta.env.VITE_SEGMIND_API_ENDPOINT || 'https://api.segmind.com/v1/try-on-diffusion',
            {
              model_image: personImageBase64,
              cloth_image: productImageBase64,
              category: selectedCategory,
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
            setRetryCount(0); // Reset retry count on success
            setLastErrorTime(0); // Reset error time on success
          } else {
            throw new Error('Invalid response from API');
          }
        } catch (err: any) {
          if (err.response?.status === 429) {
            setLastErrorTime(Date.now());
            if (retryCount < 3) {
              // Wait for 2 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
              return makeApiCall(retryCount + 1);
            }
            throw new Error('Rate limit exceeded. Please wait a minute before trying again.');
          }
          throw err;
        }
      };

      await makeApiCall(retryCount);
    } catch (err: any) {
      console.error('API Error:', err);
      if (err.response?.status === 429) {
        setError('The API is currently busy. Please wait a minute before trying again.');
      } else {
        setError(err.message || 'Failed to perform virtual try-on. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle add to cart
  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      await onAddToCart();
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Reset try-on
  const resetTryOn = () => {
    setPersonImage(null);
    setTryOnResult(null);
    setError(null);
    setRetryCount(0);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold">Virtual Try-On</h3>
                {/* <p className="text-gray-500 mt-1">Try on {productName}</p> */}
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Image */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="font-medium mb-3">Product Image</h4>
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
                    <img 
                      src={productImage} 
                      alt={productName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-lg font-bold">₹{price}</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Upload and Preview */}
              <div className="space-y-6">
                {!personImage ? (
                  <div className="border-2 aspect-square border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition-colors">
                    <FaCamera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium mb-2">Upload Your Photo</h4>
                    <p className="text-gray-500 mb-4">Take a clear, front-facing photo for best results</p>
                    <label className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium cursor-pointer hover:bg-gray-800 transition-colors">
                      Choose Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePersonUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4 bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium">Uploaded Image</h4>
                    <div className="relative aspect-square rounded-xl overflow-hidden bg-white">
                      <img 
                        src={personImage} 
                        alt="Your photo" 
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={resetTryOn}
                        className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
                      >
                        <FaTimes className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                      <h4 className="font-medium">Select Category</h4>
                      <div className="flex flex-col space-y-2">
                        {['Upper body', 'Lower body', 'Dress'].map((category) => (
                          <label key={category} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="category"
                              value={category}
                              checked={selectedCategory === category}
                              onChange={(e) => setSelectedCategory(e.target.value)}
                              className="form-radio h-4 w-4 text-black border-gray-300 focus:ring-black"
                            />
                            <span className="text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={processTryOn}
                      disabled={isProcessing}
                      className="w-1/2 mx-auto bg-black text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Processing...
                        </>
                      ) : (
                        'Try It On'
                      )}
                    </button>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-700 rounded-lg text-center font-medium border-2 border-red-200"
                  >
                    <p className="mb-2">{error}</p>
                    {error.includes('wait') && (
                      <p className="text-sm text-red-600">
                        This is due to API rate limiting. We'll automatically retry up to 3 times.
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Result Section - Full Width Below */}
              {tryOnResult && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-1 lg:col-span-2 bg-gray-50 rounded-xl p-4 mt-8"
                >
                  <h4 className="text-lg font-medium mb-4 text-center">Try-On Result</h4>
                  <div className="relative rounded-xl overflow-hidden max-w-md mx-auto">
                    <img 
                      src={tryOnResult} 
                      alt="Try-on result" 
                      className="w-full aspect-square object-contain"
                    />
                  </div>
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-1/4  mx-auto mt-4 bg-black text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {isAddingToCart ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Adding to Cart...
                      </>
                    ) : (
                      <>
                        <FaShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart - ₹{price}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TryOnDialog; 