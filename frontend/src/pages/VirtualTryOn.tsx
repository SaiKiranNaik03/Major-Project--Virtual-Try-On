// import React, { useState, useRef } from 'react';
// import axios from 'axios';
// import { motion } from 'framer-motion';

// interface TryOnResult {
//   imageUrl: string;
// }

// const VirtualTryOn: React.FC = () => {
//   const [clothingImage, setClothingImage] = useState<File | null>(null);
//   const [personImage, setPersonImage] = useState<File | null>(null);
//   const [tryOnResult, setTryOnResult] = useState<TryOnResult | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const clothingInputRef = useRef<HTMLInputElement>(null);
//   const personInputRef = useRef<HTMLInputElement>(null);

//   const handleClothingUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setClothingImage(file);
//     }
//   };

//   const handlePersonUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setPersonImage(file);
//     }
//   };

//   const performVirtualTryOn = async () => {
//     if (!clothingImage || !personImage) {
//       setError('Please upload both clothing and person images');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     const formData = new FormData();
//     formData.append('clothing', clothingImage);
//     formData.append('person', personImage);

//     try {
//       const response = await axios.post(
//         process.env.REACT_APP_SEGMIND_API_ENDPOINT || '',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//             'x-api-key': process.env.REACT_APP_SEGMIND_API_KEY || '',
//           },
//           responseType: 'blob',
//         }
//       );

//       const imageBlob = new Blob([response.data], { type: 'image/jpeg' });
//       const imageUrl = URL.createObjectURL(imageBlob);
//       setTryOnResult({ imageUrl });
//     } catch (err) {
//       setError('Failed to perform virtual try-on. Please try again.');
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetTryOn = () => {
//     setClothingImage(null);
//     setPersonImage(null);
//     setTryOnResult(null);
//     if (clothingInputRef.current) clothingInputRef.current.value = '';
//     if (personInputRef.current) personInputRef.current.value = '';
//   };

//   if (isLoading) {
//     return <VirtualTryOnSkeleton />;
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
//       <motion.div
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg p-8"
//       >
//         <h2 className="text-4xl font-extrabold text-center text-blue-600 mb-8">
//           Virtual Try-On
//         </h2>

//         <div className="grid md:grid-cols-2 gap-12">
//           <div>
//             <h3 className="text-2xl font-semibold mb-6 text-gray-700">
//               Upload Your Images
//             </h3>
//             <div className="space-y-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Clothing Image
//                 </label>
//                 <input
//                   type="file"
//                   ref={clothingInputRef}
//                   accept="image/*"
//                   onChange={handleClothingUpload}
//                   className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700">
//                   Person Image
//                 </label>
//                 <input
//                   type="file"
//                   ref={personInputRef}
//                   accept="image/*"
//                   onChange={handlePersonUpload}
//                   className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
//                 />
//               </div>
//             </div>

//             <div className="mt-8 flex space-x-4">
//               <button
//                 onClick={performVirtualTryOn}
//                 disabled={isLoading || !clothingImage || !personImage}
//                 className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
//               >
//                 {isLoading ? 'Processing...' : 'Try On'}
//               </button>
//               <button
//                 onClick={resetTryOn}
//                 className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-md hover:bg-gray-300"
//               >
//                 Reset
//               </button>
//             </div>

//             {error && (
//               <div className="mt-4 text-red-600 text-center font-medium">
//                 {error}
//               </div>
//             )}
//           </div>

//           <div>
//             <h3 className="text-2xl font-semibold mb-6 text-gray-700">
//               Your Try-On Result
//             </h3>
//             <div className="border-4 border-dashed border-gray-300 rounded-lg min-h-[400px] flex items-center justify-center bg-gray-50">
//               {tryOnResult ? (
//                 <img
//                   src={tryOnResult.imageUrl}
//                   alt="Virtual Try-On Result"
//                   className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
//                 />
//               ) : (
//                 <p className="text-gray-500 text-lg">
//                   Your try-on result will appear here
//                 </p>
//               )}
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default VirtualTryOn;
