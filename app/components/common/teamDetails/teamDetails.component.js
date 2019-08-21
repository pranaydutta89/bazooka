import { LitElement, html } from "lit-element";

class TeamDetails extends LitElement {

  static get properties() {
    return {
      selectedTab: {
        type: String
      },
      team: { type: Array },
      teamName: { type: String },
      teamNameAdd: { type: String }
    }
  }

  constructor() {
    super();
    this.selectedTab = 'room';
    this.team = [];
    this.teamNameAdd = '';
  }
  get roomDetailsRender() {
    return html`
        <form @submit='${(evt) => { this.selectedTab = 'teams'; evt.preventDefault() }}'>
        <div class='row' style="margin-bottom:0.6rem">
            <div class='col'>
                <input type="text" @change=${(evt) => this.teamName = evt.target.value} class="form-control" maxlength="20" required placeholder="Enter Room Name"/>
            </div>
        </div>
        <div class='row'>
            <div class='col'>
                <button type="submit" class="btn btn-success">Next</button>
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
          <div class='col'>
            <input class="form-control" .value='${this.teamNameAdd}'  @change=${(evt) => this.teamNameAdd = evt.target.value} type="text" maxlength="20" placeholder="Enter Team Name"/>
          </div>
          <div class='col'>
            <button type="button" @click=${(evt) => { this.addTeam() }} class="btn btn-success">Add</button>
          </div>
        </div>

 <div class='row'>
          <div class='col'>
             <button type="submit" @click='${this.startClicked}' class="btn btn-success">Start</button>
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
    const event = new CustomEvent('start', {
      detail: {
        teamName: this.teamName,
        team: this.team
      }
    });
    this.dispatchEvent(event);
  }
  render() {
    return html`
        <css-ele></css-ele>
        <style>
          .teamDetails ul{
            margin-bottom:0.6rem;
          }
        </style>
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