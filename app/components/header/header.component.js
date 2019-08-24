import { LitElement, html } from "lit-element";
import routes from '../routes';
class Header extends LitElement {


  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }
  linkClick(event, route) {
    event.preventDefault();
    routes.navigate(route);
  }

  render() {
    return html`
    <style>
      .heading{
         margin-bottom:0.5rem
      }
    </style>
    <div class="heading">
<nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-primary">
  <a class="navbar-brand" href="/" @click='${(evt) => this.linkClick(evt, '/')}'>{ Bazooka }</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="/" @click='${(evt) => this.linkClick(evt, '/')}'>Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/games" @click='${(evt) => this.linkClick(evt, '/games')}'>Games</a>
      </li>
     <li class="nav-item">
        <a class="nav-link" href="/about" @click='${(evt) => this.linkClick(evt, '/about')}'>About</a>
      </li>
    </ul>
  </div>
</nav>
    </div>
`
  }
}

customElements.define('app-header', Header);