import { LitElement, html } from 'lit-element';
import css from './common/css/css.component';
import './header/header.component';
import './home/home.component';
import './games/games.component';
import './game/game.component';
import utilService from '../services/utilService';
import constants from '../services/constants';
import './game/tapIt/client/tapitPlayInit.component';
import './about/about.components';
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
      .on('/', (params, query) => {
        this.currentRoute = 'home'
      })
      .resolve();
    router
      .on('/home', (params, query) => {
        this.currentRoute = 'home';
      })
      .resolve();
    router
      .on('/games', (params, query) => {
        this.currentRoute = 'games';
      })
      .resolve();

    router
      .on('/game/:id', (params, query) => {
        this.currentRoute = 'game';
        this.params = params;
      })
      .resolve();
    router
      .on('/about', (params, query) => {
        this.currentRoute = 'about';
      })
      .resolve();
    router
      .on('/play', (params, query) => {
        this.currentRoute = 'play';
      })
      .resolve();
  }



  get renderClientGame() {
    const game = utilService.getQueryStringValue('game');
    const data = {
      roomId: utilService.getQueryStringValue('roomId'),
      team: JSON.parse(utilService.getQueryStringValue('data')).team,
      roomName: JSON.parse(utilService.getQueryStringValue('data')).roomName
    }
    switch (game) {
      case constants.game.tapIt:
        return html`<app-tapit-play-init gameData=${JSON.stringify(data)}></app-tapit-play-init>`
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
        return html`<app-game route='game' gameId=${this.params.id}></app-game>`
      case 'about':
        return html`<app-about></app-about>`
      case 'play':
        return this.renderClientGame;

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
