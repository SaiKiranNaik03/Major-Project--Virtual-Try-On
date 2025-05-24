import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface TryOnResult {
  imageUrl: string;
}

interface PreviewImage {
  file: File;
  preview: string;
}

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

interface VirtualTryOnProps {
  productImage: string;
  productName: string;
  onClose: () => void;
}

const VirtualTryOn: React.FC<VirtualTryOnProps> = ({ productImage, productName, onClose }) => {
  const [clothingImage, setClothingImage] = useState<PreviewImage | null>(null);
  const [personImage, setPersonImage] = useState<PreviewImage | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'result'>('upload');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [category, setCategory] = useState<string>('upper_body');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      name: "Shashank Reddy",
      rating: 5,
      comment: "Amazing experience! The virtual try-on was incredibly accurate and helped me make a confident purchase.",
      date: "2024-03-15"
    },
    {
      id: 2,
      name: "Sharath Chandra",
      rating: 4,
      comment: "Great tool for online shopping. The AI did a good job matching the clothes to my body type.",
      date: "2024-03-14"
    }
  ]);
  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: ''
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentApiKeyIndex, setCurrentApiKeyIndex] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);

  const clothingInputRef = useRef<HTMLInputElement>(null);
  const personInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Array of API keys
  const apiKeys = [
    import.meta.env.VITE_SEGMIND_API_KEY1,
    import.meta.env.VITE_SEGMIND_API_KEY2,
    import.meta.env.VITE_SEGMIND_API_KEY3,
  ];

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (clothingImage) URL.revokeObjectURL(clothingImage.preview);
      if (personImage) URL.revokeObjectURL(personImage.preview);
      if (tryOnResult) URL.revokeObjectURL(tryOnResult.imageUrl);
    };
  }, []);

  // Update the clothing image when productImage prop changes
  useEffect(() => {
    if (productImage) {
      // Convert the product image URL to a File object
      fetch(productImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'product-image.jpg', { type: 'image/jpeg' });
          const preview = URL.createObjectURL(file);
          setClothingImage({ file, preview });
        })
        .catch(err => {
          console.error('Error loading product image:', err);
          setError('Failed to load product image');
        });
    }
  }, [productImage]);

  const handleClothingUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setClothingImage({ file, preview });
    }
  };

  const handlePersonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const preview = URL.createObjectURL(file);
      setPersonImage({ file, preview });
    }
  };

  // Function to convert image file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          // Remove the data:image/jpeg;base64, part
          const base64String = reader.result.split(',')[1];
          resolve(base64String);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = error => reject(error);
    });
  };

  const performVirtualTryOn = async () => {
    if (!clothingImage || !personImage) {
      setError('Please upload both clothing and person images');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert images to base64
      const clothImageBase64 = await fileToBase64(clothingImage.file);
      const modelImageBase64 = await fileToBase64(personImage.file);

      // API call to Segmind with retry logic
      const makeApiCall = async (retryCount: number, apiKeyIndex: number) => {
        try {
          console.log(`Making API call with key index: ${apiKeyIndex}`);
          const response = await axios.post(
            import.meta.env.VITE_SEGMIND_API_ENDPOINT || 'https://api.segmind.com/v1/try-on-diffusion',
            {
              model_image: modelImageBase64,
              cloth_image: clothImageBase64,
              category: category === 'upper_body' ? 'Upper body' : category === 'lower_body' ? 'Lower body' : 'Dress',
              num_inference_steps: 35,
              guidance_scale: 2,
              seed: 50000,
              base64: true
            },
            {
              headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKeys[apiKeyIndex],
              },
            }
          );

          if (response.data && response.data.image) {
            const imageUrl = `data:image/jpeg;base64,${response.data.image}`;
            setTryOnResult({ imageUrl });
            setActiveTab('result');
            setRetryCount(0); // Reset retry count on success
            setCurrentApiKeyIndex(apiKeyIndex); // Update current API key index
            
            // Scroll to result if on mobile
            if (window.innerWidth < 768) {
              resultRef.current?.scrollIntoView({ behavior: 'smooth' });
            }
          } else {
            throw new Error('Invalid response from API');
          }
        } catch (err: any) {
          if (err.response?.status === 429) {
            if (retryCount < 3) {
              // Calculate next API key index
              const nextApiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
              console.log(`Rate limit hit, switching from key ${apiKeyIndex} to key ${nextApiKeyIndex}`);
              
              // Wait for 2 seconds before retrying
              await new Promise(resolve => setTimeout(resolve, 2000));
              return makeApiCall(retryCount + 1, nextApiKeyIndex);
            }
            throw new Error('Please try again later.');
          }
          throw err;
        }
      };

      // Start with the current API key index
      await makeApiCall(retryCount, currentApiKeyIndex);
    } catch (err: any) {
      console.error('API Error:', err);
      if (err.response?.status === 429) {
        setError('Please try again later.');
      } else {
        setError(err.response?.data?.message || 'Failed to perform virtual try-on. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetTryOn = () => {
    if (clothingImage) URL.revokeObjectURL(clothingImage.preview);
    if (personImage) URL.revokeObjectURL(personImage.preview);
    if (tryOnResult) URL.revokeObjectURL(tryOnResult.imageUrl);
    
    setClothingImage(null);
    setPersonImage(null);
    setTryOnResult(null);
    setActiveTab('upload');
    setAnimationComplete(false);
    
    if (clothingInputRef.current) clothingInputRef.current.value = '';
    if (personInputRef.current) personInputRef.current.value = '';
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const resultVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 100,
        onComplete: () => setAnimationComplete(true)
      }
    }
  };

  const shimmerVariants = {
    hidden: { x: "-100%" },
    visible: { 
      x: "100%", 
      transition: { 
        repeat: Infinity, 
        duration: 1.5,
        ease: "linear"
      }
    }
  };

  const handleFaqToggle = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const review: Review = {
      id: reviews.length + 1,
      ...newReview,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews([review, ...reviews]);
    setNewReview({ name: '', rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-6 pt-32">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        {/* <motion.div variants={itemVariants} className="text-center mb-16">
          <h1 className="text-6xl font-bold leading-tight mb-6">
           Virtual Try-On Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
          Skip the guesswork! Try on outfits virtually and find your perfect fit before you checkout.
          </p>
        </motion.div> */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4">
            Virtual Try-On Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Skip the guesswork! Try on outfits virtually and find your perfect fit before you checkout.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10 md:gap-12">
          {/* Upload Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
            <div className="bg-gradient-to-r from-black via-gray-900 to-black px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Upload Your Images</h2>
                <p className="text-gray-300">Select your photo to try on {productName}</p>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Clothing Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clothing Item
                  </label>
                  <div className="relative">
                    {clothingImage ? (
                      <div className="relative group">
                        <img 
                          src={clothingImage.preview} 
                          alt="Clothing preview" 
                          className="w-full h-48 object-contain border rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <button 
                            onClick={() => {
                              if (clothingInputRef.current) clothingInputRef.current.click();
                            }}
                            className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          if (clothingInputRef.current) clothingInputRef.current.click();
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Click to upload clothing item</p>
                        <p className="text-xs text-gray-400 mt-1">Shirts, dresses, jackets, etc.</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={clothingInputRef}
                      accept="image/*"
                      onChange={handleClothingUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                {/* Category Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Clothing Category
                    </label>
                    <div className="space-y-2 space-x-5">
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          value="upper_body"
                          checked={category === 'upper_body'}
                          onChange={(e) => setCategory(e.target.value)}
                          className="text-black focus:ring-black"
                        />
                        <span>Upper Body</span>
                      </label>
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          value="lower_body"
                          checked={category === 'lower_body'}
                          onChange={(e) => setCategory(e.target.value)}
                          className="text-black focus:ring-black"
                        />
                        <span>Lower Body</span>
                      </label>
                      <label className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          value="full_body"
                          checked={category === 'full_body'}
                          onChange={(e) => setCategory(e.target.value)}
                          className="text-black focus:ring-black"
                        />
                        <span>Full Body</span>
                      </label>
                    </div>
                  </div>

                
                {/* Person Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Photo
                  </label>
                  <div className="relative">
                    {personImage ? (
                      <div className="relative group">
                        <img 
                          src={personImage.preview} 
                          alt="Person preview" 
                          className="w-full h-48 object-contain border rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                          <button 
                            onClick={() => {
                              if (personInputRef.current) personInputRef.current.click();
                            }}
                            className="bg-white text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                          >
                            Change
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => {
                          if (personInputRef.current) personInputRef.current.click();
                        }}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-4 h-48 flex flex-col items-center justify-center cursor-pointer hover:border-black transition-colors duration-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="mt-2 text-sm text-gray-500">Click to upload your photo</p>
                        <p className="text-xs text-gray-400 mt-1">Front-facing, well-lit photo recommended</p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={personInputRef}
                      accept="image/*"
                      onChange={handlePersonUpload}
                      className="hidden"
                    />
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-4">
                <motion.button
                    onClick={performVirtualTryOn}
                    disabled={isLoading || !clothingImage || !personImage}
                    className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      'Try It On'
                    )}
                  </motion.button>
                  <motion.button
                    onClick={resetTryOn}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-300"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reset
                  </motion.button>
                </div>
                
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 text-red-700 rounded-xl text-center font-medium border-2 border-red-200"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
              
            </div>
            {/* Tips Section */}
              <motion.div 
                  variants={itemVariants}
                  className="mt-8 bg-white rounded-xl shadow-lg p-5"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Tips for Best Results</h3>
                  <ul className="space-y-2 text-md text-gray-600">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-black mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Use a front-facing photo with good lighting
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-black mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Choose clothing images with clear backgrounds
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-black mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Stand in a neutral pose for the most accurate results
                    </li>
                  </ul>
            </motion.div>
          </motion.div>
          
          {/* Results Section */}
          <motion.div variants={itemVariants}>
            <div className="bg-white rounded-3xl shadow-lg overflow-hidden h-full transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-gradient-to-r from-black via-gray-900 to-black px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Your Virtual Try-On</h2>
                <p className="text-gray-300">See how it looks on you</p>
              </div>

              <div className="p-8">
                <div className=" rounded-2xl border-2 border-gray-200 overflow-hidden min-h-[500px] flex flex-col items-center justify-center relative">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-800 font-medium">Creating your virtual try-on...</p>
                      <p className="text-sm text-gray-600 mt-2">This may take a few moments</p>
                    </div>
                  ) : tryOnResult ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="w-full h-full flex items-center justify-center p-4"
                    >
                      <img
                        src={tryOnResult.imageUrl}
                        alt="Virtual Try-On Result"
                        className="max-w-full max-h-[500px] object-contain rounded-xl shadow-lg"
                      />
                    </motion.div>
                  ) : (
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-800 text-lg font-medium">Your virtual try-on will appear here</p>
                      <p className="text-gray-600 text-sm mt-2">Upload your photos and click "Try It On"</p>
                    </div>
                  )}  
                </div>

                {/* Review Section - Always visible */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-0 bg-white rounded-xl p-6 shadow-lg w-full"
                >
                  <h3 className="text-xl font-bold mb-4">How was your experience?</h3>
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-6 space-y-4 md:space-y-0">
                      <div className="md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                          type="text"
                          value={newReview.name}
                          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                          required
                          disabled={!tryOnResult}
                        />
                      </div>
                      <div className="md:w-1/2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => tryOnResult && setNewReview({ ...newReview, rating: star })}
                              className={`text-2xl ${
                                star <= newReview.rating ? 'text-yellow-500' : 'text-gray-400'
                              } focus:outline-none`}
                              disabled={!tryOnResult}
                            >
                              {star <= newReview.rating ? '★' : '☆'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                      <textarea
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        rows={3}
                        required
                        disabled={!tryOnResult}
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: tryOnResult ? 1.02 : 1 }}
                      whileTap={{ scale: tryOnResult ? 0.98 : 1 }}
                      disabled={!tryOnResult}
                      className={`w-full py-3 px-6 rounded-full font-medium transition-all duration-300 ${
                        tryOnResult
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      Submit Review
                    </motion.button>
                  </form>
                </motion.div>

              </div>
            </div>
          </motion.div>


        </div>
        
        {/* How It Works Section */}
        <motion.div 
            variants={itemVariants}
            className="mt-10 bg-white/80 rounded-3xl shadow-lg p-8"
          >
            <h2 className="text-4xl font-bold text-center text-gray-900 mb-7">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              
              {[  
                {
                  title: "1. Upload Photos",
                  desc: "Upload your photo and select the clothing item you want to try on.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  ),
                },
                {
                  title: "2. AI Processing",
                  desc: "Our advanced AI technology processes your images to create a realistic preview.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  ),
                },
                {
                  title: "3. See Results",
                  desc: "View how the clothing looks on you and make confident purchase decisions.",
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ),
                },
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
                  transition={{ duration: 0.3 }}
                  className="p-6 bg-white/40 border border-gray-200 rounded-2xl shadow-sm text-center hover:border-black "
                >
                  <div className="w-16 h-16 mx-auto mb-5 bg-white shadow-inner rounded-full flex items-center justify-center border border-gray-300">
                    <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      {step.icon}
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 text-md">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

        
        {/* FAQ Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-12"
        >
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-7">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              {
                question: "How accurate is the virtual try-on?",
                answer: "Our AI technology provides a realistic approximation of how clothing will look on you, though exact fit and drape may vary slightly in person."
              },
              {
                question: "What types of clothing can I try on?",
                answer: "Currently, our system works best with tops, dresses, jackets, and outerwear. We're continuously improving to support more clothing types."
              },
              {
                question: "Is my photo data secure?",
                answer: "Yes, we take privacy seriously. Your photos are processed securely and not stored permanently unless you explicitly save your try-on results."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl shadow-md"
              >
                <button
                  onClick={() => handleFaqToggle(index)}
                  className="w-full px-6 py-3 flex items-center justify-between text-left hover:bg-white/30 transition-colors duration-200"
                >
                  <span className="text-lg font-semibold text-gray-800">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: expandedFaq === index ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className={`text-4xl transition-all duration-300 ${
                      expandedFaq === index ? "text-purple-600" : "text-gray-500"
                    }`}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2}}
                      className="px-6 pb-5"
                    >
                      <p className="text-gray-600 text-md">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </motion.div>


        {/* Reviews Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-10 bg-white rounded-3xl  p-12 shadow-lg"
        >
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Customer Reviews</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-md hover:border-black"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-800">{review.name}</h3>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400">
                        {i < review.rating ? '★' : '☆'}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-600 mb-4">{review.comment}</p>
                <p className="text-sm text-gray-400">{review.date}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VirtualTryOn;