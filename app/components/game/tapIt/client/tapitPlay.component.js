import { LitElement, html } from "lit-element";
import socketio from "../../../../services/socketio";
import utilService from "../../../../services/utilService";
import '../../../common/tap/tap.component';
import router from '../../../routes';

class TapItPlay extends LitElement {

  static get properties() {
    return {
      roomId: { type: String },
      team: { type: String },
      isGameStarted: { type: Boolean },
      isGameStarting: { type: Boolean },
      userName: { type: String },
      spinnerStarted: { type: String },
      alertStatus: { type: String },
      alertType: { type: String },
      alertMessage: { type: String },

    }
  }
  constructor() {
    super();
    this.listeners = [];
    this.isGameStarted = false;
    this.isGameStarting = false;
    this.spinnerStarted = 'hide';
    this.alertStatus = 'hide';
    this.alertType = 'error';
  }

  firstUpdated() {
    this.joinRoom();
  }
  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  async joinRoom() {

    try {
      await socketio.joinRoom(false, this.roomId);
      this.joinUser();
      this.listeners.push(socketio.receiveDataFromAdmin(this.receiveData.bind(this)));
    }
    catch (e) {
      this.changeAlertStatus('Room does not exist,logging out');
      setTimeout(() => {
        router.navigate('/')
      }, 3000);
    }
  }

  changeAlertStatus(message, status = 'show', type = 'error') {
    this.alertMessage = message;
    this.alertStatus = status;
    this.alertType = type;
  }
  async joinUser() {
    this.userId = utilService.generateUniqueBrowserId();
    const user = {
      id: this.userId,
      userName: this.userName,
      team: this.team
    }
    this.spinnerStarted = 'show';
    await socketio.sendDataToAdmin(this.roomId, {
      event: 'userJoined',
      data: user
    });
    this.spinnerStarted = 'hide';
  }

  userTapped() {
    socketio.sendDataToAdmin(this.roomId, {
      event: 'userTapped',
      data: {
        id: this.userId
      }
    }, false);
  }
  receiveData(msg) {
    switch (msg.event) {
      case 'startGame':
        this.startingGame();
        break;

      case 'endGame':
        this.endGame();
        break;
    }
  }

  endGame() {
    this.isGameStarted = false;
  }
  startingGame() {
    this.isGameStarting = true;
  }

  gameStarted() {
    this.isGameStarting = false;
    this.isGameStarted = true;
  }
  render() {

    return html`
    <css-ele></css-ele>
    <app-spinner isStarted=${this.spinnerStarted}></app-spinner>
<app-alert status=${this.alertStatus} positionFixed='true' keepOpen='true' type=${this.alertType} message=${this.alertMessage}></app-alert>
    ${this.isGameStarting ? html`<app-countdown @started=${this.gameStarted}></app-countdown>` : ''}
      ${this.isGameStarted ? html`<div>
        <app-tap @tapped=${this.userTapped}></app-tap>
      </div>` :
        html`<app-alert status='show' keepOpen='true' type='warning' message='Game not yet started'>`
      }
    `
  }
}

customElements.define('app-tapit-play', TapItPlay);