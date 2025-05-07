// middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Make sure 'uploads/' folder exists
    },
    filename: function (req, file, cb) {
        // fieldname-timestamp.extension
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|gif|webp/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime type
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only! (jpeg, jpg, png, gif, webp)');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Middleware for single image upload (e.g., for a primary image)
// const uploadSingleImage = upload.single('image'); // 'image' is the field name in the form-data

// Middleware for multiple image uploads (e.g., for product gallery)
const uploadMultipleImages = upload.array('images', 5); // 'images' is the field name, max 5 images

module.exports = { uploadMultipleImages /*, uploadSingleImage */ };