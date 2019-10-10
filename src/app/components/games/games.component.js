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

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="games">
        <h1>Gaming <span>options</span></h1>
        <div class="gameList">
          <div class="row">
            <div class="col">
              <div class="card-vertical card">
                <div class="card-header"><i class="far fa-hand-point-up"></i></div>
                <div class="card-body">
                  <h5 class="card-title">Tap It</h5>
                  <p class="card-text">
                    It takes less than 20 seconds to setup a game room on different game modes.
                  </p>
                  <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-primary"
                    >Play</a
                  >
                  <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-secondary"
                    >How to Play?</a
                  >
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card-vertical card">
                <div class="card-header"><i class="fas fa-ticket-alt"></i></div>
                <div class="card-body">
                  <h5 class="card-title">eTambola</h5>
                  <p class="card-text">
                    It takes less than 20 seconds to setup a game room on different game modes.
                  </p>
                  <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-primary"
                    >Play</a
                  >
                  <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-secondary"
                    >How to Play?</a
                  >
                </div>
              </div>
            </div>

            <div class="col">
              <div class="card-vertical card">
                <div class="card-header"><i class="fas fa-arrows-alt-h"></i></div>
                <div class="card-body">
                  <h5 class="card-title">Tug Of War</h5>
                  <p class="card-text">
                    It takes less than 20 seconds to setup a game room on different game modes.
                  </p>
                  <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-primary"
                    >Play</a
                  >
                  <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-secondary"
                    >How to Play?</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="row">
          <div class="col">
            ${gamesStatic.map(r => {
          return html`
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">${r.title}</h5>
                <p class="card-text">${r.summary}</p>
                <a href="#/game/${r.id}" @click="${evt => this.linkClick(evt, `/game/${r.id}`)}" class="btn btn-primary"
                  >Play</a
                >
              </div>
            </div>
          `;
        })}
          </div>
        </div> -->
      </div>
    `;
  }
}

customElements.define('app-games', Games);
