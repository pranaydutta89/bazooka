import { LitElement, html } from 'lit-element';
import './header/header.component';
import './game/gameClient.component';
import './footer/footer.component';
import router from '../services/routerService';
import socketService from '../services/socketService';
import constants from '../services/constants';

class App extends LitElement {
  static get properties() {
    return {
      params: { type: Object },
      currentRoute: { type: String }
    };
  }
  constructor() {
    super();
    this.currentRoute = 'home';
    // eslint-disable-next-line no-undef
    const loadingNode = document.getElementById('loadingInit');
    if (loadingNode) {
      loadingNode.remove();
    }
    this.attachRoute();
  }

  attachRoute() {
    router
      .on('/', async () => {
        await import('./home/home.component');
        this.currentRoute = 'home';
      })
      .resolve();
    router
      .on('/home', async () => {
        await import('./home/home.component');
        this.currentRoute = 'home';
      })
      .resolve();
    router
      .on('/games', async () => {
        await import('./games/games.component');
        this.currentRoute = 'games';
      })
      .resolve();

    router
      .on('/game/:id', async params => {
        await import('./game/gameAdmin.component');
        this.currentRoute = 'game';
        this.params = params;
      })
      .resolve();
    router
      .on('/about', async () => {
        await import('./about/about.components');
        this.currentRoute = 'about';
      })
      .resolve();
    router
      .on('/play/:id', async params => {
        await import('./game/gameClient.component');
        this.gameData = await socketService.api({
          event: constants.socketDataEvents.decryptClientUrl,
          data: params.id
        });
        this.currentRoute = 'play';
      })
      .resolve();
  }

  get renderClientGame() {
    return html`
      <app-game-client .gameData=${this.gameData}></app-game-client>
    `;
  }

  createRenderRoot() {
    return this;
  }

  get renderRoute() {
    switch (this.currentRoute) {
      case 'home':
        return html`
          <app-home></app-home>
        `;
      case 'games':
        return html`
          <app-games></app-games>
        `;
      case 'game':
        return html`
          <app-game route="game" .gameId=${this.params.id}></app-game>
        `;
      case 'about':
        return html`
          <app-about></app-about>
        `;
      case 'play':
        return this.renderClientGame;
    }
  }

  render() {
    return html`
      <div>
        <app-header></app-header>
        <div class="container-fluid">
          ${this.renderRoute}
        </div>
      </div>
      <app-footer></app-footer>
    `;
  }
}
customElements.define('app-init', App);
