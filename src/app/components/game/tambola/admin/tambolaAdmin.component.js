import { LitElement, html } from 'lit-element';
import numberGrid from './templates/numberGrid.template';
import socketService from '../../../../services/socketService';
import constants from '../../../../services/constants';
import eventDispatch from '../../../../services/eventDispatch';
import drawNumber from './templates/drawNumber.template';
import prizesInfo from './templates/prizeInfo.template';
import userInfo from './templates/userInfo.template';
import winnerDetails from './templates/winnerDetails.template';
import utilService from '../../../../services/utilService';
class TambolaAdmin extends LitElement {
  static get properties() {
    return {
      winnerDetails: { type: Array },
      isGameStarted: { type: Boolean },
      isGamePaused: { type: Boolean },
      gameData: { type: Object },
      userDetails: { type: Object },
      isGameStarting: { type: Boolean },
      currentDrawnNumber: { type: String },
      gameSummaryMsg: { type: String },
      gridNumbers: { type: Array },
      fullHousePrizeLeft: { type: Number },
      topRowPrizeLeft: { type: Number },
      middlePrizeLeft: { type: Number },
      bottomPrizeLeft: { type: Number },
      firstFivePrizeLeft: { type: Number },
      showPrizeInfo: { type: Boolean },
      publicMsg: { type: String }
    };
  }

  constructor() {
    super();
    this.fullHousePrizeLeft = 2;
    this.topRowPrizeLeft = 2;
    this.middlePrizeLeft = 2;
    this.bottomPrizeLeft = 2;
    this.firstFivePrizeLeft = 2;
    this.listeners = [];
    this.tambolaNumbers = [];
    for (let i = 1; i <= 90; i++) {
      this.tambolaNumbers.push(i);
    }
    this.init();
  }

  firstUpdated() {
    this.generateGridHtml();
    this.listeners.push(socketService.receiveDataFromClient(this.receiveData.bind(this)));
  }
  init() {
    this.winnerDetails = [];
    this.drawnNumbers = [];
    this.publicMsg = '';
    this.isGamePaused = false;
    this.showPrizeInfo = false;
    this.userDetails = [];
    this.isGameStarting = false;
    this.isGameStarted = false;
    this.gameSummaryMsg = 'Game not yet started';
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
      case constants.socketDataEvents.claimPrize:
        this.prizeClaimed(msg.data);
        break;
    }
  }

  async broadCastMessage(message) {
    await import('../../../common/publicMessage/publicMessage.component');
    this.publicMsg = message;
    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.broadCastMessage,
      data: message
    });
  }

  kickOutUser(userId) {
    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.kickOutUser,
      data: userId
    });
  }

  async prizeClaimed(data) {
    this.isGamePaused = true;
    this.broadCastMessage('Game Paused');
    await utilService.setTimeoutAsync(3000);
    const userData = this.userDetails.find(r => r.id === data.userId);
    let prizeName;
    let prizeLeftCount;
    switch (data.type) {
      case 'firstFive':
        prizeName = 'First Five';
        prizeLeftCount = this.firstFivePrizeLeft;
        break;
      case 'topRow':
        prizeName = 'Top Row';
        prizeLeftCount = this.topRowPrizeLeft;
        break;
      case 'middleRow':
        prizeName = 'Middle Row';
        prizeLeftCount = this.middlePrizeLeft;
        break;
      case 'bottomRow':
        prizeName = 'Bottom Row';
        prizeLeftCount = this.bottomPrizeLeft;
        break;
      case 'fullHouse':
        prizeName = 'Full House';
        prizeLeftCount = this.fullHousePrizeLeft;
        break;
    }

    this.broadCastMessage(`User ${userData.userName} has claimed for ${prizeName} award`);
    await utilService.setTimeoutAsync(3000);
    this.broadCastMessage(`Checking for ${prizeName} prizes bucket`);
    await utilService.setTimeoutAsync(3000);
    if (prizeLeftCount > 0) {
      this.broadCastMessage(`${prizeLeftCount} ${prizeName} prizes are left`);
      await utilService.setTimeoutAsync(3000);
      this.broadCastMessage(`Checking for boogie call...`);
      await utilService.setTimeoutAsync(3000);
      for (let number of data.summary.numbers) {
        if (!this.drawnNumbers.some(r => r === number)) {
          this.broadCastMessage(`It's a boogie call,user ${userData.userName} will be logged out now...`);
          await utilService.setTimeoutAsync(3000);
          this.kickOutUser(data.userId);
          this.broadCastMessage('');
          this.isGamePaused = false;
          return;
        }
      }
      this.broadCastMessage(`Congratulations ${userData.userName} for winning ${prizeName}`);
      await utilService.setTimeoutAsync(3000);
      this.winnerDetails.push(`${userData.userName} won ${prizeName}`);
      this.broadCastMessage('');
      this.isGamePaused = false;
    } else {
      this.broadCastMessage(`No ${prizeName} prizes are left,resuming game in...`);
      let countDown = 5;
      while (countDown--) {
        this.broadCastMessage(countDown);
        await utilService.setTimeoutAsync(1000);
      }
      this.broadCastMessage('');
      this.isGamePaused = false;
    }
  }

  userTapped(data) {
    const userData = this.userDetails.find(r => r.id === data.userId);
    userData.firstFiveCount = data.summary.numbers.length <= 5 ? data.summary.numbers.length : 5;
    userData.topLineCount = data.summary.row[0];
    userData.middleLineCount = data.summary.row[1];
    userData.bottomLineCount = data.summary.row[2];
    userData.fullHouseCount = data.summary.numbers.length;
    this.userDetails = JSON.parse(JSON.stringify(this.userDetails));
    eventDispatch.triggerAlert(`${userData.userName} has checked one number`);
  }

  userLeft(userData) {
    const idx = this.userDetails.findIndex(r => r.id === userData.id);
    if (idx != -1) {
      const user = this.userDetails.find(r => r.id === userData.id);
      this.userDetails.splice(idx, 1);
      this.userDetails = JSON.parse(JSON.stringify(this.userDetails));
      eventDispatch.triggerAlert(`User ${user.userName} left`, 'error');
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
      eventDispatch.triggerAlert(`User ${userData.userName} joined`);
    } else {
      eventDispatch.triggerAlert(`User ${userData.userName} already joined`);
    }
  }

  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  async startGame() {
    if (!this.gameStartedFlag) {
      if (constants.devMode || this.userDetails.length > 1) {
        await Promise.all([
          import('../../../common/countdown/countDown.component'),
          socketService.sendDataToClient(this.gameData.roomId, {
            event: constants.socketDataEvents.startGame
          })
        ]);
        this.isGameStarting = true;
      } else {
        eventDispatch.triggerAlert('Minimum 2 users required to start the game.', 'error');
      }
    } else {
      eventDispatch.triggerAlert('Game already in progress', 'error');
    }
  }

  gameStarted() {
    this.isGameStarting = false;
    this.gameSummaryMsg = '';
    this.isGameStarted = true;
    this.startDrawing();
  }

  async startDrawing() {
    const tambolaNumbers = this.tambolaNumbers
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5)
      .sort(() => Math.random() - 0.5);
    while (tambolaNumbers.length > 0) {
      if (this.isGameStarted) {
        if (!this.isGamePaused) {
          this.currentDrawnNumber = tambolaNumbers.splice(0, 1)[0];
          this.drawnNumbers.push(this.currentDrawnNumber);
          const gridNum = this.gridNumbers.find(r => r.value === this.currentDrawnNumber);
          gridNum.selected = true;
          this.gridNumbers = JSON.parse(JSON.stringify(this.gridNumbers));
          await utilService.setTimeoutAsync(7000);
          this.currentDrawnNumber = 'Next Number is...';
          await utilService.setTimeoutAsync(3000);
        } else {
          await utilService.setTimeoutAsync(1000);
        }
      } else {
        break;
      }
    }
  }
  resetGame() {
    this.init();
    this.generateGridHtml();
    this.endGame();
  }

  endGame() {
    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.endGame
    });
  }

  generateGridHtml() {
    const arr = [];
    for (let i of this.tambolaNumbers) {
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
      <app-public-message .message=${this.publicMsg}></app-public-message>
      ${this.isGameStarting
        ? html`
            <app-countdown @ended=${this.gameStarted}></app-countdown>
          `
        : ''}
      <form
        @submit=${evt => {
          this.startGame();
          evt.preventDefault();
        }}
      >
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
            <div class="row" style="text-align:center;margin-bottom:0.6rem">
              <div class="col">
                <button type="submit" class="btn btn-primary">Start Game</button>
              </div>
              <div class="col">
                <button type="button" @click=${() => (this.showPrizeInfo = !this.showPrizeInfo)} class="btn btn-info">
                  Click to ${this.showPrizeInfo ? 'hide' : 'show'} Prize Information
                </button>
              </div>
              <div class="col">
                <button type="button" @click=${this.resetGame} class="btn btn-warning">Reset Game</button>
              </div>
            </div>

            <div>
              ${this.isGameStarted
                ? html`
                    <div class="row">
                      <div class="col">
                        ${drawNumber(this)}
                      </div>
                      <div class="col">
                        ${winnerDetails(this)}
                      </div>
                    </div>
                  `
                : ''}
              <div class="row">
                <div class="col">
                  <h5>Number Grid</h5>
                </div>
              </div>
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
