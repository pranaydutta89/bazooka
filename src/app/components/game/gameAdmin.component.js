import { LitElement, html } from 'lit-element';
import './tapIt/tapItAdmin.component';
import '../common/instructions/instructions.component';
import constants from '../../services/constants';
import '../common/teamDetails/teamDetails.component';
import '../common/instructions/instructions.component';
import staticGames from '../../staticData/games';
import '../common/clientUrl/clientUrl.component';
import eventDispatch from '../../services/eventDispatch';
import socketService from '../../services/socketService';
import './tambola/admin/tambolaAdmin.component';

class GameAdmin extends LitElement {
  static get properties() {
    return {
      isGameStarted: { type: String },
      gameData: { type: Object },
      gameId: { type: String }
    };
  }

  constructor() {
    super();
    this.isGameStarted = false;
  }

  firstUpdated() {
    document.title = staticGames.find(r => r.id === constants.game.tapIt).title;
  }

  async startGame(data) {
    this.gameData = data.detail;
    // eslint-disable-next-line no-undef
    this.gameData.roomId = uuid();
    this.gameData.gameId = this.gameId;
    await socketService.joinRoom(true, this.gameData.roomId);
    eventDispatch.triggerAlert('Room Created...');
    this.isGameStarted = true;
  }

  get renderGame() {
    switch (this.gameId) {
      case constants.game.tapIt:
        return html`
          <app-tapit-admin .gameData="${this.gameData}"></app-tapit-admin>
        `;

      case constants.game.tambola:
        return html`
          <app-tambola-admin .gameData="${this.gameData}"></app-tambola-admin>
        `;
      default:
        return eventDispatch.triggerAlert('Invalid Game', 'error');
    }
  }

  render() {
    return html`
      ${this.isGameStarted
        ? html`
            <div>
              <app-client-url .gameData="${this.gameData}"></app-client-url>
              ${this.renderGame}
            </div>
          `
        : html`
            <div>
              <app-team-details .gameId=${this.gameId} @start=${this.startGame}></app-team-details>
              <app-game-instruction .gameId=${constants.game.tapIt}></app-game-instruction>
            </div>
          `}
    `;
  }
}

customElements.define('app-game', GameAdmin);
