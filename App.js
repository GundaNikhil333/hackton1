import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('message', (data) => {
      setNewMessage(data);
    });

    // Fetch chat history when the component mounts
    axios.get('http://localhost:5000/chat/messages').then((response) => {
      setMessages(response.data);
    });
  }, []);

  const sendMessage = () => {
    if (message.trim() === '') return;

    socket.emit('message', { username, message });
    setMessage('');
  };

  return (
    <div className="App">
      <h1>Chat Room</h1>
      <div className="chat">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index}>
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
          {newMessage && (
            <div>
              <strong>{newMessage.username}:</strong> {newMessage.message}
            </div>
          )}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
