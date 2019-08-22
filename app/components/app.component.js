import { LitElement, html } from 'lit-element';
import './appMain.component';
import { routerMixin } from 'lit-element-router';
import css from './common/css/css.component';
import './header/header.component';
import './home/home.component';
import './games/games.component';
import './game/game.component';
import routes from './routes';
import utilService from '../services/utilService';
import constants from '../services/constants';

class App extends routerMixin(LitElement) {

  static get properties() {
    return {
      route: { type: String },
      params: { type: Object },
      isAdmin: { type: Boolean }
    }
  }
  constructor() {
    super();
    this.route = '';

  }

  static get routes() {
    return routes;
  }

  checkUserType() {
    if (location.pathname === 'play') {
      this.isAdmin = false;
    } else {
      this.isAdmin = true;
    }
  }

  get renderClientGame(){
     const game = utilService.getQueryStringValue('game');
     const data ={
       roomId: utilService.getQueryStringValue('roomId'),
       data: JSON.parse(utilService.getQueryStringValue('data'))
     }
     switch(game){
       case constants.game.tapIt:
         return html `<app-tapit-play-init data=${JSON.stringify(data)}></app-tapit-play-init>`
     }
  }

  onRoute(route, params, query, data) {
    this.route = route;
    this.params = params;
  }
  createRenderRoot() {
    return this;
  }

  setGame() {
    return html`<app-game gameId='${this.params && this.params.id}'></app-game>`
  }

  render() {

    return html`
    <css-ele></css-ele>
    <div>
      <app-header></app-header>
      <div class="container-fluid">
        ${this.isAdmin ? html `
        <app-main current-route='${this.route}'>
          <app-home route='home'></app-home>
    
          <app-games route='games'>
          </app-games>
    
          <div route='game'>
            ${this.setGame()}
          </div>
    
        </app-main>`:
         html `
            ${this.renderClientGame}
         `}
      </div>
    </div>`;
  }
}
customElements.define('app-init', App);
