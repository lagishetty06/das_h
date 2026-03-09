const Notification = require('../models/notificationModel');

// Get all notifications for the logged-in user, sorted by most recent
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications' });
  }
};

// We can add functions to mark notifications as read here later