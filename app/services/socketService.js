import constants from "./constants";
import eventDispatch from "./eventDispatch";

class socketService {

    constructor() {
        this.socket = io.connect(constants.serverUrl)
    }

    api(data) {
        eventDispatch.triggerSpinner();
        return new Promise((res, rej) => {
            this.socket.emit('api', data, (response) => {
                if (response.type === 'success') {
                    res(response.data);
                }
                else {
                    eventDispatch.triggerAlert(response.data, 'error');
                    rej(response.data);
                }
            });
        }).finally(() => {
            eventDispatch.triggerSpinner(false);
        });
    }
    joinRoom(isAdmin, roomId) {
        eventDispatch.triggerSpinner();
        return new Promise((res, rej) => {
            this.socket.emit('joinRoom', { isAdmin, roomId }, (response) => {
                if (response.type === 'success') {
                    res(response.data);
                }
                else {
                    eventDispatch.triggerAlert(response.data, 'error');
                    rej(response.data)
                }
            });
        }).finally(() => {
            eventDispatch.triggerSpinner(false);
        });
    }

    sendDataToClient(roomId, data, waitForResponse = true) {

        if (waitForResponse) {
            eventDispatch.triggerSpinner();
        }
        return new Promise((res, rej) => {
            this.socket.emit('msgToClient', { data, roomId }, (response) => {
                if (waitForResponse) {
                    if (response.type === 'success') {
                        res(roomId);
                    }
                    else {
                        eventDispatch.triggerAlert(response.data,  'error');
                        rej(response.data)
                    }
                }
                else {
                    res();
                }
            });
        }).finally(() => {
            if (waitForResponse) {
                eventDispatch.triggerSpinner(false);
            }
        });
    }

    sendDataToAdmin(roomId, data, waitForResponse = true) {
        if (waitForResponse) {
            eventDispatch.triggerSpinner();
        }
        return new Promise((res, rej) => {
            this.socket.emit('msgToAdmin', { data, roomId }, (response) => {
                if (waitForResponse) {
                    if (response.type === 'success') {
                        res(roomId);
                    }
                    else {
                        eventDispatch.triggerAlert(response.data, 'error');
                        rej(response.data)
                    }
                }
                else {
                    res();
                }
            });
        }).finally(() => {
            if (waitForResponse) {
                eventDispatch.triggerSpinner(false);
            }
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