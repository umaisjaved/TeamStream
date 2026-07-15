const Message = require('./models/Message');

const users = {};
const socketByUser = {};

function handleSocket(socket, io) {

  socket.on('joinRoom', async ({ username, room }) => {
    users[socket.id] = { username, room };
    socketByUser[username] = socket.id;
    socket.join(room);

    io.to(room).emit('notification', `🟢 ${username} joined the room`);

    const roomUsers = Object.values(users).filter(u => u.room === room);
    io.to(room).emit('roomUsers', roomUsers);

    try {
      const history = await Message.find({ room })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      const formattedHistory = history.reverse().map(msg => ({
        username: msg.username,
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString(),
        fileUrl: msg.fileUrl,
        fileName: msg.fileName,
        isImage: msg.isImage
      }));

      socket.emit('messageHistory', formattedHistory);
    } catch (err) {
      console.error('Error loading message history:', err.message);
    }
  });

  socket.on('sendMessage', async (message) => {
    const user = users[socket.id];
    if (user) {
      const msgData = {
        username: user.username,
        text: message,
        time: new Date().toLocaleTimeString()
      };

      io.to(user.room).emit('message', msgData);

      try {
        await new Message({
          username: user.username,
          room: user.room,
          text: message
        }).save();
      } catch (err) {
        console.error('Error saving message:', err.message);
      }
    }
  });

  // File message handler
  socket.on('sendFileMessage', async ({ fileUrl, fileName, isImage }) => {
    const user = users[socket.id];
    if (user) {
      const msgData = {
        username: user.username,
        text: '',
        fileUrl,
        fileName,
        isImage,
        time: new Date().toLocaleTimeString()
      };

      io.to(user.room).emit('message', msgData);

      try {
        await new Message({
          username: user.username,
          room: user.room,
          fileUrl,
          fileName,
          isImage
        }).save();
      } catch (err) {
        console.error('Error saving file message:', err.message);
      }
    }
  });

  socket.on('sendPrivateMessage', async ({ to, text }) => {
    const user = users[socket.id];
    if (!user) return;

    const msgData = {
      from: user.username,
      to,
      text,
      time: new Date().toLocaleTimeString()
    };

    const recipientSocketId = socketByUser[to];
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('privateMessage', msgData);
    }

    socket.emit('privateMessage', msgData);

    try {
      await new Message({
        username: user.username,
        recipient: to,
        text
      }).save();
    } catch (err) {
      console.error('Error saving private message:', err.message);
    }
  });

  socket.on('loadPrivateHistory', async ({ withUser }) => {
    const user = users[socket.id];
    if (!user) return;

    try {
      const history = await Message.find({
        $or: [
          { username: user.username, recipient: withUser },
          { username: withUser, recipient: user.username }
        ]
      })
        .sort({ createdAt: -1 })
        .limit(50)
        .lean();

      const formatted = history.reverse().map(msg => ({
        from: msg.username,
        to: msg.recipient,
        text: msg.text,
        time: new Date(msg.createdAt).toLocaleTimeString()
      }));

      socket.emit('privateHistory', formatted);
    } catch (err) {
      console.error('Error loading private history:', err.message);
    }
  });

  socket.on('typing', ({ room, isPrivate, to }) => {
    const user = users[socket.id];
    if (!user) return;

    if (isPrivate && to) {
      const recipientSocketId = socketByUser[to];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userTyping', {
          username: user.username,
          isPrivate: true
        });
      }
    } else {
      socket.to(room).emit('userTyping', {
        username: user.username,
        isPrivate: false
      });
    }
  });

  socket.on('stopTyping', ({ room, isPrivate, to }) => {
    const user = users[socket.id];
    if (!user) return;

    if (isPrivate && to) {
      const recipientSocketId = socketByUser[to];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userStopTyping', {
          username: user.username,
          isPrivate: true
        });
      }
    } else {
      socket.to(room).emit('userStopTyping', {
        username: user.username,
        isPrivate: false
      });
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      delete users[socket.id];
      delete socketByUser[user.username];
      io.to(user.room).emit('notification', `🔴 ${user.username} left the room`);
      const roomUsers = Object.values(users).filter(u => u.room === user.room);
      io.to(user.room).emit('roomUsers', roomUsers);
    }
  });
}

module.exports = { handleSocket };