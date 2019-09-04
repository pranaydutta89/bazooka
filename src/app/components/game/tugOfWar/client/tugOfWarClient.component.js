import { LitElement, html } from 'lit-element';
import socketService from '../../../../services/socketService';
import '../../../common/tap/tap.component';
import '../../../common/alert/alert.component';
import constants from '../../../../services/constants';
import eventDispatch from '../../../../services/eventDispatch';
import gameService from '../../../../services/gameService';

class TugOfWarClient extends LitElement {
  static get properties() {
    return {
      userId: { type: String },
      team: { type: String },
      gameData: { type: Object },
      isGameStarted: { type: Boolean },
      isGameStarting: { type: Boolean },
      userName: { type: String }
    };
  }
  constructor() {
    super();
    this.listeners = [];
    this.isGameStarted = false;
    this.isGameStarting = false;
  }

  firstUpdated() {
    this.listeners.push(socketService.receiveDataFromAdmin(this.receiveData.bind(this)));
  }
  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  userTapped() {
    socketService.sendDataToAdmin(
      this.gameData.roomId,
      {
        event: constants.socketDataEvents.userTapped,
        data: {
          id: this.userId
        }
      },
      false
    );
  }
  receiveData(msg) {
    switch (msg.event) {
      case constants.socketDataEvents.startGame:
        this.startingGame();
        break;

      case constants.socketDataEvents.endGame:
        this.endGame();
        break;

      case constants.socketDataEvents.summary:
        this.tapDetails(msg.data);
        break;
    }
  }

  tapDetails(teamDetails) {
    if (this.isGameStarted) {
      if (teamDetails[constants.dualTeam.teamRed] > teamDetails[constants.dualTeam.teamBlue]) {
        if (this.team === constants.dualTeam.teamRed) {
          eventDispatch.triggerAlert(
            `Your team is ahead with ${teamDetails[constants.dualTeam.teamRed] -
              teamDetails[constants.dualTeam.teamBlue]} taps`,
            'success'
          );
        } else {
          eventDispatch.triggerAlert(
            `Your team is trailing with ${teamDetails[constants.dualTeam.teamRed] -
              teamDetails[constants.dualTeam.teamBlue]} taps`,
            'error'
          );
        }
      } else {
        if (this.team === constants.dualTeam.teamBlue) {
          eventDispatch.triggerAlert(
            `Your team is ahead with ${teamDetails[constants.dualTeam.teamBlue] -
              teamDetails[constants.dualTeam.teamRed]} taps`,
            'success'
          );
        } else {
          eventDispatch.triggerAlert(
            `Your team is trailing with ${teamDetails[constants.dualTeam.teamBlue] -
              teamDetails[constants.dualTeam.teamRed]} taps`,
            'error'
          );
        }
      }
    }
  }

  endGame() {
    this.isGameStarted = false;
  }
  async startingGame() {
    await import('../../common/countdown/countDown.component');
    this.isGameStarting = true;
  }

  gameStarted() {
    this.isGameStarting = false;
    this.isGameStarted = true;
  }
  render() {
    return html`
      <css-ele></css-ele>
      <div class="row" style="margin-top:0.6rem">
        <div class="col" style="text-align:center">
          <h5>Hello!! Player ${this.userName}</h5>
        </div>
      </div>
      ${this.isGameStarting
        ? html`
            <app-countdown @ended=${this.gameStarted}></app-countdown>
          `
        : ''}
      ${this.isGameStarted
        ? html`
            <div>
              <app-tap @tapped=${this.userTapped}></app-tap>
            </div>
          `
        : html`
            <app-alert status="show" keepOpen="true" type="warning" message="Game not yet started"></app-alert>
          `}
      <div class="row" style="margin-top:0.6rem">
        <div class="col">
          <button
            type="button"
            class="btn btn-block btn-danger"
            @click=${() => gameService.leaveGame(this.gameData.roomId, this.userId)}
          >
            Leave Game
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('app-tugofwar-client', TugOfWarClient);
