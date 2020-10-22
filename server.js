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
