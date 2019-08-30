import constants from "./constants";

class socketService {

    constructor() {
        this.socket = io.connect(constants.serverUrl)
    }

    api(data) {
        return new Promise((res, rej) => {
            this.socket.emit('api', data, (response) => {
                if (response.type === 'success') {
                    res(response.data);
                }
                else {
                    rej(response.data);
                }
            });
        });
    }
    joinRoom(isAdmin, roomId) {
        return new Promise((res, rej) => {
            this.socket.emit('joinRoom', { isAdmin, roomId }, (response) => {
                if (response.type === 'success') {
                    res(response.data);
                }
                else {
                    rej(response.data)
                }
            });
        });
    }

    sendDataToClient(roomId, data, waitForResponse = true) {
        return new Promise((res, rej) => {
            this.socket.emit('msgToClient', { data, roomId }, (response) => {
                if (waitForResponse) {
                    if (response.type === 'success') {
                        res(roomId);
                    }
                    else {
                        rej(response.data)
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
                    if (response.type === 'success') {
                        res(roomId);
                    }
                    else {
                        rej(response.data)
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