import express from "express";
import socketio from "socket.io";
import { createServer } from "http";
import path from "path";
const app = express();
const http = createServer(app);

const io = socketio(http);

const port = normalizePort(process.env.PORT || 5500);

app.get("/ping", (req, res) => {
  return res.send("pong");
});

app.get("/users", (req, res) => {
  return res.json(users);
});

app.get("/", (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  console.log(ip);
  return res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.use(express.static(path.join(__dirname, "../dist")));

function normalizePort(val: any) {
  const port_int = parseInt(val, 10);

  if (isNaN(port_int)) {
    return val;
  }

  if (port_int >= 0) {
    return port_int;
  }

  return false;
}

http.listen(port, "0.0.0.0", () => {
  console.log(
    `Server is listening on port http://localhost:${port}. im ts server`
  );
});

////////

function hashCode(str: string) {
  var hash = 0,
    i,
    chr;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

function getColorByString(str: any) {
  const stringhash = `0.` + Math.abs(hashCode(str));

  var bg_colour = Math.floor(Number(stringhash) * 16777215).toString(16);
  bg_colour = "#" + ("000000" + bg_colour).slice(-6);

  return bg_colour;
}

////////////////

const users: any = {};

io.on("connection", (socket) => {
  socket.on("new-user", (name) => {
    users[socket.id] = name;

    const address = socket.handshake.address;

    socket.broadcast.emit("user-connected", name);
    console.log(`${new Date()}] ${address} ${name} connected`);
  });

  socket.on("send-chat-message", (message) => {
    console.log(`${new Date()}] ${users[socket.id]}; ${message}`);
    socket.broadcast.emit("chat-message", {
      message: message,
      name: users[socket.id],
      color: getColorByString(socket.id),
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", users[socket.id]);
    console.log(`${new Date()}] ${users[socket.id]} disconnected`);
    delete users[socket.id];

    console.log(`current users : `);
    console.log(users);
  });
});
