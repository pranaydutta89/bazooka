import { LitElement } from "lit-element";
import socketService from "../../../services/socketService";
import events from '../../../../common/constants/events';
class ClientUrl extends LitElement {
  static get properties() {
    return {
      gameData: { type: Object },
      clientUrl: { type: String }
    }
  }

  copyClientUrl() {
    const copyText = this.shadowRoot.getElementById("clientUrl");
    copyText.select();
    document.execCommand("copy");
    this.setAlert('Copied URL,share this to players', 'show', 'success');
  }


  async firstUpdated() {
    this.clientUrl = await socketService.api({
      event: events.socketDataEvents.encryptClientUrl,
      data: `${location.origin}/#/play?gameData=${encodeURIComponent(JSON.stringify(this.gameData))}`
    });
  }

  render() {
    return html`<div class='row'>
      <div class='col'>
        <div class="input-group mb-3">
  <input type="text" class="form-control" id='clientUrl' .value=${this.clientUrl} readonly>
  <div class="input-group-append" style="cursor:pointer">
    <span class="input-group-text" id="basic-addon2" @click=${this.copyClientUrl}>Click to copy</span>
  </div>
</div>
      </div>
    </div>`
  }
}

customElements.define('app-client-url', ClientUrl);