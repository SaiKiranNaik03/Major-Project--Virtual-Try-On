// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Add this
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// ... (other imports)
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes'); // Make sure this is imported

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// --- Static Folder for Uploads ---
// This makes the 'uploads' folder publicly accessible.
// So, if you have an image 'uploads/product-123.jpg', it can be accessed via 'http://localhost:5000/uploads/product-123.jpg'
// IMPORTANT: In production, you'd likely use a CDN or dedicated file server.
// For the path.join to work correctly, __dirname should point to the root of your project where server.js is.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.get('/', (req, res) => {
    res.send('E-commerce API is running...');
});

// --- Routes ---
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes); // Ensure this is set up

// ... (error handling middleware)

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`));