import * as React from 'react';
import { IUser, IAdminState } from './interfaces';
// @ts-ignore
import RTChart from 'react-rt-chart';
import config from './config';
import * as io from 'socket.io-client';

export default class Admin extends React.Component {
    private socket: SocketIOClient.Socket = io.connect(config.serverUrl);
    public state: IAdminState;
    constructor(props: any) {
        super(props);
        this.state = {
            teams: {
                a: [],
                b: []
            },
            difference: {
                timeStamp: Date.now(),
                count_a: 0,
                count_b: 0
            }
        }
        this.init();
    }

    init() {
        this.userJoined();
        this.userTapped();
    }

    userTapped() {
        this.socket.on('userTapped', (data: IUser) => {
            const { teams } = this.state;
            let user = teams.a.find(r => r.userID === data.userID);
            if (!user) {
                user = teams.b.find(r => r.userID === data.userID);
            }

            if (user) {
                user.tapCount += 1;
                const count_a = teams.a.map(r => r.tapCount).reduce(r => r);
                const count_b = teams.b.map(r => r.tapCount).reduce(r => r);
                const difference = {
                    timeStamp: Date.now(),
                    count_a,
                    count_b
                }
                this.setState({ teams, difference });
            }
        })
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
            <div className="row">
                <div className="col-xs-6">
                    <h1>Team A</h1>
                    <table className="tabel table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">User Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Tap Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.teams.a.map((element, idx) => {
                                    return (<tr key={idx}>
                                        <th scope="row">{idx}</th>
                                        <td>{element.userID}</td>
                                        <td>{element.name}</td>
                                        <td>{element.tapCount || 0}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>

                <div className="col-xs-6">
                    <h1>Team B</h1>
                    <table className="tabel table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">User Id</th>
                                <th scope="col">Name</th>
                                <th scope="col">Tap Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.state.teams.b.map((element, idx) => {
                                    return (<tr key={idx}>
                                        <th scope="row">{idx}</th>
                                        <td>{element.userID}</td>
                                        <td>{element.name}</td>
                                        <td>{element.tapCount || 0}</td>
                                    </tr>);
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="row">
                {/* <RTChart
                    fields={['count_a', 'count_b']}
                    data={this.state.difference} /> */}

            </div>
        </>)
    }

}