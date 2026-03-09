const express = require('express');
const {
    createTask,
    getUserTasks,
    updateTask,
    deleteTask, // This is for soft-deleting a single task
    getStarredTasks,
    getCompletedTasks,
    getDeletedTasks,
    deleteTasksPermanently // <-- IMPORT THE NEW FUNCTION
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Apply auth middleware to all task routes
router.use(authMiddleware);

// --- Standard CRUD Routes ---
router.post('/', createTask);
router.get('/', getUserTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask); // Soft deletes one task

// --- NEW BATCH DELETE ROUTE ---
// This route will handle permanently deleting multiple tasks
// We use router.delete on the root '/' path because we're sending the IDs in the request body
router.delete('/', deleteTasksPermanently); // Permanently deletes a batch of tasks

// --- Filtered GET Routes ---
router.get('/starred', getStarredTasks);
router.get('/completed', getCompletedTasks);
router.get('/deleted', getDeletedTasks);

module.exports = router;






