import { LitElement, html } from 'lit-element';
import constants from '../../../../services/constants';

class PlayTypeSelection extends LitElement {
  radioClicked(evt) {
    const event = new CustomEvent('select', {
      detail: evt.target.value
    });
    this.dispatchEvent(event);
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="row">
        <div class="col-2">Play Type</div>
        <div class="col">
          <div class="form-check form-check-inline">
            <input
              @click=${this.radioClicked}
              class="form-check-input"
              type="radio"
              required
              name="playTypeOptions"
              .value=${constants.playType.tap}
            />
            <label class="form-check-label" for="inlineRadio1">${constants.playType.tap}</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              @click=${this.radioClicked}
              class="form-check-input"
              type="radio"
              required
              name="playTypeOptions"
              .value=${constants.playType.grid}
            />
            <label class="form-check-label" for="inlineRadio2">${constants.playType.grid}</label>
          </div>
          <div class="form-check form-check-inline">
            <input
              @click=${this.radioClicked}
              class="form-check-input"
              type="radio"
              required
              name="playTypeOptions"
              .value=${constants.playType.scroll}
            />
            <label class="form-check-label" for="inlineRadio3">${constants.playType.scroll}</label>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-play-selection', PlayTypeSelection);
