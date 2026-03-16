const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address.'],
    },
    phoneNumber: {
        type: String,
        required: false, // Made optional
        unique: true,
        sparse: true, // Allows multiple null values
    },
    password: {
        type: String,
        required: false, // Optional for Google Sign-In users
        minlength: 6,
    },
    googleUid: {
        type: String,
        required: false,
        unique: true,
        sparse: true, // Allows multiple null values
    },
    photoURL: {
        type: String,
        required: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    // Removed isPhoneVerified field
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    strict: true, // Ensures only defined fields are saved
});

// Hash password before saving (only if it exists and has been modified)
userSchema.pre('save', async function(next) {
    if (!this.password || !this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// This adds a helper method to the user model to compare passwords during login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;