import { LitElement, html } from "lit-element";
import socketio from "../../../services/socketio";
import utilService from "../../../services/utilService";
import '../../common/tap/tap.component';
import router from '../../routes';
import '../../common/alert/alert.component';

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
      summaryMessage: { type: String },
      summaryMessageType: { type: String },

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
    this.summaryMessage = '';
    this.summaryMessageType = 'info'
    window.onbeforeunload = this.leaveGame.bind(this);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.leaveGame();
      }
    }, false);
  }

  firstUpdated() {
    this.joinRoom();
  }
  disconnectedCallback() {
    this.leaveGame(false);
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

      case 'tapSummary':
        this.tapDetails(msg.data);
        break;
    }
  }

  generateSummaryMessage(myTeamDetails, topTeamDetails, secondTeam) {
    if (topTeamDetails.teamName === this.team) {
      this.summaryMessageType = 'info';
      this.summaryMessage = `Your team is leading, second position is ${myTeamDetails.tapCount - secondTeam.tapCount} behind`;

    } else {
      this.summaryMessageType = 'warning';
      this.summaryMessage = `Your team is trailing with ${topTeamDetails.tapCount - myTeamDetails.tapCount} taps from leading team ${topTeamDetails.teamName}`;
    }

  }

  tapDetails(teamDetails) {
    if (this.isGameStarted) {
      teamDetails.sort((a, b) => b.tapCount - a.tapCount);
      const myTeam = teamDetails.find(r => r.teamName === this.team);
      this.generateSummaryMessage(myTeam, teamDetails[0], teamDetails[1])
    }
  }

  endGame() {
    this.isGameStarted = false;
  }
  async startingGame() {
    await import('../../common/gameStartCountdown/gameStartCountDown.component');
    this.isGameStarting = true;
  }

  async leaveGame(route = true) {
    await socketio.sendDataToAdmin(this.roomId, {
      event: 'userLeft',
      data: {
        id: this.userId
      }
    });
    if (route) {
      router.navigate('/');
    }
  }

  gameStarted() {
    this.isGameStarting = false;
    this.isGameStarted = true;
  }
  render() {

    return html`
    <css-ele></css-ele>
      <div class='row' style="margin-top:0.6rem">
    <div class='col' style='text-align:center'>
      <h5>Hello!! Player ${this.userName}</h5>
    </div>
      </div>
    <app-spinner .isStarted=${this.spinnerStarted}></app-spinner>
<app-alert .status=${this.alertStatus} positionFixed='true' keepOpen='true'
 .type=${this.alertType} .message=${this.alertMessage}></app-alert>

    ${this.isGameStarting ? html`<app-countdown @started=${this.gameStarted}></app-countdown>` : ''}
      ${this.isGameStarted ? html`<div>
        <app-tap @tapped=${this.userTapped}></app-tap>
        <app-alert status='show' keepOpen='true' .type=${this.summaryMessageType} positionFixed="true" .message=${this.summaryMessage}></app-alert>
      </div>` :
        html`<app-alert status='show' keepOpen='true' type='warning' message='Game not yet started'>`
      }
      <div class='row' style="margin-top:0.6rem">
    <div class='col'>
      <button type='button' class='btn btn-block btn-danger' @click=${this.leaveGame}>Leave Game</button>
    </div>
</div>
    `
  }
}

customElements.define('app-tapit-play', TapItPlay);