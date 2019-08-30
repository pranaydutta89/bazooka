import { LitElement, html } from "lit-element";
import '../common/alert/alert.component';
import '../common/spinner/spinner.component';
import constants from "../../services/constants";
class Footer extends LitElement {

    static get properties() {
        return {
            spinnerStatus: { type: String },
            alertStatus: { type: String },
            alertType: { type: String },
            alertMessage: { type: String }
        }
    }

    constructor() {
        super();
        this.alertStatus = 'hide';
        this.alertType = 'info';
        this.spinnerStatus = 'hide';
        document.addEventListener(constants.domEvents.triggerSpinner, this.spinnerEventListener.bind(this), false);
        document.addEventListener(constants.domEvents.triggerAlert, this.alertEventListener.bind(this), false);
    }

    spinnerEventListener(data) {
        this.spinnerStatus = data.detail ? 'show' : 'hide';
    }

    alertEventListener(data) {
        this.alertType = data.detail.type;
        this.alertStatus = 'show';
        this.alertMessage = data.detail.message;
    }

    render() {
        return html`
            <div>
            <app-spinner .isStarted=${this.spinnerStatus}></app-spinner>
             <app-alert positionFixed='true' @close=${() => this.alertStatus = 'hide'} 
             .status=${this.alertStatus} .type=${this.alertType} .message=${this.alertMessage}></app-alert>
            </div>
        `
    }
}

customElements.define('app-footer', Footer);