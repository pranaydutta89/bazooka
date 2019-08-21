import { LitElement, html } from "lit-element";

class Spinner extends LitElement {


  static get properties() {
    return {
      isStarted: {
        type: String,
      }
    }
  }

  constructor() {
    super();
    this.isStarted = 'hide';
  }

  render() {
    return html` 
    <css-ele></css-ele>
    <style>
    .loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: grey;
    opacity: 0.6;
    z-index: 1;
}

.spinner-cus {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -25px;
  width: 50px;
  height: 40px;
  text-align: center;
  font-size: 10px;
}
    </style>
    ${this.isStarted == 'show' ? html`
    <div class='loading'>
      <div class="spinner-cus">
      <div class="d-flex justify-content-center">
    <div class="spinner-grow text-warning" role="status">
  <span class="sr-only"></span>
    </div>
      </div>
  </div>
</div>`
        : ''}
`
  }
}

customElements.define('app-spinner', Spinner);