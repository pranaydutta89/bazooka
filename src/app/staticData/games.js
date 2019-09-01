import constants from '../services/constants';

export default [
  {
    id: constants.game.tapIt,
    gameType: constants.gameType.both,
    title: 'Tap It - Team tapping competition',
    summary: 'Lets see who is a tapping master',
    instructions: [
      {
        type: 'info',
        comment:
          'Open this URL to any device which can be visible to any player, example open this URL in tablet this would be our admin device'
      },
      {
        type: 'info',
        comment: 'Enter room name, room name can be anything is specifies a group'
      },
      {
        type: 'info',
        comment: 'Press next'
      },
      {
        type: 'info',
        comment:
          'Enter team names one by one and press add, every player would be in one team, minimum 2 teams are required for room to get created'
      },
      {
        type: 'info',
        comment: 'Press Start'
      },
      {
        type: 'info',
        comment: 'Once the room and team has be created, copy the unique URL and share it to players'
      },
      {
        type: 'info',
        comment: 'Ask players to open the url and enter there name and select a team where they want to join'
      },
      {
        type: 'info',
        comment: 'Once players are joined, enter the time for which you want team to play ,default is 30 seconds'
      },
      {
        type: 'info',
        comment: 'Press the start button and play on'
      }
    ]
  },
  {
    id: constants.game.tambola,
    gameType: constants.gameType.individual,
    title: 'Tambola',
    summary: 'Lets see who is a tapping master',
    instructions: [
      {
        type: 'info',
        comment:
          'Open this URL to any device which can be visible to any player, example open this URL in tablet this would be our admin device'
      },
      {
        type: 'info',
        comment: 'Enter room name, room name can be anything is specifies a group'
      },
      {
        type: 'info',
        comment: 'Press next'
      },
      {
        type: 'info',
        comment:
          'Enter team names one by one and press add, every player would be in one team, minimum 2 teams are required for room to get created'
      },
      {
        type: 'info',
        comment: 'Press Start'
      },
      {
        type: 'info',
        comment: 'Once the room and team has be created, copy the unique URL and share it to players'
      },
      {
        type: 'info',
        comment: 'Ask players to open the url and enter there name and select a team where they want to join'
      },
      {
        type: 'info',
        comment: 'Once players are joined, enter the time for which you want team to play ,default is 30 seconds'
      },
      {
        type: 'info',
        comment: 'Press the start button and play on'
      }
    ]
  }
];
