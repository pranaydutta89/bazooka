import { LitElement, html } from 'lit-element';
import router from '../../services/routerService';
import gamesStatic from '../../staticData/games';

class Games extends LitElement {
  constructor() {
    super();
    document.title = 'Real-time and simple collaborative team games';
  }

  linkClick(event, route) {
    event.preventDefault();
    router.navigate(route);
  }

  render() {
    return html`
      <css-ele></css-ele>
      <div class="row">
        <div class="col">
          ${gamesStatic.map(r => {
            return html`
              <div class="card">
                <div class="card-body">
                  <h5 class="card-title">${r.title}</h5>
                  <p class="card-text">${r.summary}</p>
                  <a
                    href="#/game/${r.id}"
                    @click="${evt => this.linkClick(evt, `/game/${r.id}`)}"
                    class="btn btn-primary"
                    >Play</a
                  >
                </div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }
}

customElements.define('app-games', Games);
