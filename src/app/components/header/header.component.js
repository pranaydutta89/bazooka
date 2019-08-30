import { LitElement, html } from "lit-element";
import routes from "../routes";
class Header extends LitElement {
  static get properties() {
    return {
      currentRoute: { type: String }
    };
  }

  constructor() {
    super();
    this.currentRoute = "/home";
  }

  createRenderRoot() {
    return this;
  }

  linkClick(event, route) {
    event.preventDefault();
    this.currentRoute = route;
    routes.navigate(route);
  }

  render() {
    return html`
      <css-ele></css-ele>
      <style>
        .heading {
          margin-bottom: 0.5rem;
        }
      </style>
      <div class="heading">
        <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
          <a
            class="navbar-brand"
            href="/home"
            @click="${evt => this.linkClick(evt, "/home")}"
            >{ Bazooka }</a
          >
          <button
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

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li
                class="nav-item ${this.currentRoute === "/home"
                  ? "active"
                  : "empty"}"
              >
                <a
                  class="nav-link"
                  href="/home"
                  @click="${evt => this.linkClick(evt, "/home")}"
                  >Home</a
                >
              </li>
              <li
                class="nav-item ${this.currentRoute === "/games"
                  ? "active"
                  : "empty"}"
              >
                <a
                  class="nav-link"
                  href="/games"
                  @click="${evt => this.linkClick(evt, "/games")}"
                  >Games</a
                >
              </li>
              <li
                class="nav-item ${this.currentRoute === "/about"
                  ? "active"
                  : "empty"}"
              >
                <a
                  class="nav-link"
                  href="/about"
                  @click="${evt => this.linkClick(evt, "/about")}"
                  >About</a
                >
              </li>
            </ul>
          </div>
        </nav>
      </div>
    `;
  }
}

customElements.define("app-header", Header);
