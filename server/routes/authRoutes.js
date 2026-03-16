const express = require('express');
const {
    register,
    verifyOtp,
    login,
    resendOtp,
    updateProfile,
    googleAuth,
} = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// --- Public Routes ---
router.post('/register', register);
router.post('/verify-otp', verifyOtp);
router.post('/login', login);
router.post('/resend-otp', resendOtp);
router.post('/google', googleAuth);

// --- Protected Route ---
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;