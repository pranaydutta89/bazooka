import { LitElement, html } from "lit-element";
import socketio from "../../../../services/socketio";

class TapItPlay extends LitElement {

  static get properties() {
    return {
      roomId: { type: String },
      team: { type: String },
      isGameStarted: { type: Boolean }
    }
  }
  constructor() {
    super();
    this.listeners = [];
    this.isGameStarted = false;
    this.joinRoom();
  }

  async joinRoom() {
    await socketio.joinRoom(false, this.roomId);
    this.listeners.push(socketio.receiveDataClient(this.receiveData.bind(this)));
  }

  receiveData(msg) {
    switch (msg.event) {
      case 'startGame':
        this.startGame(msg.data);
        break;
    }
  }

  startGame() {
    this.isGameStarted = true;
  }

  gameStarted() {
    this.isGameStarted = false;
  }
  render() {

    return html`
    ${this.isGameStarted ? html`<app-countdown @started=${this.gameStarted}></app-countdown>` : ''}
      <div>
         <div class="row">
           <div class="col">
             <h1>Tap Anywhere in yellow</h1>
           </div>
         </div>
      </div>
    `
  }
}

customElements.define('app-tapit-play', TapItPlay);