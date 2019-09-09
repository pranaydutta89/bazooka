import { LitElement, html } from 'lit-element';

class ScrollComponents extends LitElement {
  static get properties() {
    return {
      pageCount: { type: Number },
      divArr: { type: Array }
    };
  }

  constructor() {
    super();
    this.divArr = [];
    this.pageCount = 10000;
  }

  firstUpdated() {
    for (let i = 1; i <= this.pageCount; i++) {
      this.divArr.push(i);
    }
    this.requestUpdate();
  }

  scrolled() {
    const event = new CustomEvent('task', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <style>
        .textData {
          background: rgb(34, 193, 195);
          background: linear-gradient(0deg, rgba(34, 193, 195, 1) 0%, rgba(253, 187, 45, 1) 100%);
          height: 86vh;
          line-height: 86vh;
          text-align: center;
          border-style: groove;
          font-size: 10rem;
          border-radius: 5px;
          margin-bottom: 0.6rem;
        }
      </style>
      <css-ele></css-ele>
      ${this.divArr.map((r, idx) => {
        return html`
          <div class="row" @click=${this.scrolled}>
            <div class="col">
              <div class="textData">
                ${idx}
              </div>
            </div>
          </div>
        `;
      })}
    `;
  }
}

customElements.define('app-play-scroll', ScrollComponents);
