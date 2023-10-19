const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configure your MongoDB connection
mongoose.connect('mongodb://localhost/chatroomdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a schema for chat messages
const chatMessageSchema = new mongoose.Schema({
  username: String,
  message: String,
  timestamp: Date,
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// Enable CORS for your frontend
//const cors = require('cors');
app.use(cors());

// Socket.io for real-time chat
io.on('connection', (socket) => {
  console.log('New connection');

  socket.on('message', (data) => {
    // Save the chat message to the database
    const message = new ChatMessage(data);
    message.save();

    // Broadcast the message to all clients
    io.emit('message', data);
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});
