export default {
  game: {
    tapIt: 'tapIt'
  },
  serverUrl: location.hostname === 'localhost' ? 'http://localhost:3000' : location.origin,
  playAs: {
    individual: 'individual',
    team: 'team'
  }
}