import { LitElement, html } from 'lit-element';
import utilService from '../../../../services/utilService';

class GridComponent extends LitElement {
  static get properties() {
    return {
      count: { type: Number },
      divArr: { type: Array }
    };
  }
  constructor() {
    super();
    this.count = 5;
    this.divArr = [];
  }

  firstUpdated() {
    this.createGrid();
  }

  createGrid() {
    this.divArr = [];
    for (let i = 0; i < 30; i++) {
      this.divArr.push({
        selected: false,
        clicked: false,
        value: i
      });
    }

    this.numbers = utilService.randomNumberCount(0, 29, this.count);
    this.numbers.forEach(r => {
      const obj = this.divArr.find(t => t.value == r);
      obj.selected = true;
    });
  }

  boxClicked(val) {
    const numIdx = this.numbers.findIndex(r => r === val);
    if (numIdx >= 0) {
      this.numbers.splice(numIdx, 1);
      const obj = this.divArr.find(t => t.value === val);
      obj.clicked = true;
      this.requestUpdate();
    }
    if (this.numbers.length === 0) {
      const event = new CustomEvent('task', {
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
      this.createGrid();
    }
  }
  render() {
    return html`
      <css-ele></css-ele>
      <style>
        .boxes {
          height: 5vh;
          border-style: groove;
        }
      </style>
      <div class="row">
        ${this.divArr.map(r => {
          return html`
            ${r.selected
              ? html`
                  <div
                    class="col-4 offset-1 boxes"
                    .style=${`background-color:${r.clicked ? 'grey' : '#f56f6f'}`}
                    @click=${() => this.boxClicked(r.value)}
                  ></div>
                `
              : html`
                  <div class="col-4 offset-1 boxes"></div>
                `}
          `;
        })}
      </div>
    `;
  }
}

customElements.define('app-play-grid', GridComponent);
