// routes/userRoutes.js
const express = require('express');
const {
    registerUser,
    loginUser,
    getMe,
    updateUserDetails,
    // More admin functions can be added here
    getAllUsers, // Admin
    deleteUser   // Admin
} = require('../controllers/userController'); // We'll create this next
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateRegistration, validateLogin } = require('../middleware/validationMiddleware'); // We'll create this

const router = express.Router();

router.post('/register', validateRegistration, registerUser);
router.post('/login', validateLogin, loginUser);
router.get('/me', protect, getMe);
router.put('/me/update', protect, updateUserDetails);

// Admin routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.delete('/:id', protect, authorize('admin'), deleteUser);


module.exports = router;