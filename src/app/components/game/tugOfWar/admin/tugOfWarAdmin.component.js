import { LitElement, html } from 'lit-element';
import graphStats from './templates/graphStats.template';
import userInfo from './templates/userInfo.template';
import socketService from '../../../../services/socketService';
import constants from '../../../../services/constants';
import '../../../common/charts/gauge/gauge.component';
import eventDispatch from '../../../../services/eventDispatch';
class TugOfWarAdmin extends LitElement {
  static get properties() {
    return {
      gameData: { type: Object },
      userDetails: { type: Array },
      tapDifference: { type: Number },
      gameSummaryMsg: { type: String },
      currentDifference: { type: Number },
      currentWidth: { type: Number }
    };
  }

  constructor() {
    super();

    this.listeners = [];
    this.userDetails = [];
    this.gaugeOption = {
      redFrom: 11,
      redTo: 20,
      yellowFrom: 5,
      yellowTo: 10,
      minorTicks: 1,
      min: 0,
      max: 20
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

  userTapped(userId) {
    const currentTimestamp = Date.now();
    const user = this.userDetails.find(r => r.id === userId);
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
    this.currentWidth = (Math.abs(this.currentDifference) / this.tapDifference) * 100;
    this.tapSummary(teamBlueCount, teamRedCount);
  }

  tapSummary(blueCount, redCount) {
    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.summary,
      data: {
        [constants.dualTeam.teamBlue]: blueCount,
        [constants.dualTeam.teamRed]: redCount
      }
    });
  }

  userJoined(userData) {
    const user = this.userDetails.find(r => r.id === userData.id);
    if (!user) {
      this.userDetails.push({ ...userData, ...{ tapCount: 0, lastTapTimestamp: Date.now() } });
      eventDispatch.triggerAlert(`User ${userData.userName} Joined`);
    } else {
      eventDispatch.triggerAlert(`User ${userData.userName} already joined`);
    }
  }

  startGame() {}

  resetGame() {}

  init() {
    this.tapDifference = 30;
    this.currentWidth = 0;
    this.currentDifference = 0;
    this.gameSummaryMsg = 'Game not yet Started';
  }

  render() {
    return html`
      <css-ele></css-ele>
      <form
        $submit=${evt => {
          this.startGame();
          evt.preventDefault();
        }}
      >
        <div class="row">
          <div class="col-sm-2">
            <h6>Tap Difference</h6>
          </div>
          <div class="col-sm-4">
            <input
              type="number"
              required
              min="10"
              max="100"
              .value=${this.tapDifference}
              @change=${evt => (this.tapDifference = evt.target.value)}
            />
          </div>
          <div class="col-sm-2">
            <button type="submit" class="btn btn-block btn-primary">Start</button>
          </div>
          <div class="col-sm-2">
            <button type="button" @click=${this.resetGame} class="btn btn-block btn-primary">Reset</button>
          </div>
        </div>
      </form>
      <div>
        ${graphStats(this)}
      </div>
      <div>
        ${userInfo(this)}
      </div>
    `;
  }
}

customElements.define('app-tugofwar-admin', TugOfWarAdmin);
