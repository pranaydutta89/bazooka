import { LitElement, html } from "lit-element";
import './tapitPlay.component';

class TapItPlayInit extends LitElement {
  static get properties() {
    return {
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


  render() {

    return html`
    
    <style>
     .rowSelected{
       background-color:grey;
     }
    </style>
    <css-ele></css-ele>
    ${
      this.startGameFlag ?
        html`<app-tapit-play 
        userName=${this.userName} 
        roomId=${this.gameData.roomId} 
        team=${this.teamSelected}></app-tapit-play>`
        : html`
       <div>
 <app-alert @close=${() => this.alertStatus = 'hide'} status=${this.alertStatus} type=${this.alertType} message=${this.alertMessage}></app-alert>
       <div class="row" style="margin-bottom:0.6px">
           <div class='col' style="text-align:center">
             <h3>TapIt Game Play</h3>
           </div>
       </div>
         <div class="row" style="margin-bottom:0.6px">
           <div class='col'>
             <input class="form-control" placeholder="Enter Player Name" 
             maxlength="20" @change=${(evt) => this.userName = evt.target.value} required/>
           </div>
         </div>
         <div class='row'>
           <div class='col' style="text-align:center">
             <h5>Select Your Team</h5>
    </div>
         </div>


         <div class='row'>
           <div class='col'>
             <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
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
    <button type="button" @click=${this.startGame}  class="btn btn-primary">Start</button>
      </div>
      </div
      </div>
   `}`
  }
}

customElements.define('app-tapit-play-init', TapItPlayInit);