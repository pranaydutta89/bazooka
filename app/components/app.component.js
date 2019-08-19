import { LitElement, html } from 'lit-element';
import './appMain.component';
import { routerMixin } from 'lit-element-router';
import css from './common/css/css.component';
import './header/header.component';
import './home/home.component';
import './games/games.component';
import routes from './routes';

class App extends routerMixin(LitElement) {

  static get properties() {
    return {
      route: { type: String },
      params: { type: Object }
    }
  }
  constructor() {
    super();
    this.route = '';
  }

  static get routes() {
    return routes;
  }

  onRoute(route, params, query, data) {
    this.route = route;
    this.params = params;
  }
  createRenderRoot() {
    return this;
  }

  selectGame(gameId) {
    switch (gameId) {
      case 'tapit':
        return html`<app-tapit></app-tapit>`
    }
  }

  render() {

    return html`
    <css-ele></css-ele>
    <div>
      <app-header></app-header>
      <div class="container-fluid">
        <app-main current-route='${this.route}'>
          <app-home route='home'></app-home>
    
          <app-games route='games'>
          </app-games>
    
          <div route='game'>
            ${this.route === 'game' ? this.selectGame(this.params.id) : ''}
          </div>
    
        </app-main>
      </div>
    </div>`;
  }
}
customElements.define('app-init', App);
