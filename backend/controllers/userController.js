// controllers/userController.js
const User = require('../models/User');
const generateToken = require('../utils/generateToken'); // Or generate directly

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body; // Role can be optional, default to 'user'

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user' // Ensure role is set, default if not provided
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error); // Pass error to the global error handler
    }
};

// @desc    Auth user & get token (Login)
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find user by email, include password for comparison
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res, next) => {
    // req.user is set by the 'protect' middleware
    try {
        const user = await User.findById(req.user.id); // req.user.id comes from the token
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Update user profile
// @route   PUT /api/users/me/update
// @access  Private
const updateUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            // Password update should be handled separately and carefully
            // if (req.body.password) {
            //   user.password = req.body.password;
            // }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                // Don't return token on update unless password changed & re-auth needed
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        if (error.code === 11000) { // Duplicate key error (e.g., email already exists)
            return res.status(400).json({ message: 'Email already in use' });
        }
        next(error);
    }
};


// --- Admin Functions ---

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({}); // Exclude passwords by default due to schema
        res.json(users);
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            if (user.role === 'admin') {
                 return res.status(400).json({ message: 'Cannot delete admin user' });
            }
            await User.deleteOne({ _id: user._id }); // or user.remove() if you have pre-remove hooks
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        next(error);
    }
};


module.exports = {
    registerUser,
    loginUser,
    getMe,
    updateUserDetails,
    getAllUsers,
    deleteUser
};