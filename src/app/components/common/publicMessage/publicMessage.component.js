import { LitElement, html } from 'lit-element';

class PublicMessage extends LitElement {
  static get properties() {
    return {
      message: { type: String }
    };
  }

  constructor() {
    super();
    this.message = '';
  }

  render() {
    return html`
      <css-ele></css-ele>
      <style>
        .wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: grey;
          opacity: 0.9;
          z-index: 1;
        }

        .message {
          margin-top: 51%;
          text-align: center;
          font-size: xx-large;
          color: white;
        }
      </style>
      ${this.message !== ''
        ? html`
            <div class="wrapper">
              <div class="message">
                <div class="d-flex justify-content-center">
                  <h1>${this.message}</h1>
                </div>
              </div>
            </div>
          `
        : ''}
    `;
  }
}

customElements.define('app-public-message', PublicMessage);
