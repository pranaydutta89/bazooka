import { LitElement, html } from 'lit-element';
import socketService from '../../../services/socketService';
import constants from '../../../services/constants';
import eventDispatch from '../../../services/eventDispatch';

class ClientUrl extends LitElement {
  static get properties() {
    return {
      gameData: { type: Object },
      clientUrl: { type: String }
    };
  }

  constructor() {
    super();
  }

  copyClientUrl() {
    const copyText = this.shadowRoot.getElementById('clientUrl');
    copyText.select();
    document.execCommand('copy');
    eventDispatch.triggerAlert('Copied URL,share this with players');
  }

  async firstUpdated() {
    this.clientUrl = `${location.origin}/#/play/${await socketService.api({
      event: constants.socketDataEvents.encryptClientUrl,
      data: this.gameData
    })}`;
  }

  render() {
    return html`
      <div class="row">
        <div class="col">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="basic-addon3">Game Link</span>
            </div>
            <input type="text" class="form-control" id="clientUrl" .value=${this.clientUrl} readonly />
            <div class="input-group-append" style="cursor:pointer">
              <span class="input-group-text" id="basic-addon2" @click=${this.copyClientUrl}>Click here to copy</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-client-url', ClientUrl);
