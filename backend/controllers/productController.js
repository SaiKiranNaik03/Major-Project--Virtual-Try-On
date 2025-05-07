// controllers/productController.js
const Product = require('../models/Product');
const User = require('../models/User'); // For reviews
const fs = require('fs'); // File system module for deleting images
const path = require('path'); // Path module

// Helper function for advanced filtering/searching (can be expanded)
const buildProductQuery = (queryParams) => {
    const query = {};
    const { keyword, category, brand, minPrice, maxPrice, rating } = queryParams;

    if (keyword) {
        query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } }
        ];
    }
    if (category) {
        query.category = { $regex: category, $options: 'i' };
    }
    if (brand) {
        query.brand = { $regex: brand, $options: 'i' };
    }
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (rating) {
        query.rating = { $gte: Number(rating) };
    }
    return query;
};


// @desc    Fetch all products with filtering, pagination, and search
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const pageSize = parseInt(req.query.limit) || 10; // Products per page
        const page = parseInt(req.query.page) || 1; // Current page

        const filterQuery = buildProductQuery(req.query);

        const count = await Product.countDocuments(filterQuery);
        const products = await Product.find(filterQuery)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: req.query.sort === 'asc' ? 1 : -1 }); // Example sort by createdAt

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            count,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('reviews.user', 'name email'); // Populate user details for reviews
        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        // Handle CastError if ID is invalid format
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(404);
            return next(new Error('Product not found with that ID'));
        }
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, brand, category, countInStock, sizes, colors } = req.body;

        if (!req.files || req.files.length === 0) {
            res.status(400);
            return next(new Error('No images uploaded. At least one image is required.'));
        }

        const images = req.files.map(file => {
            return { filename: file.filename }; // Store filename, path can be constructed
        });

        const product = new Product({
            name,
            price: Number(price),
            user: req.user._id, // from protect middleware
            images,
            brand,
            category,
            countInStock: Number(countInStock),
            numReviews: 0,
            description,
            sizes: sizes ? (Array.isArray(sizes) ? sizes : JSON.parse(sizes)) : [], // Handle stringified array from form-data
            colors: colors ? (Array.isArray(colors) ? colors : JSON.parse(colors)) : [], // e.g., [{name: "Red", hex: "#FF0000"}]
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        // If product creation fails, attempt to delete uploaded files to prevent orphans
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', 'uploads', file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error deleting orphaned file:", err);
                });
            });
        }
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, brand, category, countInStock, sizes, colors, existingImages } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Authorization check: ensure the user updating is an admin (already handled by authorize middleware)
        // or if you want the original creator to update (less common for general e-commerce admin)
        // if (product.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        //     res.status(401);
        //     throw new Error('User not authorized to update this product');
        // }

        product.name = name || product.name;
        product.price = price !== undefined ? Number(price) : product.price;
        product.description = description || product.description;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock !== undefined ? Number(countInStock) : product.countInStock;
        product.sizes = sizes ? (Array.isArray(sizes) ? sizes : JSON.parse(sizes)) : product.sizes;
        product.colors = colors ? (Array.isArray(colors) ? colors : JSON.parse(colors)) : product.colors;

        let updatedImages = product.images;

        // Handle removal of existing images
        // `existingImages` should be an array of filenames of images to keep.
        // If not provided or empty, all existing images are kept unless new ones replace them all.
        if (existingImages) {
            const imagesToKeep = Array.isArray(existingImages) ? existingImages : [existingImages]; // Ensure it's an array
            const imagesToRemove = product.images.filter(img => !imagesToKeep.includes(img.filename));

            imagesToRemove.forEach(img => {
                const filePath = path.join(__dirname, '..', 'uploads', img.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.error(`Error deleting old image ${img.filename}:`, err);
                    else console.log(`Deleted old image: ${img.filename}`);
                });
            });
            updatedImages = product.images.filter(img => imagesToKeep.includes(img.filename));
        }


        // Handle new image uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => ({ filename: file.filename }));
            // Decide if you want to append or replace. Here we append.
            // If you want to replace all, set updatedImages = newImages;
            updatedImages = [...updatedImages, ...newImages];
        }

        product.images = updatedImages;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } catch (error) {
        // If update fails and new files were uploaded, attempt to delete them
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', 'uploads', file.filename);
                fs.unlink(filePath, (err) => {
                    if (err) console.error("Error deleting new file on update failure:", err);
                });
            });
        }
        next(error);
    }
};


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Delete images from server
        if (product.images && product.images.length > 0) {
            product.images.forEach(image => {
                const imagePath = path.join(__dirname, '..', 'uploads', image.filename);
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        // Log error but don't stop product deletion if image file not found
                        console.error(`Failed to delete image: ${imagePath}`, err);
                    } else {
                        console.log(`Deleted image: ${imagePath}`);
                    }
                });
            });
        }

        await Product.deleteOne({ _id: product._id }); // Use deleteOne or findByIdAndDelete
        res.json({ message: 'Product removed' });

    } catch (error) {
        // Handle CastError if ID is invalid format
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            res.status(404);
            return next(new Error('Product not found with that ID'));
        }
        next(error);
    }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = async (req, res, next) => {
    const { rating, comment } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed by this user');
        }

        // Optional: Check if user purchased the product. This requires Order model integration.
        // For now, we'll skip this check for simplicity.
        // const orders = await Order.find({ user: req.user._id, 'orderItems.product': product._id, isPaid: true });
        // if (orders.length === 0) {
        //     res.status(400);
        //     throw new Error('You can only review products you have purchased');
        // }


        const review = {
            name: req.user.name, // Name from logged-in user
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });

    } catch (error) {
        next(error);
    }
};


module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
};