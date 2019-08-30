export default {
  game: {
    tapIt: 'tapIt'
  },
  serverUrl: location.hostname === 'localhost' ? 'http://localhost:3000' : location.origin,
  playAs: {
    individual: 'individual',
    team: 'team'
  },
  domEvents: {
    triggerSpinner: 'triggerSpinner',
    triggerAlert: 'triggerAlert'
  },
  socketEvents: {
    api: 'api',
    joinRoom: 'joinRoom',
    msgToAdmin: 'msgToAdmin',
    msgFromClient: 'msgFromClient',
    msgToClient: 'msgToClient',
    msgFromAdmin: 'msgFromAdmin'
  },
  socketDataEvents: {
    decryptClientUrl: 'decryptClientUrl',
    encryptClientUrl: 'encryptClientUrl',
    tapSummary: 'tapSummary',
    startGame: "startGame",
    userTapped: 'userTapped',
    userJoined: 'userJoined',
    userLeft: 'userLeft',
    endGame: 'endGame'
  }
}