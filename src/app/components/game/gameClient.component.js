import { LitElement, html } from "lit-element";
import "./tapIt/tapitClient.component";
import constants from "../../services/constants";
import eventDispatch from "../../services/eventDispatch";

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
  }

  startGame() {
    if (!this.userName) {
      eventDispatch.triggerAlert("Enter User Name", "error");
      return;
    }

    if (!this.teamSelected && this.gameData.playAs === constants.playAs.team) {
      eventDispatch.triggerAlert("Select Team", "error");
      return;
    }

    if (this.gameData.playAs === constants.playAs.individual) {
      this.teamSelected = this.userName;
    }

    this.startGameFlag = true;
  }

  get renderGameClient() {
    switch (this.gameData.gameId) {
      case constants.game.tapIt:
        return html`
          <app-tapit-client
            .userName=${this.userName}
            .gameData=${this.gameData}
            .team=${this.teamSelected}
          ></app-tapit-client>
        `;
    }
  }

  render() {
    return html`
      <style>
        .rowSelected {
          background-color: grey !important;
        }
      </style>
      <css-ele></css-ele>
      ${this.startGameFlag
        ? this.renderGameClient
        : html`
       <div>
       <div class="row" style="margin-bottom:0.6rem">
           <div class='col'>
             <h3>Room { ${this.gameData.roomName} }</h3>
           </div>
       </div>
         <div class="row" style="margin-bottom:0.6rem">
           <div class='col'>
             <input class="form-control" placeholder="Enter Player Name" 
             maxlength="20" @change=${evt =>
               (this.userName = evt.target.value)} required/>
           </div>
         </div>

         ${
           this.gameData.playAs === constants.playAs.team
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
                               class="${this.teamSelectedRow === idx
                                 ? "rowSelected"
                                 : "empty"}"
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
             : ""
         }

<div class='row'>
  <div class='col'>
    <button type="button" @click=${
      this.startGame
    }  class="btn btn-primary btn-block">Start</button>
      </div>
      </div
      </div>
   `}
    `;
  }
}

customElements.define("app-game-client", GameClient);
