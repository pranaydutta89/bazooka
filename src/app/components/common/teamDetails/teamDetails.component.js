import { LitElement, html } from 'lit-element';
import constants from '../../../services/constants';
import eventDispatch from '../../../services/eventDispatch';
import gameStatic from '../../../staticData/games';

class TeamDetails extends LitElement {
  static get properties() {
    return {
      selectedTab: {
        type: String
      },
      gameId: { type: String },
      team: { type: Array },
      roomName: { type: String },
      teamNameAdd: { type: String },
      alertStatus: { type: String },
      alertType: { type: String },
      alertMessage: { type: String },
      playAs: { type: String }
    };
  }

  constructor() {
    super();
    this.selectedTab = 'room';
    this.team = [];
    this.teamNameAdd = '';
    this.alert = {
      type: 'info',
      status: 'hide'
    };
  }

  firstUpdated() {
    this.gameStatic = gameStatic.find(r => r.id === this.gameId);
    if (this.gameStatic.gameType !== constants.gameType.both) {
      this.playAs = this.gameStatic.gameType;
    }

    if (this.gameStatic.gameType === constants.gameType.dualTeam) {
      this.team.push(constants.dualTeam.teamBlue);
      this.team.push(constants.dualTeam.teamRed);
    }
    this.performUpdate();
  }
  get roomDetailsRender() {
    return html`
      <form
        @submit="${evt => {
          this.selectedTab = 'teams';
          evt.preventDefault();
        }}"
      >
        <div class="row">
          <div class="col">
            ${this.playAs === constants.gameType.individual || this.playAs === constants.gameType.dualTeam
              ? html`
                  <button type="submit" @click="${this.startClicked}" class="btn btn-success">
                    Start
                  </button>
                `
              : html`
                  <button type="submit" class="btn btn-success">Next</button>
                `}
          </div>
        </div>
      </form>
    `;
  }

  get teamDetailsRender() {
    return html`
      <div>
        <div class="row">
          <div class="col">
            ${this.team.length !== 0
              ? html`
                  <table class="table table-striped">
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
                        `;
                      })}
                    </tbody>
                  </table>
                `
              : html`
                  <div class="alert alert-warning" role="alert">
                    Add Team Details
                  </div>
                `}
          </div>
        </div>

        <div class="row" style="margin-bottom:0.6rem">
          <div class="col-9">
            <input
              class="form-control"
              .value="${this.teamNameAdd}"
              @change=${evt => (this.teamNameAdd = evt.target.value)}
              type="text"
              maxlength="20"
              placeholder="Enter Team Name"
            />
          </div>
          <div class="col">
            <button
              type="button"
              @click=${() => {
                this.addTeam();
              }}
              class="btn btn-primary btn-block"
            >
              Add
            </button>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <button type="button" @click="${this.startClicked}" class="btn btn-success">
              Start
            </button>
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
      default:
        return eventDispatch.triggerAlert('Invalid Target', 'error');
    }
  }

  startClicked() {
    if (this.playAs == constants.gameType.team) {
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
    } else {
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

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <app-alert
        @close=${() => (this.alertStatus = 'hide')}
        .status=${this.alertStatus}
        .type=${this.alertType}
        .message=${this.alertMessage}
      ></app-alert>

      <div class="team-details">
        <a class="how-to">How to play?</a>
        <div class="details">
          <div class="row">
            <div class="col-12 col-md-6">
              <div class="form-group">
                <label for="roomName">Room Name</label>
                <input
                  id="roomName"
                  type="text"
                  @change=${evt => (this.roomName = evt.target.value)}
                  class="form-control form-control-lg"
                  maxlength="20"
                  required
                  placeholder="Enter Game Room Name"
                />
              </div>
              <div class="form-group">
                ${this.gameStatic && this.gameStatic.gameType === constants.gameType.both
                  ? html`
                      <label for="roomName">Play Mode</label>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          required
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio1"
                          .value=${constants.gameType.individual}
                          @click=${evt => (this.playAs = evt.target.value)}
                        />
                        <label class="form-check-label" for="inlineRadio1">Individual</label>
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          required
                          type="radio"
                          name="inlineRadioOptions"
                          id="inlineRadio2"
                          .value=${constants.gameType.team}
                          @click=${evt => (this.playAs = evt.target.value)}
                        />
                        <label class="form-check-label" for="inlineRadio2">Team</label>
                      </div>
                    `
                  : ''}
              </div>
            </div>
            <div class="col-12 col-md-6"></div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-team-details', TeamDetails);
