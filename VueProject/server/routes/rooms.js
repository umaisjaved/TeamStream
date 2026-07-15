const express = require('express');
const jwt = require('jsonwebtoken');
const Room = require('../models/Room');

const router = express.Router();

// ======================
// Authentication Middleware
// ======================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT Error:', err);
    return res.status(401).json({
      message: 'Invalid token'
    });
  }
}

// ======================
// Get Public Rooms
// ======================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const rooms = await Room.find({ isPrivate: false })
      .sort({ createdAt: -1 })
      .lean();

    res.json(rooms);
  } catch (err) {
    console.error('Fetch Rooms Error:', err);

    res.status(500).json({
      message: err.message
    });
  }
});

// ======================
// Search Rooms
// ======================
router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { query } = req.query;

    const filter = query
      ? {
          name: {
            $regex: query,
            $options: 'i'
          },
          isPrivate: false
        }
      : {
          isPrivate: false
        };

    const rooms = await Room.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.json(rooms);
  } catch (err) {
    console.error('Search Error:', err);

    res.status(500).json({
      message: err.message
    });
  }
});

// ======================
// Create Room
// ======================
router.post('/create', authMiddleware, async (req, res) => {
  try {

    console.log('==========================');
    console.log('CREATE ROOM REQUEST');
    console.log('User:', req.user);
    console.log('Body:', req.body);
    console.log('==========================');

    const { name, description, isPrivate } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        message: 'Room name must be at least 2 characters'
      });
    }

    const existingRoom = await Room.findOne({
      name: name.trim()
    });

    if (existingRoom) {
      return res.status(400).json({
        message: 'A room with this name already exists'
      });
    }

    const room = new Room({
      name: name.trim(),
      description: description ? description.trim() : '',
      createdBy: req.user.username,
      isPrivate: Boolean(isPrivate),
      members: [req.user.username]
    });

    console.log('Room Before Save:');
    console.log(room);

    const savedRoom = await room.save();

    console.log('Room Saved Successfully!');
    console.log(savedRoom);

    return res.status(201).json(savedRoom);

  } catch (err) {

    console.error('==========================');
    console.error('CREATE ROOM ERROR');
    console.error(err);
    console.error('Name:', err.name);
    console.error('Message:', err.message);
    console.error('Code:', err.code);
    console.error('Errors:', err.errors);
    console.error('Stack:', err.stack);
    console.error('==========================');

    return res.status(500).json({
      success: false,
      message: err.message,
      errorName: err.name,
      errorCode: err.code,
      validationErrors: err.errors
    });
  }
});

// ======================
// Join Room
// ======================
router.post('/join', authMiddleware, async (req, res) => {
  try {

    const { roomCode } = req.body;

    const room = await Room.findOne({
      roomCode: roomCode.toUpperCase()
    });

    if (!room) {
      return res.status(404).json({
        message: 'Room not found. Check the code and try again.'
      });
    }

    if (!room.members.includes(req.user.username)) {
      room.members.push(req.user.username);
      await room.save();
    }

    res.json(room);

  } catch (err) {

    console.error('Join Room Error:', err);

    res.status(500).json({
      message: err.message
    });
  }
});

module.exports = router;