import { LitElement, html } from "lit-element";
import '../../common/charts/bar/bar.component';
import socketService from '../../../services/socketio';
import '../../common/spinner/spinner.component';
import utilService from '../../../services/utilService';
import constants from '../../../services/constants';
import '../../common/alert/alert.component';
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
      alertMessage: { type: String }
    }
  }

  constructor() {
    super();
    this.alertStatus = 'hide'
    this.alertType = 'info';
    this.clientUrl = "";
    this.listeners = [];
    this.userDetails = [];
    this.chartData = [];
    this.joinSocket();
  }

  async joinSocket() {
    this.spinnerStarted = 'show';
    const roomId = await socketService.joinRoom(true);
    this.clientUrl = utilService.encryptClientUrl(constants.game.tapIt, roomId, this.data);
    this.spinnerStarted = 'hide';
    this.listeners.push(socketService.receiveDataAdmin('tapItUserTapped', this.receiveData.bind(this)));
    this.alertMessage = 'Joined Room';
  }

  disconnectedCallback() {
    this.listeners.forEach(r = r());
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
      this.alertMessage = `User ${userData.name} Joined`;
    }
    else {
      //user already exists
    }
  }

  checkTapCount() {
    const teams = this.userDetails.map(r => r.team).filter((value, idx, self) => {
      return self.indexOf(value) === idx;
    });

    const chartData = [];
    teams.forEach(r => {

      chartData.push({
        team: r,
        value: [r,
          this.userDetails.filter(y => y.team === x).map(z => z.tapCount).reduce((t, n) => t + n)]
      });
    });

    chartData.sort((a, b) => a.team > b.team)
    this.chartData = chartData.map(r => r.value);
  }

  userTapped(data) {
    const user = this.userDetails.find(r => r.id === data.id);
    if (user) {
      user.tapCount += 1;
      this.userDetails = this.userDetails;
      this.checkTapCount();
      this.alertStatus = 'show';
      this.alertMessage = `User ${userData.name} Tapped`;
    }
    else {
      //user doesnt exist already exists
    }
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
      <td>${r.name}</td>
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