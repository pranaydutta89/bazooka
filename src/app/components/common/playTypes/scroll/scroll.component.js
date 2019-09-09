import { LitElement } from 'lit-element';

class ScrollComponents extends LitElement {
  static get properties() {
    return {
      pageCount: { type: Number },
      divArr: { type: Array }
    };
  }

  constructor() {
    super();
    this.pageCount = 0;
  }

  firstUpdated() {
    this.divArr = new Array(this.pageCount);
  }

  render() {}
}

customElements.define('app-play-scroll', ScrollComponents);
