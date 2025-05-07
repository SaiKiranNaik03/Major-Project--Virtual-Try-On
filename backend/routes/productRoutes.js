// routes/productRoutes.js
const express = require('express');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadMultipleImages } = require('../middleware/uploadMiddleware'); // Import multer middleware

const router = express.Router();

router.route('/')
    .get(getProducts)
    // Use multer middleware here for createProduct
    .post(protect, authorize('admin'), uploadMultipleImages, createProduct);

router.route('/:id')
    .get(getProductById)
    // Use multer middleware here for updateProduct if images can be updated
    .put(protect, authorize('admin'), uploadMultipleImages, updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;