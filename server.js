// server.js
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

let players = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  players[socket.id] = { x:200, y:550, level:1 };

  // gửi danh sách người chơi hiện tại
  io.emit('updatePlayers', players);

  // nhận di chuyển từ client
  socket.on('move', (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    io.emit('updatePlayers', players);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});
