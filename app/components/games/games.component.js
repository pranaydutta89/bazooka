import { LitElement, html } from "lit-element";
import router from '../routes';

class Games extends LitElement {


  createRenderRoot() {
    return this;
  }

  linkClick(event, route) {
    event.preventDefault();
    router.navigate(route);
  }

  render() {
    return html`
    <css-ele></css-ele>
    <div class="row">
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Tap It</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="/game/tapit" @click='${(evt) => this.linkClick(evt, '/game/tapit')}' class="btn btn-primary">Play</a>
          </div>
        </div>
      </div>
      <div class="col-sm-6">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div>
    </div>
    `;
  }
}

customElements.define('app-games', Games);