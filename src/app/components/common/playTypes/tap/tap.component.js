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
    const event = new CustomEvent('task', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
    this.tapCount += 1;
  }
  render() {
    return html`
      <css-ele></css-ele>
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
