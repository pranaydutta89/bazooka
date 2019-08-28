import { LitElement, html } from "lit-element";
import staticData from '../../staticData/pages/home.js';
import '../common/fabButton/fab.component';
import router from '../routes';
class Home extends LitElement {

  constructor() {
    super();
    document.title = 'Real-time,online,simple,collaborative,team mini gaming platform';
  }

  render() {
    return html`
    <css-ele></css-ele>
    <style>
    .home{
      position:relative
    }
    </style>
    <div class='home'>
      <app-fab-button text='{+}' @click=${() => router.navigate('/games')}></app-fab-button>
        <div class='row'>
     ${staticData.intro.map(r => {
      return html`
    
        <div class="col-md-6">
         <div class="card" style="margin-bottom:0.6rem">
  <div class="card-header">
    <h6>${r.title}</h6>
  </div>
  <div class="card-body">
    <blockquote class="blockquote mb-0">
      <p>${r.summary}</p>
    </blockquote>
  </div>
</div>
        </div>
     
        `
    })}
 
 </div>
    </div>`
  }
}

customElements.define('app-home', Home);