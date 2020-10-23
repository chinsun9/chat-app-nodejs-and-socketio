const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const favicon = require('express-favicon');
const path = require('path');

const port = normalizePort(process.env.PORT || 5500);

http.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}.`);
});

app.use(favicon(path.join(__dirname, '../public/favicon.ico')));
app.use(express.static(path.join(__dirname, '../build')));

app.get('/ping', (req, res) => {
  return res.send('pong');
});
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

function normalizePort(val) {
  const port_int = parseInt(val, 10);

  if (isNaN(port_int)) {
    return val;
  }

  if (port_int >= 0) {
    return port_int;
  }

  return false;
}

////////

const users = {};

io.on('connection', (socket) => {
  socket.on('new-user', (name) => {
    users[socket.id] = name;

    const address = socket.handshake.address;

    socket.broadcast.emit('user-connected', name);
    console.log(`${new Date()}] ${address} ${name} connected`);
  });

  socket.on('send-chat-message', (message) => {
    // 연결이 끊겼다면..
    if (!users[socket.id]) {
      io.sockets.connected[socket.id].emit('bye');
      io.sockets.connected[socket.id].disconnect();
      return;
    }

    console.log(`${new Date()}] ${users[socket.id]}; ${message}`);
    socket.broadcast.emit('chat-message', {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on('disconnect', () => {
    users[socket.id] &&
      socket.broadcast.emit('user-disconnected', users[socket.id]);
    console.log(`${new Date()}] ${users[socket.id]} disconnected`);
  });

  socket.on('ping', () => {
    if (!users[socket.id]) {
      io.sockets.connected[socket.id].emit('bye');
      io.sockets.connected[socket.id].disconnect(true);
    }
  });
});
