import { LitElement, html } from "lit-element";

class Alert extends LitElement {

  static get properties() {
    return {
      type: { type: String },
      message: { type: String },
      keepOpen: { type: Boolean },
      positionFixed: { type: Boolean },
      status: {
        type: String,
      }
    }
  }

  constructor() {
    super();
    this.type = 'info';
    this.status = 'hide'
    this.message = '';
    this.keepOpen = false;
    this.positionFixed = false;
  }

  performUpdate() {
    if (this.status === 'show') {

      if (!this.keepOpen) {
        if (this.timeout) {
          clearTimeout(this.timeout);
        }

        this.timeout = setTimeout(() => {
          this.status = 'hide';
          const event = new CustomEvent('close', {
            detail: {
              teamName: this.teamName,
              team: this.team
            }
          });
          this.dispatchEvent(event);
        }, 5000);
      }
    }
    super.performUpdate();
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
    <css-ele></css-ele>
    <style>
      .posFixed{
position:fixed;
bottom:0;width:
100%;
z-index:1030;
      }
      </style>
    ${this.status === 'show' ?
        html`<div class='row ${this.positionFixed ? 'posFixed' : 'empty'}'>
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