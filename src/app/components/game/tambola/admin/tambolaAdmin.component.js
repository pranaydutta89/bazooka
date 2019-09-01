import { LitElement, html } from 'lit-element';
import numberGrid from './templates/numberGrid.template';
import socketService from '../../../../services/socketService';
import constants from '../../../../services/constants';
import eventDispatch from '../../../../services/eventDispatch';
import drawNumber from './templates/drawNumber.template';
import prizesInfo from './templates/prizeInfo.template';
import userInfo from './templates/userInfo.template';
class TambolaAdmin extends LitElement {
  static get properties() {
    return {
      isGameStarted: { type: Boolean },
      gameData: { type: Object },
      userDetails: { type: Object },
      isGameStarting: { type: Boolean },
      currentDrawnNumber: { type: Number },
      gameSummaryMsg: { type: String },
      gridNumbers: { type: Array },
      fullHousePrizeLeft: { type: Number },
      topRowPrizeLeft: { type: Number },
      middlePrizeLeft: { type: Number },
      bottomPrizeLeft: { type: Number },
      firstFivePrizeLeft: { type: Number }
    };
  }

  constructor() {
    super();
    this.fullHousePrizeLeft = 2;
    this.topRowPrizeLeft = 2;
    this.middlePrizeLeft = 2;
    this.bottomPrizeLeft = 2;
    this.firstFivePrizeLeft = 2;
    this.isGameStarting = false;
    this.isGameStarted = false;
    this.gameSummaryMsg = 'Game not yet started';
    this.listeners = [];
    this.userDetails = [];
    this.tambolaNumbers = [];
    for (let i = 1; i <= 99; i++) {
      this.tambolaNumbers.push(i);
    }
  }

  firstUpdated() {
    this.init();
  }
  init() {
    this.generateGridHtml();
    this.listeners.push(socketService.receiveDataFromClient(this.receiveData.bind(this)));
  }

  receiveData(msg) {
    switch (msg.event) {
      case constants.socketDataEvents.userJoined:
        this.userJoined(msg.data);
        break;
      case constants.socketDataEvents.decarledWinner:
    }
  }

  userJoined(userData) {
    const user = this.userDetails.find(r => r.id === userData.id);
    if (!user) {
      this.userDetails.push({
        ...userData,
        ...{ firstFiveCount: 0, topLineCount: 0, middleLineCount: 0, bottomLineCount: 0, fullHouseCount: 0 }
      });
      this.userDetails = JSON.parse(JSON.stringify(this.userDetails));
    } else {
      eventDispatch.triggerAlert(`User ${userData.userName} already joined`);
    }
  }

  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  startGame() {
    this.isGameStarting = true;
  }

  gameStarted() {
    this.isGameStarted = true;
  }

  startDrawing() {
    this.tambolaNumbers = this.tambolaNumbers.sort(() => Math.random() - 0.5);
  }

  generateGridHtml() {
    const arr = [];
    for (let i = 1; i <= 99; i++) {
      arr.push({
        label: i < 10 ? '0' + i : i,
        value: i,
        selected: false
      });
    }
    return (this.gridNumbers = arr);
  }

  render() {
    return html`
      <css-ele></css-ele>
      <form @submit=${() => {}}>
        <div class="row">
          <div class="col">
            <app-alert keepOpen="true" .message=${this.gameSummaryMsg}></app-alert>
            <div class="row">
              <div class="col"></div>
            </div>
            <div class="row">
              <div class="col">
                ${prizesInfo(this)}
              </div>
            </div>
            <div class="row">
              <div class="col">
                <button @click=${this.startGame} class="btn btn-primary">Start</button>
              </div>
            </div>
            ${this.isGameStarting
              ? html`
                  <app-countdown @ended=${this.gameStarted}></app-countdown>
                `
              : drawNumber(this)}
            <div>
              ${numberGrid(this)}
            </div>
            <div>
              ${userInfo(this)}
            </div>
          </div>
        </div>
      </form>
    `;
  }
}

customElements.define('app-tambola-admin', TambolaAdmin);
