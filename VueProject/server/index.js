require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const { Server } = require('socket.io');
const { handleSocket } = require('./socket');
const connectDB = require('./db');
const authRoutes = require('./routes/auth');
const messageRoutes = require('./routes/messages');
const uploadRoutes = require('./routes/upload');
const roomRoutes = require('./routes/rooms');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/rooms', roomRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  handleSocket(socket, io);
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});