const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('MongoDB connection successful.');
    } catch (err) {
        console.error('Error in MongoDB connection:', err.message);
        // Do not exit process in serverless, let the request handle the failure
    }
};

module.exports = connectDB;