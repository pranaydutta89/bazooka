import { LitElement, html } from "lit-element";
import './tapIt/admin/tapItInit.component';
import '../common/teamDetails/teamDetails.component'
import constants from "../../services/constants";
class Game extends LitElement {


    static get properties() {
        return {
            gameId: { type: String }
        }
    }

    constructor() {
        super();
        this.gameId = '';
    }

    selectGame() {
        switch (this.gameId) {
            case constants.game.tapIt:
                return html`<app-tapit-init></app-tapit-init>`;
        }
    }

    render() {
        return html`${this.selectGame()}`;
    }
}


customElements.define('app-game', Game);