const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    // Can store either an email or a phone number
    identifier: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // This is a special MongoDB index that automatically deletes the document
        // after the specified number of seconds. Here, it's 5 minutes.
        expires: 300,
    },
});

const Otp = mongoose.model('Otp', otpSchema);
module.exports = Otp;