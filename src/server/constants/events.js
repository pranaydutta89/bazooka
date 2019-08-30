const data = {
  socketEvents: {
    api: "api",
    joinRoom: "joinRoom",
    msgToAdmin: "msgToAdmin",
    msgFromClient: "msgFromClient",
    msgToClient: "msgToClient",
    msgFromAdmin: "msgFromAdmin"
  },
  socketDataEvents: {
    decryptClientUrl: "decryptClientUrl",
    encryptClientUrl: "encryptClientUrl",
    tapSummary: "tapSummary",
    startGame: "startGame",
    userTapped: "userTapped",
    userJoined: "userJoined",
    userLeft: "userLeft",
    endGame: "endGame"
  }
};

module.exports = data;
