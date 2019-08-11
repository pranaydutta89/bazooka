import * as React from 'react';
import { IUser, IAdminState } from './interfaces';
// @ts-ignore
import { ProgressBar } from 'react-bootstrap';
import config from './config';
import * as io from 'socket.io-client';

export default class Admin extends React.Component {
    private socket: SocketIOClient.Socket = io.connect(config.serverUrl);
    public state: IAdminState;
    private gameOver = false;
    constructor(props: any) {
        super(props);
        this.state = {
            teams: {
                a: [],
                b: []
            },
            progress_a: 0,
            progress_b: 0,
            count_a: 0,
            count_b: 0,
            tapCount: 1000,
            teamWon: ''

        }
        this.init();
    }

    init() {
        this.userJoined();
        this.userTapped();
    }

    userTapped() {
        this.socket.on('userTapped', (data: IUser) => {
            if (!this.gameOver) {
                const { teams } = this.state;
                let user = teams.a.find(r => r.userID === data.userID);
                if (!user) {
                    user = teams.b.find(r => r.userID === data.userID);
                }

                if (user) {
                    user.tapCount += 1;
                    const count_a = teams.a.length !== 0 ? teams.a.map(r => r.tapCount).reduce((t, n) => t + n) : 0;
                    const count_b = teams.b.length !== 0 ? teams.b.map(r => r.tapCount).reduce((t, n) => t + n) : 0;
                    const progress_a = (count_a / this.state.tapCount) * 100;
                    const progress_b = (count_b / this.state.tapCount) * 100;
                    this.setState({ teams, progress_a, progress_b, count_a, count_b });


                    if (Math.floor(progress_a) >= 100) {
                        this.setState({ teamWon: 'a' });
                        this.gameOver = true;
                        return;
                    }

                    if (Math.floor(progress_b) >= 100) {
                        this.setState({ teamWon: 'b' });
                        this.gameOver = true;
                        return;
                    }

                }
            }
        });
    }

    userJoined() {
        this.socket.on('userJoined', (data: IUser) => {
            const { teams } = this.state;
            (teams[(data.team as 'a' | 'b')]).push({
                name: data.name,
                userID: data.userID,
                tapCount: 0
            })
            this.setState({ teams });
        })
    }


    render() {

        return (<>
            {this.state.teamWon === 'a' ? <div className="alert alert-success inputMar" role="alert">
                Team A won !!!
</div> : ''}
            {this.state.teamWon === 'b' ? <div className="alert alert-warning inputMar" role="alert">
                Team B won !!!
</div> : ''}
            <div className="row inputMar" >
                <div className="col-sm-2">Tap Count</div>
                <div className="col-sm-10">
                    <input type="number" className="form-control" onChange={(evt) => this.setState({ tapCount: evt.target.value })} value={this.state.tapCount} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-2">Team A -{this.state.count_a}</div>
                <div className="col-sm-10">
                    <ProgressBar variant="success" key={1} animated now={this.state.progress_a} />
                </div>
            </div>
            <div className="row">
                <div className="col-sm-2">Team B -{this.state.count_b}</div>
                <div className="col-sm-10">
                    <ProgressBar variant="warning" key={2} animated now={this.state.progress_b} />
                </div>
            </div>

            <div className="row">
                <div className="col-sm">
                    <h1>Team A</h1>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Tap Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.teams.a.sort((a, b) => b.tapCount - a.tapCount).map((element, idx) => {
                                    return (<tr key={idx}>
                                        <th scope="row">{idx + 1}</th>
                                        <td>{element.name}</td>
                                        <td>{element.tapCount || 0}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="col-sm">
                    <h1>Team B</h1>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Tap Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.teams.b.sort((a, b) => b.tapCount - a.tapCount).map((element, idx) => {
                                    return (<tr key={idx}>
                                        <th scope="row">{idx + 1}</th>
                                        <td>{element.name}</td>
                                        <td>{element.tapCount || 0}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </>);
    }

}