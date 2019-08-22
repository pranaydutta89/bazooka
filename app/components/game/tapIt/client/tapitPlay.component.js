import { LitElement, html } from "lit-element";
import socketio from "../../../../services/socketio";
import utilService from "../../../../services/utilService";

class TapItPlay extends LitElement {

  static get properties() {
    return {
      roomId: { type: String },
      team: { type: String },
      isGameStarted: { type: Boolean },
      name: { type: String },
      spinnerStarted: { type: String }

    }
  }
  constructor() {
    super();
    this.listeners = [];
    this.isGameStarted = false;
    this.spinnerStarted = 'hide';
    this.joinRoom();
  }

  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  async joinRoom() {
    await socketio.joinRoom(false, this.roomId);
    this.joinUser();
    this.listeners.push(socketio.receiveDataClient(this.receiveData.bind(this)));
  }

  async joinUser() {
    this.userId = utilService.generateUniqueBrowserId();
    const user = {
      id: this.userId,
      name: this.name
    }
    this.spinnerStarted = 'show';
    await socketio.sendDataToAdmin({
      event: 'userJoined',
      data: user
    });
    this.spinnerStarted = 'hide';
  }

  userTapped() {
    socketio.sendDataToAdmin({
      event: 'userTapped',
      data: {
        id: this.userId
      }
    }, false);
  }
  receiveData(msg) {
    switch (msg.event) {
      case 'startGame':
        this.startGame(msg.data);
        break;
    }
  }

  startGame() {
    this.isGameStarted = true;
  }

  gameStarted() {
    this.isGameStarted = false;
  }
  render() {

    return html`
    <css-ele></css-ele>
    <app-spinner isStarted=${this.spinnerStarted}></app-spinner>

    ${this.isGameStarted ? html`<app-countdown @started=${this.gameStarted}></app-countdown>` : ''}
      <div>
         <div class="row">
           <div class="col">
             <div @click=${this.userTapped}>
             <h1>Tap Anywhere in yellow</h1>
             </div>
           </div>
         </div>
      </div>
    `
  }
}

customElements.define('app-tapit-play', TapItPlay);