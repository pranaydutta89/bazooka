import config from './configService';
class socketService {

    constructor() {
        this.socket = io.connect(config.serverUrl)
    }

    joinRoom(isAdmin) {
        const roomId = uuid()
        return new Promise((res, rej) => {
            this.socket.emit('joinRoom', { isAdmin, roomId }, (response) => {
                if (!response) {
                    res(roomId);
                }
                else {
                    rej(response)
                }
            })
        })
    }

    sendData() {

    }

    receiveDataAdmin(cb) {
        this.socket.on('messageToAdmin',cb);
        return () => {
            this.socket.removeListener('messageToAdmin',cb);
        }
    }
}

export default new socketService();