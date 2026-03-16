// This must be at the very top
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import all route files ---
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const aiRoutes = require('./routes/aiRoutes');
const { startReminderService } = require('./services/reminderService');

// --- INITIALIZATION ---
const app = express();
connectDB();

app.get('/api/health', (req, res) => {
    const mongooseStatus = require('mongoose').connection.readyState;
    const statusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    res.json({
        status: 'ok',
        database: statusMap[mongooseStatus] || 'unknown',
        env: {
            DB_URL: process.env.DB_URL ? 'set' : 'missing',
            JWT_SECRET: process.env.JWT_SECRET ? 'set' : 'missing',
            GEMINI_API_KEY: process.env.GEMINI_API_KEY ? 'set' : 'missing'
        }
    });
});

// --- MIDDLEWARES ---
app.use(cors({
  origin: '*', // Allow all origins for Vercel deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', aiRoutes);

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'An unexpected error occurred!', error: err.message });
});

// --- SERVER STARTUP (only in non-serverless environments) ---
if (process.env.NODE_ENV !== 'production' || process.env.START_SERVER === 'true') {
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
        console.log(`Server is running successfully on port ${PORT}`);
        startReminderService();
    });
}

// Export for Vercel serverless
module.exports = app;