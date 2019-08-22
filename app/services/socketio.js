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

    sendDataToClient(data, waitForResponse = true) {
        return new Promise((res, rej) => {
            this.socket.emit('msgToClient', data, (response) => {
                if (waitForResponse) {
                    if (!response) {
                        res(roomId);
                    }
                    else {
                        rej(response)
                    }
                }
                else {
                    res();
                }
            });
        });
    }

    sendDataToAdmin(data, waitForResponse = true) {
        return new Promise((res, rej) => {
            this.socket.emit('msgToAdmin', data, (response) => {
                if (waitForResponse) {
                    if (!response) {
                        res(roomId);
                    }
                    else {
                        rej(response)
                    }
                }
                else {
                    res();
                }
            });
        });
    }

    receiveDataAdmin(cb) {
        this.socket.on('messageToAdmin', cb);
        return () => {
            this.socket.removeListener('messageToAdmin', cb);
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