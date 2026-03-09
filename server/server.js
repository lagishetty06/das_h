// This must be at the very top
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// --- Import all route files ---
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes'); // <-- THIS WAS THE MISSING LINE
const aiRoutes = require('./routes/aiRoutes');
const { startReminderService } = require('./services/reminderService');

// --- INITIALIZATION ---
const app = express();
connectDB();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// --- API ROUTES ---
// Mount the routes on their respective paths
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes); // This line will now work correctly
app.use('/api/ai', aiRoutes);
// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'An unexpected error occurred!', error: err.message });
});

// --- SERVER STARTUP ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}`);
    startReminderService();
});