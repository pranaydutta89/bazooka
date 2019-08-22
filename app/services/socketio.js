import config from './configService';
class socketService {

    constructor() {
        this.socket = io.connect(config.serverUrl)
    }

    joinRoom(isAdmin, roomId) {
        return new Promise((res, rej) => {
            this.socket.emit('joinRoom', { isAdmin, roomId }, (response) => {
                if (!response) {
                    res(roomId);
                }
                else {
                    rej(response)
                }
            });
        });
    }

    sendDataToClient(data) {
        return new Promise((res, rej) => {
            this.socket.emit('msgToClient', data, (response) => {
                if (!response) {
                    res(roomId);
                }
                else {
                    rej(response)
                }
            });
        });
    }

    receiveDataAdmin(cb) {
        this.socket.on('messageToAdmin',cb);
        return () => {
            this.socket.removeListener('messageToAdmin',cb);
        }
    }

    receiveDataClient(cb) {
        this.socket.on('messageToAdmin', cb);
        return () => {
            this.socket.removeListener('messageToAdmin', cb);
        }
    }
}

export default new socketService();