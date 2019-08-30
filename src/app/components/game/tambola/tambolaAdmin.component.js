import { LitElement } from "lit-element";
import numberGrid from "./templates/numberGrid.template";
class TambolaAdmin extends LitElement {
  static get properties() {
    return {
      isGameStarted: { type: Boolean },
      gameData: { type: Object },
      endNumber: { type: Number }
    };
  }

  constructor() {
    this.isGameStarted = false;
    this.endNumber = 49;
  }

  numberClicked(val) {}

  render() {
    return html`
      ${numberGrid(this)}
    `;
  }
}
