import { LitElement, html } from "lit-element";
import './tapIt/tapIt.component';

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
            case 'tapit':
                return html`<app-tapit></app-tapit>`
        }
    }

    render() {
        return html`${this.selectGame()}`
    }
}


customElements.define('app-game', Game);