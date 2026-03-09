const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connection successful.');
    } catch (err) {
        console.error('Error in MongoDB connection:', err.message);
        // Exit process with failure if connection fails
        process.exit(1);
    }
};

module.exports = connectDB;