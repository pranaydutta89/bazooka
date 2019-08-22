import { LitElement } from "lit-element";
import socketio from "../../../../services/socketio";

class TapItPlayInit extends LitElement {
  static get properties() {
    return {
      data: { type: Object },
      teamSelected: { type: String }
    }
  }



  render() {

    return html`${
      this.teamSelected ?
        html`<app-tapit-play roomId=${this.data.roomId} team=${this.teamSelected}></app-tapit-play>`
        : html`
       <div>
         <div class='row'>
           <div class='col mx-auto'>
             <h4>Select Your Team</h4>
    </div>
         </div>


         <div class='row'>
           <div class='col'>
             <table class="table table-striped table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
            </tr>
          </thead>
          <tbody>
            ${this.data.team.map((name, idx) => {
          return html`
       <tr style='cursor:pointer' @click=${this.teamSelected = name}>
      <th scope="row">${idx + 1}</th>
      <td>${name}</td>
    </tr>
      `
        })}

          </tbody>
        </table>
    </div>
    </div>
       </div>
   `}`
  }
}

customElements.define('app-tapit-play-init', TapItPlayInit);