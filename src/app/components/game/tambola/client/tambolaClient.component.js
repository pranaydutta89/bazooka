import { LitElement, html } from 'lit-element';
import utilService from '../../../../services/utilService';
import socketService from '../../../../services/socketService';
import constants from '../../../../services/constants';
import numberGrid from './templates/numberGrid.template';
import claimPrizes from './templates/claimPrizes.template';
import gameService from '../../../../services/gameService';

class TambolaClient extends LitElement {
  static get properties() {
    return {
      gridVal: { type: Array },
      userId: { type: String },
      userName: { type: String },
      gameData: { type: Object },
      isGameStarting: { type: Boolean },
      isGameStarted: { type: Boolean },
      publicMessage: { type: String }
    };
  }

  constructor() {
    super();
    this.listeners = [];
    this.init();
  }

  init() {
    this.publicMessage = '';
    this.gridVal = [];
    this.isGameStarting = false;
    this.isGameStarted = false;
    this.clickedNumbersSummary = {
      userId: this.userId,
      numbers: [],
      row: {
        0: 0,
        1: 0,
        2: 0
      }
    };
  }

  firstUpdated() {
    this.listeners.push(socketService.receiveDataFromAdmin(this.receiveData.bind(this)));
    this.populateGridValues();
  }
  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  receiveData(msg) {
    switch (msg.event) {
      case constants.socketDataEvents.startGame:
        this.startingGame();
        break;
      case constants.socketDataEvents.endGame:
        this.endGame();
        break;
      case constants.socketDataEvents.broadCastMessage:
        this.broadCastMessage(msg.data);
        break;
      case constants.socketDataEvents.kickOutUser:
        this.userKickedOut(msg.data);
        break;
    }
  }

  userKickedOut(userId) {
    if (userId === this.userId) {
      gameService.leaveGame(this.gameData.roomId, this.userId);
    }
  }

  async broadCastMessage(message) {
    await import('../../../common/publicMessage/publicMessage.component');
    this.publicMessage = message;
  }

  endGame() {
    this.init();
    this.populateGridValues();
  }

  async startingGame() {
    await import('../../../common/countdown/countDown.component');
    this.isGameStarting = true;
  }
  gameStarted() {
    this.isGameStarting = false;
    this.isGameStarted = true;
  }

  populateGridValues() {
    let elementCounts = [2, 2, 2, 2, 2, 2, 1, 1, 1];
    elementCounts = elementCounts.sort(() => Math.random() - 0.5);
    const gridVal = {};
    elementCounts.forEach((r, idx) => {
      const colNumber = idx + 1;
      const colData = [null, null, null];
      for (let i = 0; i < r; i++) {
        let minValue = (colNumber - 1) * 10;
        if (minValue === 0) {
          minValue = 1;
        }
        const maxValue = colNumber * 10 - 1;
        colData[i] = utilService.randomIntFromInterval(minValue, maxValue, colData);
      }

      gridVal[colNumber] = colData.sort(() => Math.random() - 0.5);
    });

    const colToRowData = [];
    for (let i = 0; i <= 2; i++) {
      const row = [];
      for (let key in gridVal) {
        row.push({ value: gridVal[key][i], selected: false });
      }
      colToRowData.push(row);
    }
    this.gridVal = colToRowData;
  }

  claimPrize(type) {
    socketService.sendDataToAdmin(
      this.gameData.roomId,
      {
        event: constants.socketDataEvents.claimPrize,
        data: {
          type,
          userId: this.userId,
          summary: this.clickedNumbersSummary
        }
      },
      false
    );
  }

  numberClicked(num) {
    let rowNumber;
    for (let i = 0; i < this.gridVal.length; i++) {
      if (this.gridVal[i].find(r => r.value === num)) {
        rowNumber = i;
        break;
      }
    }
    this.clickedNumbersSummary.numbers.push(num);
    this.clickedNumbersSummary.row[rowNumber] += 1;
    socketService.sendDataToAdmin(
      this.gameData.roomId,
      {
        event: constants.socketDataEvents.userTapped,
        data: {
          userId: this.userId,
          summary: this.clickedNumbersSummary
        }
      },
      false
    );
    this.requestUpdate();
  }

  render() {
    return html`
      <css-ele></css-ele>
      <app-public-message .message=${this.publicMessage}></app-public-message>
          ${
            this.isGameStarting
              ? html`
                  <app-countdown @ended=${this.gameStarted}></app-countdown>
                `
              : ''
          }
      <div class="row" style="margin-top:0.6rem">
        <div class="col" style="text-align:center">
          <h5>Hello!! Player ${this.userName}</h5>
        </div>
      </div>
      <div>
          ${
            this.isGameStarted
              ? claimPrizes(this)
              : html`
                  <app-alert keepOpen="true" type="info" message="Game not started yet"></app-alert>
                `
          }
      </div>
      <div>
        <div class="row" style="margin-top:0.6rem">
          <div class="col" style="text-align:center">
           <h4>Ticket(Tap to mark)</h4>
          </div>
        </div>
         ${numberGrid(this)}
      </div>
    </div>
      </div>
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

customElements.define('app-tambola-client', TambolaClient);
