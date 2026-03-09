const User = require('../models/userModel');
const Otp = require('../models/otpModel');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendEmail } = require('../services/emailService');

// Helper function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 1. Register User (Email only, phone is optional)
exports.register = async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        // Check if phone number is provided and already exists
        if (phoneNumber) {
            const phoneExists = await User.findOne({ phoneNumber });
            if (phoneExists) {
                return res.status(400).json({ message: 'This phone number is already registered.' });
            }
        }

        // Make user verified automatically to skip OTP
        const user = await User.create({ name, email, phoneNumber: phoneNumber || null, password, isEmailVerified: true });

        // Temporarily skip generating/sending OTP
        // const emailOtp = otpGenerator.generate(6, ...);
        // await Otp.create(...);
        // await sendEmail(...);

        res.status(201).json({
            message: 'Registration successful! You are automatically verified.',
            userId: user._id,
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

// 2. Verify OTP (Email only)
exports.verifyOtp = async (req, res) => {
    const { userId, emailOtp } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const emailOtpRecord = await Otp.findOne({ identifier: user.email, otp: emailOtp });
        if (!emailOtpRecord) {
            return res.status(400).json({ message: 'Invalid or expired email verification code.' });
        }

        user.isEmailVerified = true;
        await user.save();

        await Otp.deleteMany({ identifier: user.email });

        res.status(200).json({
            message: 'Account verified successfully! You can now log in.',
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ message: 'Server error during OTP verification.' });
    }
};

// 3. Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }
        // if (!user.isEmailVerified) {
        //     return res.status(403).json({ message: 'Please verify your email before logging in.' });
        // }
        res.json({
            message: "Login successful",
            token: generateToken(user._id),
            user: { _id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

// 4. Resend OTP (Email only)
exports.resendOtp = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User with this email not found.' });
        if (user.isEmailVerified) return res.status(400).json({ message: 'This account is already verified.' });

        const emailOtp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
        await Otp.deleteMany({ identifier: user.email });
        await Otp.create({ identifier: user.email, otp: emailOtp });
        await sendEmail(user.email, 'New Verification Code for DASH', `Your new verification code is: <strong>${emailOtp}</strong>`);

        res.status(200).json({ message: 'A new verification code has been sent to your email.' });
    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({ message: 'Server error while resending OTPs.' });
    }
};

// 5. Update Profile
exports.updateProfile = async (req, res) => {
    const user = await User.findById(req.user.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.phoneNumber = req.body.phoneNumber || user.phoneNumber;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            phoneNumber: updatedUser.phoneNumber,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};







