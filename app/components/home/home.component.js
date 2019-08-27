import { LitElement, html } from "lit-element";
import staticData from '../../staticData/pages/home.js';
class Home extends LitElement {

  constructor() {
    super();
    document.title = 'Real-time,online,simple,collaborative,team mini gaming platform';
  }

  render() {
    return html`
    <css-ele></css-ele>
  
    <div class='home'>
     ${staticData.intro.map(r => {
      return html`
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
        `
    })}
 

    </div>`
  }
}

customElements.define('app-home', Home);