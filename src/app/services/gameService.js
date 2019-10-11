import socketService from './socketService';
import constants from './constants';
import router from './routerService';
class GameService {
  async leaveGame(roomId, userId, route = true) {
    try {
      await socketService.sendDataToAdmin(roomId, {
        event: constants.socketDataEvents.userLeft,
        data: {
          id: userId
        }
      });
    } catch (e) {
      //do nothing
    }
    if (route) {
      router.navigate('/');
    }
  }
}

export default new GameService();
