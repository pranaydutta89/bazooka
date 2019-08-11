import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Game from './game';
import { IAppState } from './interfaces';
import Admin from './admin';

class App extends React.Component {

    public state: IAppState;
    constructor(props: any) {
        super(props);
        this.state = {
            isTeamSelected: false,
            selectedTeam: '',
            name: ''
        }

    }

    selectedTeam(team: string) {
        if (this.state.name) {
            this.setState({ selectedTeam: team, isTeamSelected: true });
        }
        else {
            alert('Enter Name');
        }
    }

    selectTeamRender() {
        return (<>
            <div className="row inputMar">
                <div className="col-sm-12">
                    <input className="form-control" value={this.state.name} onChange={(evt) => this.setState({ name: evt.target.value })}
                        placeholder="Enter Name" />
                </div>
            </div>
            <div className="row">

                <div className="col">
                    <button type="button" className="btn btn-success btn-lg btn-block" onClick={() => this.selectedTeam('a')} >
                        Team A
</button>
                </div>

                <div className="col">
                    <button type="button" className="btn btn-warning btn-lg btn-block" onClick={() => this.selectedTeam('b')} >
                        Team B
</button>
                </div>
            </div>
        </>);
    }

    render() {
        return (<>
            {this.state.isTeamSelected ? <Game team={this.state.selectedTeam} name={this.state.name} /> : this.selectTeamRender()}
        </>)
    }
}

function getQueryStringValue(key: string) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
}

ReactDOM.render((<>{
    getQueryStringValue("name") ? <Admin /> : <App />
}
</>
), document.getElementById('init'));