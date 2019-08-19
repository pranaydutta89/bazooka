import { LitElement, html } from "lit-element";
import { routerLinkMixin } from 'lit-element-router';
class Header extends routerLinkMixin(LitElement) {

  createRenderRoot() {
    return this;
  }
  linkClick(event, route) {
    event.preventDefault();
    this.navigate(route);
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
  <a class="navbar-brand" href="/" @click='${(evt) => this.linkClick(evt, '/')}'>{ Zopata }</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item active">
        <a class="nav-link" href="/" @click='${(evt) => this.linkClick(evt, '/')}'>Home</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="games" @click='${(evt) => this.linkClick(evt, 'games')}'>Games</a>
      </li>
     <li class="nav-item">
        <a class="nav-link" href="#">About</a>
      </li>
    </ul>
  </div>
</nav>
    </div>
`
  }
}

customElements.define('app-header', Header);