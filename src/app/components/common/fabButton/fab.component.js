import { LitElement, html } from 'lit-element';

class Fab extends LitElement {
  static get properties() {
    return {
      text: { type: String }
    };
  }

  buttonClicked() {
    const event = new CustomEvent('click', {
      detail: {
        teamName: this.teamName,
        team: this.team
      }
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <style>
        .kc_fab_main_btn {
          background-color: #f44336;
          width: 60px;
          height: 60px;
          border-radius: 100%;
          background: #f44336;
          border: none;
          outline: none;
          color: #fff;
          font-size: 36px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
          transition: 0.3s;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          position: fixed;
          bottom: 0.6rem;
          right: 0.6rem;
          z-index: 1031;
        }
      </style>
      <button @click=${this.buttonClicked} class="kc_fab_main_btn">
        ${this.text}
      </button>
    `;
  }
}

customElements.define('app-fab-button', Fab);
