import * as React from 'react';
import * as io from 'socket.io-client';
import config from './config';

export default class Game extends React.Component<{ name: string, team: string }>{

    private socket: SocketIOClient.Socket = io.connect(config.serverUrl);
    private userId: string = Math.random().toString(36).substring(7);
    constructor(props: any) {
        super(props);
        this.init();
    }

    init() {
        this.sendTeamDetails();
    }

    sendTeamDetails() {
        this.socket.emit('userJoined', { userID: this.userId, name: this.props.name, team: this.props.team })
    }

    sendTap() {
        this.socket.emit('userTapped', { userID: this.userId });
    }

    render() {
        return (<div className="row fullHeight">
            <div className="col-sm fullHeight tapHere" onClick={() => this.sendTap()}>
                <h1 className="tapHereText">Tap Anywhere in yellow area</h1>
            </div>
        </div>);
    }
}