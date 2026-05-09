const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// phục vụ frontend từ thư mục public
app.use(express.static(path.join(__dirname, 'public')));

let players = {};
let towerLevels = {};

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  players[socket.id] = { x:200, y:550, level:1, score:0 };

  io.emit('updatePlayers', players);

  socket.on('move', (data) => {
    players[socket.id].x = data.x;
    players[socket.id].y = data.y;
    io.emit('updatePlayers', players);
  });

  socket.on('nextLevel', () => {
    players[socket.id].level++;
    players[socket.id].score += 10;

    if (!towerLevels[players[socket.id].level]) {
      towerLevels[players[socket.id].level] = {
        obstacles: Math.floor(Math.random()*5)+1
      };
    }

    io.emit('updateTower', towerLevels);
    io.emit('updatePlayers', players);
  });

  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    delete players[socket.id];
    io.emit('updatePlayers', players);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
