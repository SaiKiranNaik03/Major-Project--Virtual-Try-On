const validateRegistration = (req, res, next) => {
    const { name, email, password } = req.body;

    // Check if all required fields are present
    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide all required fields'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide a valid email address'
        });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            error: 'Password must be at least 6 characters long'
        });
    }

    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    // Check if all required fields are present
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            error: 'Please provide email and password'
        });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Please provide a valid email address'
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin
}; 