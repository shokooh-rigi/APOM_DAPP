const express = require('express');
const router = express.Router();

// Simple in-memory storage for notifications
let notifications = [
  {
    id: 'notif_001',
    userId: 'user_001',
    type: 'game_reward',
    title: '🎮 Game Reward Earned!',
    message: 'Congratulations! You earned 150 APOM tokens from completing Crypto Warriors level 5.',
    timestamp: new Date().toISOString(),
    read: false
  },
  {
    id: 'notif_002',
    userId: 'user_001',
    type: 'defi_update',
    title: '💎 High APY Alert',
    message: 'APOM-ETH liquidity pool now offers 48.5% APY! Stake your tokens now.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
    read: false
  },
  {
    id: 'notif_003',
    userId: 'user_001',
    type: 'nft_sale',
    title: '🖼️ NFT Sold Successfully',
    message: 'Your Crypto Warrior #1234 NFT sold for 2.5 ETH! Funds are now in your wallet.',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
    read: true
  },
  {
    id: 'notif_004',
    userId: 'user_001',
    type: 'governance',
    title: '🗳️ New Proposal Available',
    message: 'Vote on Proposal #42: Increase gaming rewards by 25%. Voting ends in 3 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
    read: false
  },
  {
    id: 'notif_005',
    userId: 'user_001',
    type: 'achievement',
    title: '🏆 Achievement Unlocked',
    message: 'You\'ve reached "DeFi Master" status! Unlock exclusive trading features.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    read: true
  }
];

// Get all notifications for a user
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    const userNotifications = notifications.filter(notif => notif.userId === userId);
    
    res.json({
      success: true,
      data: userNotifications,
      count: userNotifications.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notifications',
      message: error.message
    });
  }
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }

    const notification = notifications.find(notif => notif.id === id);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();
    
    res.json({
      success: true,
      data: notification,
      message: 'Notification marked as read',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
      message: error.message
    });
  }
});

// Delete notification
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Notification ID is required'
      });
    }

    const notificationIndex = notifications.findIndex(notif => notif.id === id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found'
      });
    }

    const deletedNotification = notifications.splice(notificationIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedNotification,
      message: 'Notification deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete notification',
      message: error.message
    });
  }
});

// Create new notification
router.post('/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { type, title, message } = req.body;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required'
      });
    }

    if (!type || !title || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: type, title, message'
      });
    }
    
    const newNotification = {
      id: `notif_${Date.now()}`,
      userId,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };
    
    notifications.unshift(newNotification);
    
    res.status(201).json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create notification',
      message: error.message
    });
  }
});

module.exports = router;
