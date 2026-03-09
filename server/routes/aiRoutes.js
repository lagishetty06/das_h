const express = require('express');
const { 
    askAboutDash, 
    processAiCommand // This replaces the old createTaskFromText
} = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All routes here are protected
router.use(authMiddleware);

// Debug middleware
router.use((req, res, next) => {
    console.log('=== AI Route Hit ===');
    console.log('Method:', req.method);
    console.log('Path:', req.path);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers.authorization ? 'Token present' : 'No token');
    next();
});

// @route   POST /api/ai/ask
// @desc    Ask the AI assistant a "help" question about DASH
router.post('/ask', askAboutDash);

// @route   POST /api/ai/command
// @desc    Process a natural language "action" command (Create, Read, Update, Delete)
router.post('/command', processAiCommand);

module.exports = router;



// const express = require('express');
// const { askAboutDash, createTaskFromText } = require('../controllers/aiController');
// const authMiddleware = require('../middlewares/authMiddleware');

// const router = express.Router();

// // --- Apply Authentication Middleware ---
// // All routes defined below this line will require a valid JWT token.
// router.use(authMiddleware);

// // --- Define AI Routes ---

// // @route   POST /api/ai/ask
// // @desc    Ask the AI assistant a question about the DASH application
// // @access  Private (Requires Login)
// router.post('/ask', askAboutDash);

// // @route   POST /api/ai/create-task-text
// // @desc    Create a new task from natural language text input
// // @access  Private (Requires Login)
// router.post('/create-task-text', createTaskFromText);


// module.exports = router;