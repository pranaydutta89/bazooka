import { LitElement, html } from 'lit-element';
import graphStats from './templates/graphStats.template';
import userInfo from './templates/userInfo.template';
import socketService from '../../../../services/socketService';
import constants from '../../../../services/constants';
import '../../../common/charts/gauge/gauge.component';
import eventDispatch from '../../../../services/eventDispatch';
import '../../../common/playTypes/playTypeSelection/playTypeSelection.component';
class TugOfWarAdmin extends LitElement {
  static get properties() {
    return {
      gameData: { type: Object },
      userDetails: { type: Array },
      tapDifference: { type: Number },
      gameSummaryMsg: { type: String },
      currentDifference: { type: Number },
      currentWidth: { type: Number },
      isGameStarting: { type: Boolean },
      isGameStarted: { type: Boolean }
    };
  }

  constructor() {
    super();

    this.listeners = [];
    this.userDetails = [];
    this.gaugeOption = {
      redFrom: 10,
      redTo: 15,
      yellowFrom: 5,
      yellowTo: 10,
      minorTicks: 1,
      min: 0,
      max: 15
    };
    this.init();
  }

  firstUpdated() {
    this.listeners.push(socketService.receiveDataFromClient(this.receiveData.bind(this)));
  }

  receiveData(msg) {
    switch (msg.event) {
      case constants.socketDataEvents.userJoined:
        this.userJoined(msg.data);
        break;
      case constants.socketDataEvents.userTapped:
        this.userTapped(msg.data);
        break;
      case constants.socketDataEvents.userLeft:
        this.userLeft(msg.data);
        break;
    }
  }

  userLeft(userData) {
    const idx = this.userDetails.findIndex(r => r.id === userData.id);
    if (idx != -1) {
      const user = this.userDetails.find(r => r.id === userData.id);
      this.userDetails.splice(idx, 1);
      this.userDetails = JSON.parse(JSON.stringify(this.userDetails));
      this.requestUpdate();
      eventDispatch.triggerAlert(`User ${user.userName} left`, 'error');
    }
  }

  userTapped(userData) {
    if (this.isGameStarted) {
      const currentTimestamp = Date.now();
      const user = this.userDetails.find(r => r.id === userData.id);
      eventDispatch.triggerAlert(`${user.userName} Tapped..`);
      user.tapCount += 1;
      user.tapSpeed = 1000 / (currentTimestamp - user.lastTapTimestamp);
      user.lastTapTimestamp = currentTimestamp;
      const teamBlueCount = this.userDetails
        .filter(r => r.team === constants.dualTeam.teamBlue)
        .map(z => z.tapCount)
        .reduce((t, n) => t + n);

      const teamRedCount = this.userDetails
        .filter(r => r.team === constants.dualTeam.teamRed)
        .map(z => z.tapCount)
        .reduce((t, n) => t + n);

      this.currentDifference = teamBlueCount - teamRedCount;

      if (Math.abs(this.currentDifference) >= this.tapDifference) {
        this.endGame();
      } else {
        this.currentWidth = (Math.abs(this.currentDifference) / this.tapDifference) * 100;
        this.tapSummary(teamBlueCount, teamRedCount);
      }
    }
  }

  tapSummary(blueCount, redCount) {
    if (this.currentDifference < 0) {
      this.gameSummaryMsg = `${constants.dualTeam.teamRed} is leading with ${this.currentDifference} taps`;
    } else {
      this.gameSummaryMsg = `${constants.dualTeam.teamBlue} is leading with ${this.currentDifference} taps`;
    }

    socketService.sendDataToClient(
      this.gameData.roomId,
      {
        event: constants.socketDataEvents.summary,
        data: {
          [constants.dualTeam.teamBlue]: blueCount,
          [constants.dualTeam.teamRed]: redCount
        }
      },
      false
    );
  }

  userJoined(userData) {
    const user = this.userDetails.find(r => r.id === userData.id);
    if (!user) {
      this.userDetails.push({ ...userData, ...{ tapCount: 0, lastTapTimestamp: Date.now(), tapSpeed: 0 } });
      this.requestUpdate();
      eventDispatch.triggerAlert(`User ${userData.userName} Joined`);
    } else {
      eventDispatch.triggerAlert(`User ${userData.userName} already joined`);
    }
  }

  async startGame() {
    if (!this.isGameStarted) {
      await import('../../../common/countdown/countDown.component');
      if (constants.devMode || this.userDetails.length > 1) {
        await socketService.sendDataToClient(this.gameData.roomId, {
          event: constants.socketDataEvents.startGame,
          data: {
            playType: this.currentPlayType
          }
        });
        this.isGameStarting = true;
      } else {
        eventDispatch.triggerAlert('Minimum 2 users required to start the game.', 'error');
      }
    } else {
      eventDispatch.triggerAlert('Game already in progress', 'error');
    }
  }
  endGame() {
    this.isGameStarted = false;
    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.endGame
    });
    if (this.currentDifference > 0) {
      this.gameSummaryMsg = `${constants.dualTeam.teamBlue} won`;
    } else {
      this.gameSummaryMsg = `${constants.dualTeam.teamRed} won`;
    }
  }
  resetGame() {
    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.endGame
    });
    this.userDetails.forEach(r => {
      r.tapCount = 0;
      r.lastTapTimestamp = Date.now();
      r.tapSpeed = 0;
    });
    this.init();
  }
  gameStarted() {
    this.isGameStarted = true;
    this.isGameStarting = false;
  }

  init() {
    this.tapDifference = 30;
    this.currentWidth = 0;
    this.currentDifference = 0;
    this.gameSummaryMsg = 'Game not yet Started';
    this.isGameStarted = false;
    this.isGameStarted = false;
  }

  render() {
    return html`
      <css-ele></css-ele>
      ${this.isGameStarting
        ? html`
            <app-countdown @ended=${this.gameStarted}></app-countdown>
          `
        : ''}
      <app-alert keepOpen="true" .message=${this.gameSummaryMsg}></app-alert>
      <form
        @submit=${evt => {
          this.startGame();
          evt.preventDefault();
        }}
      >
        <div style="margin-bottom:0.6rem">
          <app-play-selection
            @select=${evt => {
              this.currentPlayType = evt.detail;
            }}
          ></app-play-selection>
        </div>
        <div class="row" style="margin-bottom:0.6rem">
          <div class="col-sm-2">
            <h6>Tap Difference</h6>
          </div>
          <div class="col-sm-6">
            <input
              type="number"
              required
              min="10"
              class="form-control"
              max="100"
              .value=${this.tapDifference}
              @change=${evt => (this.tapDifference = evt.target.value)}
            />
          </div>
          <div class="col-sm-2">
            <button type="submit" class="btn btn-block btn-info">Start</button>
          </div>
          <div class="col-sm-2">
            <button type="button" @click=${this.resetGame} class="btn btn-block btn-warning">Reset</button>
          </div>
        </div>
      </form>
      <div style="margin-bottom:0.6rem">
        ${graphStats(this)}
      </div>
      <div>
        ${userInfo(this)}
      </div>
    `;
  }
}

customElements.define('app-tugofwar-admin', TugOfWarAdmin);
