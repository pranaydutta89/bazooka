import { LitElement, html } from "lit-element";

class Alert extends LitElement {

  static get properties() {
    return {
      type: { type: String },
      message: { type: String },
      status: { type: String }
    }
  }

  constructor() {
    super();
    this.type = 'info';
    this.status = 'hide'
    this.message = '';
  }

  performUpdate() {
    if (this.status === 'show') {

      if (this.timeout) {
        clearTimeout(this.timeout);
      }

      this.timeout = setTimeout(() => {
        this.status = 'hide';
      }, 5000)
    }
  }

  get renderByAlertType() {
    switch (this.type) {
      case 'info':
        return html`<div class="alert alert-info" role="alert">
  ${this.message}
</div>`

      case 'error':
        return html`<div class="alert alert-danger" role="alert">
 ${this.message}
</div>`

      case 'success':
        return html`<div class="alert alert-success" role="alert">
  ${this.message}
</div>`

      default:
        return html`<div class="alert alert-primary" role="alert">
          ${this.message}
        </div>`

    }
  }
  render() {
    return html`
    ${this.status === 'show' ?
        html`<div class='row'>
         <div class='col'>
           ${this.renderByAlertType}
  </div>
       </div>`
        : ''
      }
     `
  }
}


customElements.define('app-alert', Alert);