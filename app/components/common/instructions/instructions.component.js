import { LitElement, html } from "lit-element";
import gameStatic from '../../../staticData/games';

class Instructions extends LitElement {

    static get properties() {
        return {
            gameId: { type: String },
            currentGame: { type: Object }
        }
    }
    constructor() {
        super();
        this.currentGame = { instructions: [] };
    }

    firstUpdated() {
        this.currentGame = gameStatic.find(r => r.id === this.gameId);
    }
    render() {
        return html`
        <css-ele></css-ele>
        <div class="row" style="margin-top:0.6rem">
            <div class="col">
        <div class="card">
  <div class="card-header">
    ${this.currentGame.title} Play Instructions
  </div>
  <ul class="list-group list-group-flush">
      ${this.currentGame.instructions.map((r, idx) => {
            return html`<li class="list-group-item">${idx + 1}. ${r.comment}</li>`
        })}
  </ul>
</div>
</div>
        </div>
`
    }
}

customElements.define('app-game-instruction', Instructions);