import { LitElement, html } from "lit-element";
import './tapIt.component';
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
            this.isGameStarted ? html`<app-tapit data='${JSON.stringify(this.gameData)}'></app-tapit>` :
                html`<app-team-details @start=${this.startGame}></app - team - details >`
            }
            `;
    }
}

customElements.define('app-tapit-init', TapItInit);