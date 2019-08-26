import { LitElement, html } from "lit-element";
import './tapIt/tapitClient.component';
import constants from "../../services/constants";

class GameClient extends LitElement {
    static get properties() {
        return {
            gameId: { type: String },
            gameData: { type: Object },
            teamSelected: { type: String },
            userName: { type: String },
            teamSelectedRow: { type: Number },
            startGameFlag: { type: Boolean },
            alertStatus: { type: String },
            alertType: { type: String },
            alertMessage: { type: String },
        }
    }

    constructor() {
        super();
        this.startGameFlag = false;
        this.teamSelectedRow = -1;
        this.alertType = 'error';
        this.alertStatus = 'hide';
    }

    startGame() {
        if (!this.userName) {
            this.alertStatus = 'show';
            this.alertMessage = 'Enter User Name';
            return;
        }

        if (!this.teamSelected) {
            this.alertStatus = 'show';
            this.alertMessage = 'Select Team';
            return;
        }
        this.startGameFlag = true;
    }

    get renderGameClient() {
        switch (this.gameId) {
            case constants.game.tapIt:
                return html`<app-tapit-play 
        .userName=${this.userName} 
        .roomId=${this.gameData.roomId} 
        .team=${this.teamSelected}></app-tapit-play>`
        }
    }

    render() {

        return html`
    
    <style>
     .rowSelected{
       background-color:grey !important;
     }
    </style>
    <css-ele></css-ele>
    ${
            this.startGameFlag ?
                this.renderGameClient
                : html`
       <div>
 <app-alert @close=${() => this.alertStatus = 'hide'} positionFixed='true' .status=${this.alertStatus}
  .type=${this.alertType} .message=${this.alertMessage}></app-alert>
       <div class="row" style="margin-bottom:0.6rem">
           <div class='col'>
             <h3>Room { ${this.gameData.roomName} }</h3>
           </div>
       </div>
         <div class="row" style="margin-bottom:0.6rem">
           <div class='col'>
             <input class="form-control" placeholder="Enter Player Name" 
             maxlength="20" @change=${(evt) => this.userName = evt.target.value} required/>
           </div>
         </div>
         <div class='row'>
           <div class='col'>
             <h6>SelectTeam</h6>
    </div>
         </div>


         <div class='row'>
           <div class='col'>
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
       <tr style='cursor:pointer' class="${this.teamSelectedRow === idx ? 'rowSelected' : 'empty'}" @click=${() => { this.teamSelected = name; this.teamSelectedRow = idx }}>
      <th scope="row">${idx + 1}</th>
      <td>${name}</td>
    </tr>
      `
                })}

          </tbody>
        </table>
    </div>
    </div>

<div class='row'>
  <div class='col'>
    <button type="button" @click=${this.startGame}  class="btn btn-primary btn-block">Start</button>
      </div>
      </div
      </div>
   `}`
    }
}

customElements.define('app-game-client', GameClient);