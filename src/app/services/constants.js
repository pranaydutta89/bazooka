export default Object.freeze({
  devMode: location.hostname === 'localhost',
  game: {
    tapIt: 'tapIt',
    tambola: 'tambola',
    tugOfWar: 'tugOfWar'
  },
  dualTeam: {
    teamBlue: 'Team Blue',
    teamRed: 'Team Red'
  },
  gameType: {
    team: 'team',
    individual: 'individual',
    dualTeam: 'dualTeam',
    both: 'both'
  },
  serverUrl: location.hostname === 'localhost' ? 'http://localhost:3000' : location.origin,
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
    summary: 'summary',
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
