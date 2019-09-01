import { LitElement, html } from 'lit-element';
import utilService from '../../../../services/utilService';
import socketService from '../../../../services/socketService';
import constants from '../../../../services/constants';
import numberGrid from './templates/numberGrid.template';

class TambolaClient extends LitElement {
  static get properties() {
    return {
      gridVal: { type: Array },
      userId: { type: String },
      userName: { type: String },
      gameData: { type: Object }
    };
  }

  constructor() {
    super();
    this.gridVal = [];
    this.listeners = [];
  }

  firstUpdated() {
    this.listeners.push(socketService.receiveDataFromAdmin(this.receiveData.bind(this)));
    this.populateGridValues();
  }
  disconnectedCallback() {
    this.leaveGame(false);
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
    }
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
        row.push(gridVal[key][i]);
      }
      colToRowData.push(row);
    }
    this.gridVal = colToRowData;
  }

  render() {
    return html`
      <css-ele></css-ele>
      ${numberGrid(this)}
    `;
  }
}

customElements.define('app-tambola-client', TambolaClient);
