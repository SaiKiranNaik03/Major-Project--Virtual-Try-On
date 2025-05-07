// models/Product.js
const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

const productSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        name: {
            type: String,
            required: [true, 'Please add a product name'],
            trim: true,
        },
        images: [ // Array of image objects
            {
                // For local uploads, we store the filename/path.
                // The full URL will be constructed like: http://localhost:5000/uploads/filename.jpg
                filename: { type: String, required: true }, // e.g., 'image-1678886400000.jpg'
                // path: { type: String, required: true }, // e.g., 'uploads/image-1678886400000.jpg' - can be derived
            }
        ],
        brand: {
            type: String,
            required: [true, 'Please add a brand'],
        },
        category: {
            type: String,
            required: [true, 'Please add a category'],
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        reviews: [reviewSchema],
        rating: {
            type: Number,
            required: true,
            default: 0,
        },
        numReviews: {
            type: Number,
            required: true,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
            default: 0,
        },
        sizes: [{ type: String }],
        colors: [{ name: String, hex: String }],
        countInStock: {
            type: Number,
            required: true,
            default: 0,
            min: 0
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true }, // Ensure virtuals are included when converting to JSON
        toObject: { virtuals: true } // Ensure virtuals are included when converting to object
    }
);

// Virtual for full image URLs
productSchema.virtual('imageUrls').get(function() {
    if (this.images && this.images.length > 0) {
        return this.images.map(img => `${process.env.BASE_URL || 'http://localhost:5000'}/uploads/${img.filename}`);
    }
    return [];
});


module.exports = mongoose.model('Product', productSchema);