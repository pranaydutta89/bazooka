import { LitElement, html } from "lit-element";
import './tapIt.component';
import '../../../common/instructions/instructions.component';
import constants from "../../../../services/constants";

class TapItInit extends LitElement {

    static get properties() {
        return {
            isGameStarted: { type: String },
            gameData: { type: Object }
        }
    }

    constructor() {
        super();
        this.isGameStarted = false;
    }

    startGame(data) {
        this.isGameStarted = true;
        this.gameData = data.detail;
    }

    render() {
        return html`
          ${
            this.isGameStarted ? html`<app-tapit .gameData='${this.gameData}'></app-tapit>` :
                html`<div>
                <app-team-details @start=${this.startGame}></app-team-details >
                <app-game-instruction .gameId=${constants.game.tapIt}></app-game-instruction>
                </div>
                `
            }
            `;
    }
}

customElements.define('app-tapit-init', TapItInit);