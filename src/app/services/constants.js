export default Object.freeze({
  devMode: location.hostname === 'localhost',
  game: {
    tapIt: 'tapIt',
    tambola: 'tambola'
  },
  gameType: {
    team: 'team',
    individual: 'individual',
    both: 'both'
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
    decarledWinner: 'decarledWinner',
    decryptClientUrl: 'decryptClientUrl',
    encryptClientUrl: 'encryptClientUrl',
    tapSummary: 'tapSummary',
    startGame: 'startGame',
    userTapped: 'userTapped',
    claimPrize: 'claimPrize',
    userJoined: 'userJoined',
    userLeft: 'userLeft',
    endGame: 'endGame',
    pauseGame: 'pauseGame',
    resumeGame: 'resumeGame',
    broadCastMessage: 'broadCastMessage',
    kickOutUser: 'kickOutUser'
  }
});
