const express = require('express');
const Message = require('../models/message');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Middleware to verify JWT token
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Search messages
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query, room } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const filter = {
      text: { $regex: query, $options: 'i' },
      room: { $exists: true, $ne: null }
    };

    if (room) filter.room = room;

    const messages = await Message.find(filter)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json(messages.map(msg => ({
      id: msg._id,
      username: msg.username,
      text: msg.text,
      room: msg.room,
      time: new Date(msg.createdAt).toLocaleString()
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;