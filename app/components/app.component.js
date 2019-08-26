import { LitElement, html } from 'lit-element';
import css from './common/css/css.component';
import './header/header.component';
import utilService from '../services/utilService';
import constants from '../services/constants';

import router from './routes';

class App extends LitElement {

  static get properties() {
    return {
      params: { type: Object },
      currentRoute: { type: String }
    }
  }
  constructor() {
    super();
    this.currentRoute = 'home';
    this.attachRoute();
  }

  attachRoute() {
    router
      .on('/', async (params, query) => {
        await import('./home/home.component')
        this.currentRoute = 'home'
      })
      .resolve();
    router
      .on('/home', async (params, query) => {
        await import('./home/home.component')
        this.currentRoute = 'home';
      })
      .resolve();
    router
      .on('/games', async (params, query) => {
        await import('./games/games.component');
        this.currentRoute = 'games';
      })
      .resolve();

    router
      .on('/game/:id', async (params, query) => {
        await import('./game/game.component');
        this.currentRoute = 'game';
        this.params = params;
      })
      .resolve();
    router
      .on('/about', async (params, query) => {
        await import('./about/about.components');
        this.currentRoute = 'about';
      })
      .resolve();
    router
      .on('/play', (params, query) => {
        this.currentRoute = 'play';
      })
      .resolve();
  }



  async renderClientGame() {
    const game = utilService.getQueryStringValue('game');
    const gameData = JSON.parse(decodeURIComponent(utilService.getQueryStringValue('data')));
    const data = {
      roomId: utilService.getQueryStringValue('roomId'),
      team: gameData.team,
      roomName: gameData.roomName
    }

    switch (game) {
      case constants.game.tapIt:
        await import('./game/tapIt/client/tapitPlayInit.component');
        return html`<app-tapit-play-init .gameData=${data}></app-tapit-play-init>`
    }
  }


  createRenderRoot() {
    return this;
  }

  get renderRoute() {
    switch (this.currentRoute) {
      case 'home':
        return html`<app-home></app-home>`;
      case 'games':
        return html`<app-games></app-games>`
      case 'game':
        return html`<app-game route='game' .gameId=${this.params.id}></app-game>`
      case 'about':
        return html`<app-about></app-about>`
      case 'play':
        return this.renderClientGame();

    }
  }

  render() {

    return html`
    <css-ele></css-ele>
    <div>
      <app-header></app-header>
      <div class="container">
        ${this.renderRoute}
      </div>
    </div > `;
  }
}
customElements.define('app-init', App);
