import { LitElement, html } from 'lit-element';
import constants from '../../../services/constants';

class PlayTypeWrapper extends LitElement {
  static get properties() {
    return {
      playType: { type: String },
      playTypeRender: { type: String }
    };
  }

  firstUpdated() {
    this.renderPlayComponent();
  }

  async renderPlayComponent() {
    switch (this.playType) {
      case constants.playType.tap:
        await import('./tap/tap.component');
        break;
      case constants.playType.scroll:
        await import('./scroll/scroll.component');
        break;
      case constants.playType.grid:
        await import('./grid/grid.component');
        break;
    }
    this.playTypeRender = this.playType;
  }

  render() {
    return html`
      ${this.playTypeRender === constants.playType.tap
        ? html`
            <app-play-tap></app-play-tap>
          `
        : ''}
      ${this.playTypeRender === constants.playType.grid
        ? html`
            <app-play-grid></app-play-grid>
          `
        : ''}
      ${this.playTypeRender === constants.playType.scroll
        ? html`
            <app-play-scroll></app-play-scroll>
          `
        : ''}
    `;
  }
}

customElements.define('app-play-wrapper', PlayTypeWrapper);
