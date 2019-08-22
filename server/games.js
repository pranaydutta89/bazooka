
const roomAdmin = {}
module.exports = (socket, roomId, socketId) => {
  if (roomId && socketId) {
    if (roomAdmin[roomId]) {
      roomAdmin[roomId].push(socketId);
    }
    else {
      roomAdmin[roomId] = [socketId];
    }
  }
  socket.on('msgToAdmin', (msg, cb) => {
    roomAdmin[roomId].forEach(id => {
      socket.socket(id).emit(msg);
    });

    if (cb && typeof cb === 'function') {
      cb();
    }
  });

  socket.on('msgToClient', (msg, cb) => {
    socket.emit(msg);
    if (cb && typeof cb === 'function') {
      cb();
    }
  });
}