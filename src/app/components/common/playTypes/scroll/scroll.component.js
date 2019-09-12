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
    this.clickedWindow = [];
    this.divArr = [];
    this.pageCount = 100000;
  }

  scrollEventTrack() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
      if (this.divArr.length < this.pageCount) {
        for (let i = 0; i < 10; i++) {
          this.divArr.push(i);
        }
        this.requestUpdate();
      }
    }
  }

  connectedCallback() {
    document.addEventListener('scroll', this.scrollEventTrack.bind(this));
    super.connectedCallback();
  }

  disconnectedCallback() {
    document.removeEventListener('scroll', this.scrollEventTrack.bind(this));
    super.disconnectedCallback();
  }

  firstUpdated() {
    for (let i = 0; i < 10; i++) {
      this.divArr.push(i);
    }
    this.requestUpdate();
  }

  scrolled(tapNum) {
    const max = this.clickedWindow.length !== 0 ? this.clickedWindow.reduce((m, x) => (m > x ? m : x)) : 0;
    if (tapNum > max) {
      const event = new CustomEvent('task', {
        detail: {
          count: tapNum
        },

        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
      this.clickedWindow.push(tapNum);
    }
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
          <div
            class="row"
            @touchstart=${() => {
              this.scrolled(idx);
            }}
          >
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
