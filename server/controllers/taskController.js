
const Task = require('../models/taskModel');
const User = require('../models/userModel');
const { sendEmail } = require('../services/emailService');

// --- This is the new function ---
// Permanently deletes a batch of tasks.
exports.deleteTasksPermanently = async (req, res) => {
    const { taskIds } = req.body;
    const userId = req.user.id;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
        return res.status(400).json({ message: 'Task IDs must be provided in an array.' });
    }

    try {
        // We ensure we only delete tasks that belong to the logged-in user.
        const result = await Task.deleteMany({
            _id: { $in: taskIds }, // Match all tasks in the array
            user: userId            // And that belong to this user
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'No matching tasks found to delete.' });
        }

        res.status(200).json({ message: `Successfully deleted ${result.deletedCount} tasks permanently.` });
    } catch (error) {
        console.error("Error permanently deleting tasks:", error);
        res.status(500).json({ message: 'Error permanently deleting tasks.' });
    }
};


// --- All other functions are unchanged ---
exports.createTask = async (req, res) => {
    const { title, description, priority, dueDate, isStarred, alarms } = req.body;
    try {
        const task = await Task.create({ user: req.user.id, title, description, priority, dueDate, isStarred, alarms });
        
        // No email sent on task creation - only for reminders
        console.log(`Task "${title}" created successfully for user ${req.user.id}`);
        
        res.status(201).json(task);
    } catch (error) {
        console.error("Task Creation Error:", error);
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

exports.getUserTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id, isDeleted: false }).sort({ priority: -1, dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found or user not authorized' });
        Object.assign(task, req.body);
        const updatedTask = await task.save();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndUpdate({ _id: req.params.id, user: req.user.id }, { isDeleted: true }, { new: true });
        if (!task) return res.status(404).json({ message: 'Task not found or user not authorized' });
        res.status(200).json({ message: 'Task moved to trash' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task', error: error.message });
    }
};

exports.getStarredTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id, isStarred: true, isDeleted: false }).sort({ priority: -1, dueDate: 1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching starred tasks', error: error.message });
    }
};

exports.getCompletedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id, isCompleted: true, isDeleted: false }).sort({ updatedAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching completed tasks', error: error.message });
    }
};

exports.getDeletedTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id, isDeleted: true });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching deleted tasks', error: error.message });
    }
};








