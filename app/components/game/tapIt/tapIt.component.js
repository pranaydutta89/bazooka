import { LitElement, html } from "lit-element";
import '../../common/charts/bar/bar.component';
import socketService from '../../../services/socketio';
import '../../common/spinner/spinner.component';
import utilService from '../../../services/utilService';
import constants from '../../../services/constants';
class TapIt extends LitElement {

  static get properties() {
    return {
      data: { type: Object },
      spinnerStarted: { type: String },
      clientUrl: { type: String }
    }
  }

  constructor() {
    super();
    this.clientUrl = "";
    this.listeners = []
    this.joinSocket();
  }

  async joinSocket() {
    this.spinnerStarted = 'show';
    const roomId = await socketService.joinRoom(true);
    this.clientUrl = utilService.encryptClientUrl(constants.game.tapIt, roomId, this.data);
    this.spinnerStarted = 'hide';
    this.listeners.push(socketService.receiveData('tapItUserTapped', this.userTapped.bind(this)));
  }

  disconnectedCallback() {
    this.listeners.forEach(r = r());
  }

  async userTapped(msg) {

  }


  copyClientUrl() {

    const copyText = this.shadowRoot.getElementById("clientUrl");
    copyText.select();
    this.shadowRoot.execCommand("copy");
  }

  render() {
    return html`
    <css-ele></css-ele>
    <app-spinner isStarted=${this.spinnerStarted}></app-spinner>
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


    <app-chart-bar></app-chart-bar>

    <div class='row'>
      <div class='col'>
      <h3>Leaders</h3>
      </div>
    </div>

<div class='row'>
      <div class='col'>
          <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Team</th>
              <th scope="col">Tap Count</th>
            </tr>
          </thead>
          <tbody>
            ${this.team.map((name, idx) => {
      return html`
       <tr>
      <th scope="row">${idx + 1}</th>
      <td>${name}</td>
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