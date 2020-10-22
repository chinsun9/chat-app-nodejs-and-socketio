const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

const app = express();
const port = 5500;
const server = app.listen(port, () => {
  console.log(`Server is listening on port ${server.address().port}.`);
});

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/ping', (req, res) => {
  return res.send('pong');
});
app.get('/*', (req, res) => {
  return res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

////////

const io = require('socket.io')(3000);

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-connected', name);
    console.log(`${new Date()}] ${name} connected`);
  });

  socket.on('send-chat-message', (message) => {
    console.log(`${new Date()}] ${users[socket.id]}; ${message}`);
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-disconnectd', users[socket.id]);
    console.log(`${new Date()}] ${users[socket.id]} disconnectd`);
    delete users[socket.id];
  });
});
