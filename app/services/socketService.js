import constants from "./constants";

class socketService {

    constructor() {
        this.socket = io.connect(constants.serverUrl)
    }

    api(data) {
        return new Promise((res, rej) => {
            this.socket.emit('api', data, (response) => {
                if (!response) {
                    res();
                }
                else {
                    rej(response)
                }
            });
        });
    }
    joinRoom(isAdmin, roomId) {
        return new Promise((res, rej) => {
            this.socket.emit('joinRoom', { isAdmin, roomId }, (response) => {
                if (!response) {
                    res();
                }
                else {
                    rej(response)
                }
            });
        });
    }

    sendDataToClient(roomId, data, waitForResponse = true) {
        return new Promise((res, rej) => {
            this.socket.emit('msgToClient', { data, roomId }, (response) => {
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

    sendDataToAdmin(roomId, data, waitForResponse = true) {
        return new Promise((res, rej) => {
            this.socket.emit('msgToAdmin', { data, roomId }, (response) => {
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

    receiveDataFromClient(cb) {
        this.socket.on('msgFromClient', cb);
        return () => {
            this.socket.removeListener('msgFromClient', cb);
        }
    }

    receiveDataFromAdmin(cb) {
        this.socket.on('msgFromAdmin', cb);
        return () => {
            this.socket.removeListener('msgFromAdmin', cb);
        }
    }
}

export default new socketService();