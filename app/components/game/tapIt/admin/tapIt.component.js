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
    this.joinSocket();
    this.gameSummaryMsg = 'Game not yet Started,copy and share the below link to players';
  }

  async joinSocket() {
    this.spinnerStarted = 'show';
    this.roomId = uuid();
    await socketService.joinRoom(true, this.roomId);
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
    }
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

    chartData.sort((a, b) => a.team > b.team)
    const val = chartData.map(r => r.value);
    val.forEach(r => {
      r.push(utilService.randomHexColor());
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
      this.setAlert('Minimum 2 users required to start the game.',null,'error');
    }
  }

  gameStarted() {
    this.gameStartCountDown = false;
    this.gameStartedFlag = true;
    this.gameCountDown();

  }

  gameEnded() {
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
        <h3>${this.gameData.roomName}</h3>
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

    <div class='row'>
      <div class='col' style="text-align:center">
      <h5>Game Info</h5>
      </div>
    </div>

    <div class='row'>
           <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label-sm">Play Time</label>
    <div class="col-sm-6">
      <input type="number" .value=${this.gameTime} @change=${(evt) => this.gameTime = evt.target.value}
       class="form-control form-control-sm" id="colFormLabelSm" placeholder="Enter Seconds">
    </div>

    <div class="col-sm-1">
      <button type="button" @click=${this.startGame} class="btn btn-sm btn-success">Start</button>
    </div> 
    </div>


    <app-chart-bar xLabel='Team tap Count' yLabel='Teams' data=${JSON.stringify(this.chartData)}></app-chart-bar>

    <div class='row'>
      <div class='col' style="text-align:center">
      <h5>Players Joined (${this.userDetails.length})</h5>
      </div>
    </div>

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
  </div>

    </div>
    `
  }

}

customElements.define('app-tapit', TapIt);