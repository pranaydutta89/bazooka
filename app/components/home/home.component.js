import { LitElement, html } from "lit-element";
import staticData from '../../staticData/pages/home.js';
class Home extends LitElement {


  render() {
    return html`
    <css-ele></css-ele>
  
    <div class='home'>
     ${staticData.intro.map(r => {
      return html`
         <div class="card" style="margin-bottom:0.6rem">
  <div class="card-header">
    ${r.title}
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