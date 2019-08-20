import { LitElement, html } from "lit-element";

class TapIt extends LitElement {

  static get properties() {
    return {
      data: { type: Object }
    }
  }

  firstUpdated(changedProperties) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  drawChart() {
    var data = google.visualization.arrayToDataTable([
      ['Element', 'Density', { role: 'style' }],
      ['Copper', 8.94, '#b87333'],            // RGB value
      ['Silver', 10.49, 'silver'],            // English color name
      ['Gold', 19.30, 'gold'],
      ['Platinum', 21.45, 'color: #e5e4e2'], // CSS-style declaration
    ]);
  }


  render() {
    return html`
    <div>
    <div class='row'>
      <div class="col">
         <div id="chart_div"></div>
      </div>
    </div>

    <div class='row'>

  </div>
    </div>
    `
  }

}

customElements.define('app-tapit', TapIt);