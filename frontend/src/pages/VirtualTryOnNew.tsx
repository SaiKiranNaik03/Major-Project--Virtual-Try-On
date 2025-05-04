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

const VirtualTryOn: React.FC = () => {
  const [clothingImage, setClothingImage] = useState<PreviewImage | null>(null);
  const [personImage, setPersonImage] = useState<PreviewImage | null>(null);
  const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'result'>('upload');
  const [animationComplete, setAnimationComplete] = useState(false);
  const [category, setCategory] = useState<string>('upper_body');

  const clothingInputRef = useRef<HTMLInputElement>(null);
  const personInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (clothingImage) URL.revokeObjectURL(clothingImage.preview);
      if (personImage) URL.revokeObjectURL(personImage.preview);
      if (tryOnResult) URL.revokeObjectURL(tryOnResult.imageUrl);
    };
  }, []);

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

      // API call to Segmind
      const response = await axios.post(
        import.meta.env.VITE_SEGMIND_API_ENDPOINT || 'https://api.segmind.com/v1/try-on-diffusion',
        {
          model_image: modelImageBase64,
          cloth_image: clothImageBase64,
          category: category,
          num_inference_steps: 35,
          guidance_scale: 2,
          seed: 12467,
          base64: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': import.meta.env.VITE_SEGMIND_API_KEY || '',
          },
        }
      );

      // Handle the response
      if (response.data && response.data.image) {
        const imageUrl = `data:image/jpeg;base64,${response.data.image}`;
        setTryOnResult({ imageUrl });
        setActiveTab('result');
        
        // Scroll to result if on mobile
        if (window.innerWidth < 768) {
          resultRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to perform virtual try-on. Please try again.');
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 pt-32">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4">
            Virtual Try-On Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how clothes look on you before you buy! Upload your photo and the item you're interested in to visualize your perfect look.
          </p>
        </motion.div>

        {/* Tabs for mobile view */}
        <div className="flex border-b border-gray-200 mb-8 md:hidden">
          <button
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === 'upload'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button
            className={`flex-1 py-3 font-medium text-sm ${
              activeTab === 'result'
                ? 'text-black border-b-2 border-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('result')}
            disabled={!tryOnResult}
          >
            Result
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Upload Section */}
          <motion.div 
            variants={itemVariants}
            className={`${activeTab === 'result' ? 'hidden md:block' : ''}`}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Upload Your Images</h2>
                <p className="text-gray-300">Select your photo and the clothing item</p>
              </div>
              
              <div className="p-6 space-y-6">
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clothing Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="upper_body">Upper Body (Shirts, T-shirts)</option>
                    <option value="lower_body">Lower Body (Pants, Skirts)</option>
                    <option value="dresses">Dresses</option>
                  </select>
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
                    className="p-3 bg-red-50 text-red-700 rounded-lg text-center font-medium"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.div>
            
            {/* Tips Section */}
            <motion.div 
              variants={itemVariants}
              className="mt-6 bg-white rounded-xl shadow-lg p-5"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-gray-600">
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
          <motion.div 
            ref={resultRef}
            variants={itemVariants}
            className={`${activeTab === 'upload' ? 'hidden md:block' : ''}`}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-xl overflow-hidden h-full"
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-black px-6 py-4">
                <h2 className="text-2xl font-bold text-white">Your Virtual Try-On</h2>
                <p className="text-gray-300">See how it looks on you</p>
              </div>
              
              <div className="p-6">
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden min-h-[400px] flex items-center justify-center relative">
                  {isLoading ? (
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600 font-medium">Creating your virtual try-on...</p>
                      <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
                      
                      {/* Progress bar */}
                      <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 mx-auto overflow-hidden relative">
                        <motion.div 
                          className="absolute inset-0 bg-black w-full"
                          variants={shimmerVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      </div>
                    </div>
                  ) : tryOnResult ? (
                    <AnimatePresence>
                      <motion.div 
                        className="w-full h-full flex items-center justify-center p-4"
                        variants={resultVariants}
                        initial="initial"
                        animate="animate"
                        key="result"
                      >
                        <img
                          src={tryOnResult.imageUrl}
                          alt="Virtual Try-On Result"
                          className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
                        />
                        
                        {/* Animated badges that appear after animation completes */}
                        {animationComplete && (
                          <>
                            <motion.div 
                              className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              Perfect Match!
                            </motion.div>
                            <motion.div 
                              className="absolute bottom-4 left-4 bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 }}
                            >
                              <svg className="w-4 h-4 mr-1 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              Save to Favorites
                            </motion.div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  ) : (
                    <div className="text-center p-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-gray-500 text-lg">Your virtual try-on will appear here</p>
                      <p className="text-gray-400 text-sm mt-2">Upload your photos and click "Try It On"</p>
                    </div>
                  )}
                </div>
                
                {tryOnResult && (
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-wrap gap-2 justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-white px-4 py-2 rounded-lg flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Add to Cart
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        Save
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        Share
                      </motion.button>
                    </div>
                    
                    <div className="bg-gray-100 rounded-lg p-4">
                      <h4 className="font-medium text-gray-800 mb-2">What do you think?</h4>
                      <div className="flex justify-between">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white rounded-full p-2 shadow-sm"
                        >
                          <span role="img" aria-label="love it" className="text-2xl">😍</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white rounded-full p-2 shadow-sm"
                        >
                          <span role="img" aria-label="like it" className="text-2xl">👍</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white rounded-full p-2 shadow-sm"
                        >
                          <span role="img" aria-label="not sure" className="text-2xl">🤔</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="bg-white rounded-full p-2 shadow-sm"
                        >
                          <span role="img" aria-label="dislike" className="text-2xl">👎</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
        
        {/* How It Works Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-16 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Upload Photos</h3>
              <p className="text-gray-600">Upload your photo and select the clothing item you want to try on</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">2. AI Processing</h3>
              <p className="text-gray-600">Our advanced AI technology processes your images to create a realistic preview</p>
            </motion.div>
            
            <motion.div 
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">3. See Results</h3>
              <p className="text-gray-600">View how the clothing looks on you and make confident purchase decisions</p>
            </motion.div>
          </div>
        </motion.div>
        
        {/* FAQ Section */}
        <motion.div 
          variants={itemVariants}
          className="mt-12 bg-white rounded-2xl shadow-xl p-8"
        >
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">How accurate is the virtual try-on?</h3>
              <p className="mt-2 text-gray-600">Our AI technology provides a realistic approximation of how clothing will look on you, though exact fit and drape may vary slightly in person.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">What types of clothing can I try on?</h3>
              <p className="mt-2 text-gray-600">Currently, our system works best with tops, dresses, jackets, and outerwear. We're continuously improving to support more clothing types.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Is my photo data secure?</h3>
              <p className="mt-2 text-gray-600">Yes, we take privacy seriously. Your photos are processed securely and not stored permanently unless you explicitly save your try-on results.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VirtualTryOn;