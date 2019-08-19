import { LitElement, html } from 'lit-element'
import { routerOutletMixin } from 'lit-element-router'

export class Main extends routerOutletMixin(LitElement) {
}

customElements.define('app-main', Main);