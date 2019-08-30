import { LitElement, html } from "lit-element";
import constants from "../../../services/constants";

class TeamDetails extends LitElement {

  static get properties() {
    return {
      selectedTab: {
        type: String
      },
      team: { type: Array },
      roomName: { type: String },
      teamNameAdd: { type: String },
      alertStatus: { type: String },
      alertType: { type: String },
      alertMessage: { type: String },
      playAs: { type: String }
    }
  }

  constructor() {
    super();
    this.selectedTab = 'room';
    this.team = [];
    this.teamNameAdd = '';
    this.alert = {
      type: 'info',
      status: 'hide'
    }
  }
  get roomDetailsRender() {
    return html`
        <form @submit='${(evt) => { this.selectedTab = 'teams'; evt.preventDefault() }}'>
        <div class='row' style="margin-bottom:0.6rem">
            <div class='col'>
                <input type="text" @change=${(evt) => this.roomName = evt.target.value} class="form-control" maxlength="20" required placeholder="Enter Room Name"/>
            </div>
        </div>
        <div class="row">
          <div class="col-3">
        <h6>Play As </h6>
        </div>
          <div class="col">
        <div class="form-check form-check-inline">
  <input class="form-check-input" required type="radio" name="inlineRadioOptions" id="inlineRadio1"  .value=${constants.playAs.individual} @click=${(evt) => this.playAs = evt.target.value}>
  <label class="form-check-label" for="inlineRadio1">Individual</label>
</div>
<div class="form-check form-check-inline">
  <input class="form-check-input" required type="radio" name="inlineRadioOptions" id="inlineRadio2" .value=${constants.playAs.team} @click=${(evt) => this.playAs = evt.target.value}>
  <label class="form-check-label" for="inlineRadio2">Team</label>
</div>
</div>
        </div>

       

        <div class='row'>
            <div class='col'>
               ${
      this.playAs === constants.playAs.individual ?
        html`<button type="submit" @click='${this.startClicked}' class="btn btn-success">Start</button>`
        : html`<button type="submit"  class="btn btn-success">Next</button>`
      } 
               
            </div>
        </div>
        </form>`;
  }

  get teamDetailsRender() {
    return html`
    <div>

        <div class="row">
          <div class="col">
           ${this.team.length !== 0 ?
        html`<table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            ${this.team.map((name, idx) => {
          return html`
       <tr>
      <th scope="row">${idx + 1}</th>
      <td>${name}</td>
    </tr>
      `
        })}

          </tbody>
        </table>` : html`<div class="alert alert-warning" role="alert">
          Add Team Details
</div>`
      }
  </div>
        </div>
  
        <div class='row' style="margin-bottom:0.6rem">
          <div class='col-9'>
            <input class="form-control" .value='${this.teamNameAdd}'  @change=${(evt) => this.teamNameAdd = evt.target.value} type="text" maxlength="20" placeholder="Enter Team Name"/>
          </div>
          <div class='col'>
            <button type="button" @click=${(evt) => { this.addTeam() }} class="btn btn-primary btn-block">Add</button>
          </div>
        </div>

 <div class='row'>
          <div class='col'>
             <button type="button" @click='${this.startClicked}' class="btn btn-success">Start</button>
          </div>
  </div>
    </div>
      `;
  }

  addTeam() {
    this.team = this.team.concat([this.teamNameAdd]);
    this.teamNameAdd = '';
  }


  get selectedTabRender() {
    switch (this.selectedTab) {
      case 'room':
        return this.roomDetailsRender;
      case 'teams':
        return this.teamDetailsRender;
    }
  }

  startClicked() {
    if (this.playAs == constants.playAs.team) {
      if (this.team.length > 1) {
        const event = new CustomEvent('start', {
          detail: {
            playAs: this.playAs,
            team: this.team,
            roomName: this.roomName
          }
        });
        this.dispatchEvent(event);
      } else {
        this.alertStatus = 'show';
        this.alertType = 'error';
        this.alertMessage = 'Minimum 2 teams required';
      }
    }
    else {
      const event = new CustomEvent('start', {
        detail: {
          playAs: this.playAs,
          team: this.team,
          roomName: this.roomName
        }
      });
      this.dispatchEvent(event);
    }
  }

  render() {
    return html`
        <css-ele></css-ele>
        <style>
          .teamDetails ul{
            margin-bottom:0.6rem;
          }
        </style>
        <app-alert  @close=${() => this.alertStatus = 'hide'}
         .status=${this.alertStatus} .type=${this.alertType} .message=${this.alertMessage}></app-alert>

        <div class='teamDetails'>
            <ul class="nav nav-tabs" role="tablist">
                <li class="nav-item">
                    <a class="nav-link ${this.selectedTab == 'room' ? 'active' : 'disabled'}" data-toggle="tab" 
                    disabled='${this.selectedTab !== 'room'}' role="tab" 
                    aria-controls="Room">Room</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ${this.selectedTab == 'teams' ? 'active' : 'disabled'}" data-toggle="tab" 
                     disabled='${this.selectedTab !== 'teams'}'
                      role="tab" aria-controls="Teams" >Teams</a>
                </li>
            </ul>
            <div class="tab-content">
                <div class="tab-pane fade show active" role="tabpanel">
                     ${this.selectedTabRender}
                </div>
                
            </div>
        
        </div>`;
  }
}

customElements.define('app-team-details', TeamDetails);