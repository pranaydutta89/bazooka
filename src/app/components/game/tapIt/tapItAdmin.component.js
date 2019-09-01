import { LitElement, html } from 'lit-element';
import '../../common/charts/bar/bar.component';
import socketService from '../../../services/socketService';
import '../../common/spinner/spinner.component';
import utilService from '../../../services/utilService';
import constants from '../../../services/constants';
import '../../common/alert/alert.component';
import eventDispatch from '../../../services/eventDispatch';
class TapItAdmin extends LitElement {
  static get properties() {
    return {
      gameData: { type: Object },
      userDetails: { type: Array },
      chartData: { type: Array },
      gameStartCountDown: { type: Boolean },
      gameStartedFlag: { type: Boolean },
      gameTime: { type: Number },
      gameSummaryMsg: { type: String }
    };
  }

  constructor() {
    super();
    this.gameTime = 30;
    this.listeners = [];
    this.userDetails = [];
    this.chartData = [];
    this.gameStartCountDown = false;
    this.gameStartedFlag = false;
    this.teamColor = {};
    this.gameSummaryMsg = 'Game not yet Started';
  }

  async firstUpdated() {
    this.chartOptions = {
      title: 'Live Tap Count',
      chartArea: { width: '100%' },
      hAxis: {
        title: `${this.gameData.playAs === constants.playAs.team ? 'Teams' : ''} Total Tap count`,
        minValue: 0
      },
      vAxis: {
        title: this.gameData.playAs
      }
    };
    await this.init();
  }

  async init() {
    this.gameData.team.forEach(r => {
      this.teamColor[r] = utilService.pickColor(r);
    });
    this.listeners.push(socketService.receiveDataFromClient(this.receiveData.bind(this)));
  }

  disconnectedCallback() {
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }

  receiveData(msg) {
    switch (msg.event) {
      case constants.socketDataEvents.userJoined:
        this.userJoined(msg.data);
        break;
      case constants.socketDataEvents.userTapped:
        this.userTapped(msg.data);
        break;
      case constants.socketDataEvents.userLeft:
        this.userLeft(msg.data);
        break;
    }
  }

  userLeft(userData) {
    const idx = this.userDetails.findIndex(r => r.id === userData.id);
    if (idx != -1) {
      const user = this.userDetails.find(r => r.id === userData.id);
      this.userDetails.splice(idx, 1);
      this.userDetails = JSON.parse(JSON.stringify(this.userDetails));
      eventDispatch.triggerAlert(`User ${user.userName} left`, 'error');
    }
  }

  userJoined(userData) {
    const user = this.userDetails.find(r => r.id === userData.id);
    if (!user) {
      this.userDetails.push({ ...userData, ...{ tapCount: 0 } });
      this.checkTapCount();
      eventDispatch.triggerAlert(`User ${userData.userName} Joined`);
    } else {
      eventDispatch.triggerAlert(`User ${userData.userName} already joined`);
    }
  }

  resetData() {
    this.userDetails.forEach(r => (r.tapCount = 0));
    this.checkTapCount();
    this.gameEnded();
    this.gameSummaryMsg = 'Game not yet Started';
  }

  checkTapCount() {
    const teams = this.userDetails
      .map(r => r.team)
      .filter((value, idx, self) => {
        return value && self.indexOf(value) === idx;
      });

    const chartData = [];
    teams.forEach(r => {
      chartData.push({
        team: r,
        value: [
          r,
          this.userDetails
            .filter(y => y.team === r)
            .map(z => z.tapCount)
            .reduce((t, n) => t + n)
        ]
      });
    });

    const val = chartData.map(r => r.value);
    if (this.gameStartedFlag) {
      socketService.sendDataToClient(this.gameData.roomId, {
        event: constants.socketDataEvents.tapSummary,
        data: val.map(r => {
          return {
            teamName: r[0],
            tapCount: r[1]
          };
        })
      });
    }
    val.forEach(r => {
      r.push(this.teamColor[r[0]], r[0]);
    });
    this.chartData = val;
  }

  userTapped(data) {
    if (this.gameStartedFlag) {
      const user = this.userDetails.find(r => r.id === data.id);
      if (user) {
        user.tapCount += 1;
        this.userDetails = this.userDetails;
        this.checkTapCount();
        eventDispatch.triggerAlert(`User ${user.userName} Tapped`);
      } else {
        //user doesnt exist already exists
      }
    }
  }

  async startGame() {
    if (!this.gameStartedFlag) {
      await import('../../common/countdown/countDown.component');
      if (this.userDetails.length > 1) {
        await socketService.sendDataToClient(this.gameData.roomId, {
          event: constants.socketDataEvents.startGame
        });
        this.gameStartCountDown = true;
      } else {
        eventDispatch.triggerAlert('Minimum 2 users required to start the game.', 'error');
      }
    } else {
      eventDispatch.triggerAlert('Game already in progress', 'error');
    }
  }

  gameStarted() {
    this.gameStartCountDown = false;
    this.gameStartedFlag = true;
    this.gameCountDown();
  }

  gameEnded() {
    if (this.countdown) {
      clearInterval(this.countdown);
      this.countdown = null;
    }

    socketService.sendDataToClient(this.gameData.roomId, {
      event: constants.socketDataEvents.endGame
    });
    this.gameStartedFlag = false;
    this.gameSummaryMsg = `Winner is ${this.chartData[0][0]} with a total of ${this.chartData[0][1]} taps`;
  }

  gameCountDown() {
    let counter = this.gameTime;

    if (this.countdown) {
      clearInterval(this.countdown);
      this.countdown = null;
    }

    this.countdown = setInterval(() => {
      this.gameSummaryMsg = `Time left ${counter} seconds`;
      counter--;
      if (counter === 0) {
        clearInterval(this.countdown);
        this.gameEnded();
      }
    }, 1000);
  }

  render() {
    return html`
      <css-ele></css-ele>
      ${this.gameStartCountDown
        ? html`
            <app-countdown @ended=${this.gameStarted}></app-countdown>
          `
        : ''}
      <div>
        <div class="row">
          <div class="col">
            <h3>
              Room { ${this.gameData.roomName} }, Playing as ${this.gameData.playAs}
            </h3>
          </div>
        </div>

        <app-alert keepOpen="true" status="show" type="info" .message=${this.gameSummaryMsg}></app-alert>

        <div class="row" style="margin-bottom:0.6rem">
          <label for="colFormLabelSm" class="col-sm-2 col-form-label col-form-label text-truncate"
            >Play Time(Seconds)</label
          >
          <div class="col-sm-6">
            <input
              type="number"
              .value=${this.gameTime}
              .disabled=${this.gameStartedFlag}
              @change=${evt => (this.gameTime = evt.target.value)}
              class="form-control form-control-xs"
              id="colFormLabelSm"
              placeholder="Enter Seconds"
            />
          </div>

          <div class="col-sm-2">
            <button type="button" @click=${this.startGame} class="btn btn-block btn-info">
              Start
            </button>
          </div>
          <div class="col-sm-2">
            <button type="button" @click=${this.resetData} class="btn btn-block btn-secondary">
              Reset
            </button>
          </div>
        </div>

        <app-chart-bar
          xLabel="Team tap Count"
          .options=${this.chartOptions}
          .teamInfo=${this.teamColor}
          yLabel="Teams"
          .data=${this.chartData}
        ></app-chart-bar>

        ${this.userDetails.length === 0
          ? html`
              <app-alert status="show" keepOpen="true" type="info" message="No Players joined yet"></app-alert>
            `
          : html`
              <div class="row">
                <div class="col">
                  <table class="table table-sm table-striped">
                    <thead>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Name</th>
                        ${this.gameData.playAs === constants.playAs.team
                          ? html`
                              <th scope="col">Team</th>
                            `
                          : ''}
                        <th scope="col">Tap Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${this.userDetails
                        .sort((a, b) => b.tapCount - a.tapCount)
                        .map((r, idx) => {
                          return html`
                            <tr>
                              <th scope="row">${idx + 1}</th>
                              <td>${r.userName}</td>
                              ${this.gameData.playAs === constants.playAs.team
                                ? html`
                                    <td>${r.team}</td>
                                  `
                                : ''}
                              <td>${r.tapCount}</td>
                            </tr>
                          `;
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            `}
      </div>
    `;
  }
}

customElements.define('app-tapit-admin', TapItAdmin);
