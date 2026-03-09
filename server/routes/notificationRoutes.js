const express = require('express');
const { getNotifications } = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// This entire route is protected. Only logged-in users can access it.
router.use(authMiddleware);

// @route   GET /api/notifications
// @desc    Get all notifications for the current user
router.get('/', getNotifications);

module.exports = router;