import { LitElement, html } from "lit-element";
import socketService from "../../../services/socketService";
import utilService from "../../../services/utilService";
import "../../common/tap/tap.component";
import router from "../../routes";
import "../../common/alert/alert.component";
import constants from "../../../services/constants";
import eventDispatch from "../../../services/eventDispatch";

class TapItClient extends LitElement {
  static get properties() {
    return {
      team: { type: String },
      gameData: { type: Object },
      isGameStarted: { type: Boolean },
      isGameStarting: { type: Boolean },
      userName: { type: String }
    };
  }
  constructor() {
    super();
    this.listeners = [];
    this.isGameStarted = false;
    this.isGameStarting = false;
    window.onbeforeunload = this.leaveGame.bind(this);
    document.addEventListener(
      "visibilitychange",
      () => {
        if (document.hidden) {
          //this.leaveGame();
        }
      },
      false
    );
  }

  firstUpdated() {
    this.joinRoom();
  }
  disconnectedCallback() {
    this.leaveGame(false);
    this.listeners.forEach(r => r());
    super.disconnectedCallback();
  }
  async joinRoom() {
    try {
      await socketService.joinRoom(false, this.gameData.roomId);
      this.joinUser();
      this.listeners.push(
        socketService.receiveDataFromAdmin(this.receiveData.bind(this))
      );
    } catch (e) {
      eventDispatch.triggerAlert("Room does not exist,logging out");
      setTimeout(() => {
        router.navigate("/");
      }, 3000);
    }
  }

  async joinUser() {
    this.userId = utilService.generateUniqueBrowserId();
    const user = {
      id: this.userId,
      userName: this.userName,
      team: this.team
    };
    await socketService.sendDataToAdmin(this.gameData.roomId, {
      event: constants.socketDataEvents.userJoined,
      data: user
    });
  }

  userTapped() {
    socketService.sendDataToAdmin(
      this.gameData.roomId,
      {
        event: constants.socketDataEvents.userTapped,
        data: {
          id: this.userId
        }
      },
      false
    );
  }
  receiveData(msg) {
    switch (msg.event) {
      case "startGame":
        this.startingGame();
        break;

      case "endGame":
        this.endGame();
        break;

      case "tapSummary":
        this.tapDetails(msg.data);
        break;
    }
  }

  generateSummaryMessage(myTeamDetails, topTeamDetails, secondTeam) {
    if (topTeamDetails.teamName === this.team) {
      eventDispatch.triggerAlert(
        `${
          this.gameData.playAs === constants.playAs.team
            ? "Your team is"
            : "You are"
        } leading, second position is ${myTeamDetails.tapCount -
          secondTeam.tapCount} behind`
      );
    } else {
      eventDispatch.triggerAlert(
        `${
          this.gameData.playAs === constants.playAs.team
            ? "Your team is"
            : "You are"
        } trailing with ${topTeamDetails.tapCount -
          myTeamDetails.tapCount} taps from leading ${topTeamDetails.teamName}`,
        "error"
      );
    }
  }

  tapDetails(teamDetails) {
    if (this.isGameStarted) {
      teamDetails.sort((a, b) => b.tapCount - a.tapCount);
      const myTeam = teamDetails.find(r => r.teamName === this.team);
      this.generateSummaryMessage(myTeam, teamDetails[0], teamDetails[1]);
    }
  }

  endGame() {
    this.isGameStarted = false;
  }
  async startingGame() {
    await import(
      "../../common/gameStartCountdown/gameStartCountDown.component"
    );
    this.isGameStarting = true;
  }

  async leaveGame(route = true) {
    try {
      await socketService.sendDataToAdmin(this.gameDataroomId, {
        event: constants.socketDataEvents.userLeft,
        data: {
          id: this.userId
        }
      });
    } catch (e) {}
    if (route) {
      router.navigate("/");
    }
  }

  gameStarted() {
    this.isGameStarting = false;
    this.isGameStarted = true;
  }
  render() {
    return html`
      <css-ele></css-ele>
      <div class="row" style="margin-top:0.6rem">
        <div class="col" style="text-align:center">
          <h5>Hello!! Player ${this.userName}</h5>
        </div>
      </div>
      ${this.isGameStarting
        ? html`
            <app-countdown @started=${this.gameStarted}></app-countdown>
          `
        : ""}
      ${this.isGameStarted
        ? html`
            <div>
              <app-tap @tapped=${this.userTapped}></app-tap>
            </div>
          `
        : html`
            <app-alert
              status="show"
              keepOpen="true"
              type="warning"
              message="Game not yet started"
            ></app-alert>
          `}
      <div class="row" style="margin-top:0.6rem">
        <div class="col">
          <button
            type="button"
            class="btn btn-block btn-danger"
            @click=${this.leaveGame}
          >
            Leave Game
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define("app-tapit-client", TapItClient);
