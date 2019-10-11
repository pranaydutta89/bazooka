import { LitElement, html } from 'lit-element';
import './tapIt/tapitClient.component';
import constants from '../../services/constants';
import eventDispatch from '../../services/eventDispatch';
import socketService from '../../services/socketService';
import router from '../../services/routerService';
import utilService from '../../services/utilService';
import gameService from '../../services/gameService';

class GameClient extends LitElement {
  static get properties() {
    return {
      gameData: { type: Object },
      teamSelected: { type: String },
      userName: { type: String },
      teamSelectedRow: { type: Number },
      startGameFlag: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.startGameFlag = false;
    this.teamSelectedRow = -1;
    window.addEventListener('beforeunload', this.beforeUnload.bind(this));
  }

  beforeUnload() {
    if (this.userId) {
      gameService.leaveGame(this.gameData.roomId, this.userId);
    }
  }

  disconnectedCallback() {
    window.removeEventListener('beforeunload', this.beforeUnload.bind(this));
    super.disconnectedCallback();
  }

  async importCurrentGame() {
    switch (this.gameData.gameId) {
      case constants.game.tapIt:
        await import('./tapIt/tapitClient.component');
        break;
      case constants.game.tambola:
        await import('./tambola/client/tambolaClient.component');
        break;
      case constants.game.tugOfWar:
        await import('./tugOfWar/client/tugOfWarClient.component');
        break;
    }
  }
  async startGame() {
    if (!this.userName) {
      eventDispatch.triggerAlert('Enter User Name', 'error');
      return;
    }

    if (
      !this.teamSelected &&
      (this.gameData.playAs === constants.gameType.team || this.gameData.playAs === constants.gameType.dualTeam)
    ) {
      eventDispatch.triggerAlert('Select Team', 'error');
      return;
    }

    if (this.gameData.playAs === constants.gameType.individual) {
      this.teamSelected = this.userName;
    }
    await Promise.all([this.joinRoom(), this.importCurrentGame()]);
    this.startGameFlag = true;
  }

  async joinRoom() {
    try {
      await socketService.joinRoom(false, this.gameData.roomId);
      this.joinUser();
    } catch (e) {
      eventDispatch.triggerAlert('Room does not exist,logging out');
      setTimeout(() => {
        router.navigate('/');
      }, 3000);
    }
  }

  async joinUser() {
    this.userId = utilService.randomString();
    const user = {
      id: this.userId,
      userName: this.userName,
      team: this.gameData.playAs === constants.gameType.individual ? this.userName : this.teamSelected
    };
    await socketService.sendDataToAdmin(this.gameData.roomId, {
      event: constants.socketDataEvents.userJoined,
      data: user
    });
  }

  get renderGameClient() {
    switch (this.gameData.gameId) {
      case constants.game.tapIt:
        return html`
          <app-tapit-client
            .userId=${this.userId}
            .userName=${this.userName}
            .gameData=${this.gameData}
            .team=${this.teamSelected}
          ></app-tapit-client>
        `;
      case constants.game.tambola:
        return html`
          <app-tambola-client
            .userId=${this.userId}
            .userName=${this.userName}
            .gameData=${this.gameData}
          ></app-tambola-client>
        `;
      case constants.game.tugOfWar:
        return html`
          <app-tugofwar-client
            .userId=${this.userId}
            .userName=${this.userName}
            .gameData=${this.gameData}
            .team=${this.teamSelected}
          ></app-tugofwar-client>
        `;
      default:
        return eventDispatch.triggerAlert('Invalid Game', 'error');
    }
  }

  render() {
    return html`
      <style>
        .rowSelected {
          background-color: grey !important;
        }
      </style>

      ${this.startGameFlag
        ? this.renderGameClient
        : html`
       <div>
       <div class="row" style="margin-bottom:0.6rem">
           <div class='col'>
             <h5>Room { ${this.gameData.roomName} } for game { ${this.gameData.gameId} }</h5>
           </div>
       </div>
         <div class="row" style="margin-bottom:0.6rem">
           <div class='col'>
             <input class="form-control" placeholder="Enter Player Name" 
             maxlength="20" @change=${evt => (this.userName = evt.target.value)} required/>
           </div>
         </div>

         ${
           this.gameData.playAs === constants.gameType.team || this.gameData.playAs === constants.gameType.dualTeam
             ? html`
                 <div class="row">
                   <div class="col">
                     <h6>SelectTeam</h6>
                   </div>
                 </div>

                 <div class="row">
                   <div class="col">
                     <table class="table table-striped">
                       <thead>
                         <tr>
                           <th scope="col">#</th>
                           <th scope="col">Team Name</th>
                         </tr>
                       </thead>
                       <tbody>
                         ${this.gameData.team.map((name, idx) => {
                           return html`
                             <tr
                               style="cursor:pointer"
                               class="${this.teamSelectedRow === idx ? 'rowSelected' : 'empty'}"
                               @click=${() => {
                                 this.teamSelected = name;
                                 this.teamSelectedRow = idx;
                               }}
                             >
                               <th scope="row">${idx + 1}</th>
                               <td>${name}</td>
                             </tr>
                           `;
                         })}
                       </tbody>
                     </table>
                   </div>
                 </div>
               `
             : ''
         }

<div class='row'>
  <div class='col'>
    <button type="button" @click=${this.startGame}  class="btn btn-primary btn-block">Start</button>
      </div>
      </div
      </div>
   `}
    `;
  }
}

customElements.define('app-game-client', GameClient);
