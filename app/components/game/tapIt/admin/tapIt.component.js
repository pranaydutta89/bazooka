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
      data: { type: Object },
      spinnerStarted: { type: String },
      clientUrl: { type: String },
      userDetails: { type: Array },
      chartData: { type: Array },
      alertStatus: { type: String },
      alertType: { type: String },
      alertMessage: { type: String },
      gameStartCountDown: { type: Boolean },
      gameStartedFlag: { type: Boolean },
      gameTime: { type: Number }
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
  }

  async joinSocket() {
    this.spinnerStarted = 'show';
    this.roomId = uuid();
    await socketService.joinRoom(true, this.roomId);
    this.clientUrl = utilService.encryptClientUrl(constants.game.tapIt, this.roomId, this.data);
    this.spinnerStarted = 'hide';
    this.listeners.push(socketService.receiveDataFromClient(this.receiveData.bind(this)));
    this.alertMessage = 'Joined Room';
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
      this.alertStatus = 'show';
      this.alertMessage = `User ${userData.userName} Joined`;
    }
    else {
      //user already exists
    }
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
    this.chartData = chartData.map(r => r.value);
  }

  userTapped(data) {
    if (this.gameStartedFlag) {
      const user = this.userDetails.find(r => r.id === data.id);
      if (user) {
        user.tapCount += 1;
        this.userDetails = this.userDetails;
        this.checkTapCount();
        this.alertStatus = 'show';
        this.alertMessage = `User ${user.userName} Tapped`;
      }
      else {
        //user doesnt exist already exists
      }
    }
  }

  async startGame() {
    await socketService.sendDataToClient(this.roomId, {
      event: 'startGame'
    })
    this.gameStartCountDown = true;
  }

  gameStarted() {
    this.gameStartCountDown = false;
    this.gameStartedFlag = true;
  }

  gameEnded() {
    this.gameStartedFlag = false;
  }

  gameCountDown() {
    let counter = this.gameTime;
    this.alertStatus = 'show';
    this.alertType = 'info';

    var countdown = setInterval(() => {
      this.alertMessage = `Time left ${this.counter} seconds`
      counter--
      if (counter === 0) {
        this.alertMessage = `Game Over`;

        clearInterval(countdown);
        this.started();
      }
    }, 1000);
  }


  copyClientUrl() {
    const copyText = this.shadowRoot.getElementById("clientUrl");
    copyText.select();
    document.execCommand("copy");
    this.alertStatus = 'show';
    this.alertType = 'success';
    this.alertMessage = `Copied URL,share this to players`;
  }

  alertClosed() {
    this.alertStatus = 'hide';
  }
  render() {
    return html`
    <css-ele></css-ele>
    <app-spinner isStarted=${this.spinnerStarted}></app-spinner>
    <app-alert @close=${this.alertClosed} status=${this.alertStatus} type=${this.alertType} message=${this.alertMessage}></app-alert>
    ${this.gameStartCountDown ? html` <app-countdown @started=${this.gameStarted}></app-countdown>` : ''}
    <div>
     
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

    <div class="col-sm-1">
      <button type="button" class="btn btn-sm btn-danger">Reset</button>
    </div>
 
    </div>


    <app-chart-bar data=${JSON.stringify(this.chartData)}></app-chart-bar>

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