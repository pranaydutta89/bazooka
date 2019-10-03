import { LitElement, html } from 'lit-element';

class Tap extends LitElement {
  static get properties() {
    return {
      tapCount: { type: Number }
    };
  }

  constructor() {
    super();
    this.tapCount = 0;
  }
  tapped() {
    this.tapCount += 1;
    const event = new CustomEvent('task', {
      detail: {
        count: this.tapCount
      },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  render() {
    return html`
      <style>
        .wrapper {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #e9ecef;
          z-index: 1;
        }

        .tap {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -20px;
          margin-left: -25px;
          width: 50px;
          height: 40px;
          text-align: center;
          font-size: 10px;
          cursor: pointer;
        }
      </style>

      <div class="wrapper" @click=${this.tapped}>
        <div class="tap">
          <div class="d-flex justify-content-center">
            <div class="spinner-grow text-danger" role="status">
              <span class="sr-only"> </span>
            </div>
          </div>
        </div>
        <div class="tap">
          <h1>${this.tapCount}</h1>
        </div>
      </div>
    `;
  }
}

customElements.define('app-play-tap', Tap);
