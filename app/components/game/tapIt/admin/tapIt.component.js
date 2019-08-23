import { LitElement, html } from "lit-element";
import '../../../common/charts/bar/bar.component';
import socketService from '../../../../services/socketio';
import '../../../common/spinner/spinner.component';
import utilService from '../../../../services/utilService';
import constants from '../../../../services/constants';
import '../../../common/alert/alert.component';
import '../../../common/gameStartCountdown/gameStartCountDown.component';
class TapIt extends LitElement {

  static get properties() {
    return {
      gameData: { type: Object },
      spinnerStarted: { type: String },
      clientUrl: { type: String },
      userDetails: { type: Array },
      chartData: { type: Array },
      alertStatus: { type: String },
      alertType: { type: String },
      alertMessage: { type: String },
      gameStartCountDown: { type: Boolean },
      gameStartedFlag: { type: Boolean },
      gameTime: { type: Number },
      gameSummaryMsg: { type: String }
    }
  }

  constructor() {
    super();
    this.alertStatus = 'hide'
    this.alertType = 'info';
    this.gameTime = 30;
    this.clientUrl = "";
    this.listeners = [];
    this.userDetails = [];
    this.chartData = [];
    this.gameStartCountDown = false;
    this.gameStartedFlag = false;
    this.teamColor = {};
    this.joinSocket();
    this.gameSummaryMsg = 'Game not yet Started,copy and share the below link to players';
    this.chartOptions = {
      title: 'Live Tap Count',
      chartArea: { width: '100%' }, hAxis: {
        title: 'Teams Total Tap count',
        minValue: 0
      },
      vAxis: {
        title: 'Teams'
      },
    };
  }

  async joinSocket() {
    this.spinnerStarted = 'show';
    this.roomId = uuid();
    await socketService.joinRoom(true, this.roomId);
    this.gameData.team.forEach(r => {
      this.teamColor[r] = utilService.pickColor(r);
    });
    this.clientUrl = utilService.encryptClientUrl(constants.game.tapIt, this.roomId, this.gameData);
    this.spinnerStarted = 'hide';
    this.listeners.push(socketService.receiveDataFromClient(this.receiveData.bind(this)));
    this.setAlert('Joined Room');
  }

  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  receiveData(msg) {
    switch (msg.event) {
      case 'userJoined':
        this.userJoined(msg.data);
        break;
      case 'userTapped':
        this.userTapped(msg.data);
        break;
      case 'userLeft':
        this.userLeft(msg.data);
        break;
    }
  }

  userLeft(userData) {
    this.userDetails.splice(this.userDetails.findIndex(r => r.id === userData.id), 1);
    this.userDetails = JSON.parse(JSON.stringify(this.userDetails));
  }

  userJoined(userData) {
    const user = this.userDetails.find(r => r.id === userData.id);
    if (!user) {
      this.userDetails.push({ ...userData, ...{ tapCount: 0 } });
      this.checkTapCount();
      this.setAlert(`User ${userData.userName} Joined`)
    }
    else {
      //user already exists
    }
  }

  resetData() {
    this.userDetails.forEach(r => r.tapCount = 0);
    this.checkTapCount();
  }

  checkTapCount() {
    const teams = this.userDetails.map(r => r.team).filter((value, idx, self) => {
      return value && self.indexOf(value) === idx;
    });

    const chartData = [];
    teams.forEach(r => {

      chartData.push({
        team: r,
        value: [r,
          this.userDetails.filter(y => y.team === r).map(z => z.tapCount).reduce((t, n) => t + n)]
      });
    });

    const val = chartData.map(r => r.value);
    val.forEach(r => {
      r.push(this.teamColor[r[0]], r[0]);
    });
    this.chartData = val;
  }

  userTapped(data) {
    if (this.gameStartedFlag) {
      const user = this.userDetails.find(r => r.id === data.id);
      if (user) {
        user.tapCount += 1;
        this.userDetails = this.userDetails;
        this.checkTapCount();
        this.setAlert(`User ${user.userName} Tapped`);
      }
      else {
        //user doesnt exist already exists
      }
    }
  }

  setAlert(message, status = 'show', type = 'info') {
    this.alertMessage = message;
    this.alertStatus = status;
    this.alertType = type;
  }

  async startGame() {
    if (this.userDetails.length > 1) {
      await socketService.sendDataToClient(this.roomId, {
        event: 'startGame'
      });
      this.gameStartCountDown = true;
    }
    else {
      this.setAlert('Minimum 2 users required to start the game.', 'show', 'error');
    }
  }

  gameStarted() {
    this.gameStartCountDown = false;
    this.gameStartedFlag = true;
    this.gameCountDown();

  }

  gameEnded() {
    socketService.sendDataToClient(this.roomId, { event: 'endGame' })
    this.gameStartedFlag = false;
    let message = '';
    this.chartData.forEach(r => {
      message += `Team ${r[0]} tap count ${r[1]},`
    });
    this.gameSummaryMsg = 'Game Summary: ' + message;
  }

  gameCountDown() {
    let counter = this.gameTime;
    var countdown = setInterval(() => {
      this.gameSummaryMsg = `Time left ${counter} seconds`
      counter--
      if (counter === 0) {
        clearInterval(countdown);
        this.gameEnded();
      }
    }, 1000);
  }


  copyClientUrl() {
    const copyText = this.shadowRoot.getElementById("clientUrl");
    copyText.select();
    document.execCommand("copy");
    this.setAlert('Copied URL,share this to players', 'show', 'success');
  }

  alertClosed() {
    this.setAlert(null, 'hide', 'info');
  }
  render() {
    return html`
    <css-ele></css-ele>
    <app-spinner isStarted=${this.spinnerStarted}></app-spinner>
    <app-alert positionFixed='true' @close=${this.alertClosed} 
    status=${this.alertStatus} type=${this.alertType} message=${this.alertMessage}></app-alert>
    ${this.gameStartCountDown ? html` <app-countdown @started=${this.gameStarted}></app-countdown>` : ''}
    <div>

      <div class='row'>
      <div class='col'>
        <h3>Room { ${this.gameData.roomName} }</h3>
      </div>

      </div>

       <app-alert keepOpen='true' status='show' type='info' message=${this.gameSummaryMsg}></app-alert>


    <div class='row'>
      <div class='col'>
        <div class="input-group mb-3">
  <input type="text" class="form-control" id='clientUrl' .value=${this.clientUrl} readonly>
  <div class="input-group-append" style="cursor:pointer">
    <span class="input-group-text" id="basic-addon2" @click=${this.copyClientUrl}>Click to copy</span>
  </div>
</div>
      </div>
    </div>


    <div class='row' style="margin-bottom:0.6rem">
           <label for="colFormLabelSm" class="col-2 col-form-label col-form-label text-truncate">Play Time(Seconds)</label>
    <div class="col-6">
      <input type="number" .value=${this.gameTime} .disabled=${this.gameStartedFlag} @change=${(evt) => this.gameTime = evt.target.value}
       class="form-control form-control-xs" id="colFormLabelSm" placeholder="Enter Seconds">
    </div>

    <div class="col-2">
      <button type="button" @click=${this.startGame} class="btn btn-block btn-success">Start</button>
    </div> 
    <div class="col-2">
      <button type="button" @click=${this.resetData} class="btn btn-block btn-danger">Reset</button>
    </div> 
    </div>


    <app-chart-bar xLabel='Team tap Count' options=${JSON.stringify(this.chartOptions)} teamInfo=${JSON.stringify(this.teamColor)} yLabel='Teams' data=${JSON.stringify(this.chartData)}></app-chart-bar>

    ${
      this.userDetails.length === 0 ?
        html`<app-alert status='show' keepOpen='true' type='info' message='No Players joined yet'></app-alert>` :
        html`
<div class='row'>
      <div class='col'>
          <table class="table table-sm table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Team</th>
              <th scope="col">Tap Count</th>
            </tr>
          </thead>
          <tbody>
            ${this.userDetails.sort((a, b) => b.tapCount - a.tapCount).map((r, idx) => {
          return html`
       <tr>
      <th scope="row">${idx + 1}</th>
      <td>${r.userName}</td>
       <td>${r.team}</td>
        <td>${r.tapCount}</td>

    </tr>
      `
        })}

          </tbody>
        </table>
      </div>
  </div>`
      }
    </div>
    `
  }

}

customElements.define('app-tapit', TapIt);