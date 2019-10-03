import { LitElement, html } from 'lit-element';
import routes from '../../services/routerService';
class Header extends LitElement {
  static get properties() {
    return {
      currentRoute: { type: String },
      collapse: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.collapse = true;
    this.currentRoute = '/home';
  }

  createRenderRoot() {
    return this;
  }

  linkClick(event, route) {
    event.preventDefault();
    this.currentRoute = route;
    routes.navigate(route);
    this.collapse = true;
  }

  render() {
    return html`
      <header>
        <div class="sticky-top">
          <nav class="navbar navbar-expand-lg bg-secondary">
            <a class="navbar-brand" href="/home" @click="${evt => this.linkClick(evt, '/home')}">Bazooka</a>
            <button
              @click=${() => (this.collapse = !this.collapse)}
              class="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span class="navbar-toggler-icon"></span>
            </button>

            <div class="navbar-collapse ${this.collapse ? 'collapse' : 'empty'}" id="navbarSupportedContent">
              <ul class="navbar-nav ml-auto">
                <li class="nav-item ${this.currentRoute === '/home' ? 'active' : 'empty'}">
                  <div @click="${evt => this.linkClick(evt, '/home')}">Home</div>
                </li>
                <li class="nav-item ${this.currentRoute === '/games' ? 'active' : 'empty'}">
                  <div @click="${evt => this.linkClick(evt, '/games')}">Explore Games</div>
                </li>
                <li class="nav-item ${this.currentRoute === '/about' ? 'active' : 'empty'}">
                  <div href="/about" @click="${evt => this.linkClick(evt, '/about')}">About</div>
                </li>
                <li class="nav-item ${this.currentRoute === '/about' ? 'active' : 'empty'}">
                  <div href="/about" @click="${evt => this.linkClick(evt, '/about')}">Contact</div>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </header>
    `;
  }
}

customElements.define('app-header', Header);
