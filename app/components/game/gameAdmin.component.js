import { LitElement, html } from "lit-element";
import './tapIt/tapItAdmin.component';
import '../common/instructions/instructions.component';
import constants from "../../services/constants";
import '../common/teamDetails/teamDetails.component';
import '../common/instructions/instructions.component';
import staticGames from '../../staticData/games';

class GameAdmin extends LitElement {

    static get properties() {
        return {
            isGameStarted: { type: String },
            gameData: { type: Object },
            gameId: { type: String }
        }
    }

    constructor() {
        super();
        this.isGameStarted = false;
    }

    firstUpdated() {
        document.title = staticGames.find(r => r.id === constants.game.tapIt).title;
    }

    startGame(data) {
        this.isGameStarted = true;
        this.gameData = data.detail;
    }

    get renderGame() {
        switch (this.gameId) {
            case constants.game.tapIt:
                return html`<app-tapit .gameData='${this.gameData}'></app-tapit>`;
        }
    }

    render() {
        return html`
          ${
            this.isGameStarted ? this.renderGame :
                html`<div>
                <app-team-details @start=${this.startGame}></app-team-details >
                <app-game-instruction .gameId=${constants.game.tapIt}></app-game-instruction>
                </div>
                `
            }
            `;
    }
}

customElements.define('app-game', GameAdmin);