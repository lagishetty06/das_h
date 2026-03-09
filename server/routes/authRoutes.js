const express = require('express');
const {
    register,
    verifyOtp,
    login,
    resendOtp,
    updateProfile // Import the new function
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware'); // Import the middleware

const router = express.Router();

// --- Public Routes ---
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp', resendOtp);

// --- Protected Route ---
// This route is for updating the user's profile.
// It is protected by the authMiddleware, so only logged-in users can access it.
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;