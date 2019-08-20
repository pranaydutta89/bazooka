
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
  socket.on('msgToAdmin', (msg) => {
    roomAdmin[roomId].forEach(id => {
      socket.socket(id).emit(id);
    });
  });

  socket.on('msgToClient', (msg) => {
    socket.emit(msg);
  });
}