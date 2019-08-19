import io from 'socket.io-client';
class socketService {

    constructor() {
        this.socket = io.connect(config.serverUrl)
    }

    createRoom() {

    }

    sendData() {

    }
}

export default new socketService();