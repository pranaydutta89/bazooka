/* eslint-disable no-undef */
import { LitElement } from 'lit-element';

class GaugeChart extends LitElement {
  static get properties() {
    return {
      options: { type: Object },
      data: { type: Array },
      label: { type: String },
      val: { type: Number }
    };
  }
  constructor() {
    super();
    this.data = [];
    this.label = 'Param';
  }

  firstUpdated() {
    this.options = {
      ...{
        redFrom: 90,
        redTo: 100,
        yellowFrom: 75,
        yellowTo: 90,
        minorTicks: 1
      },
      ...this.options
    };
    google.charts.load('current', { packages: ['gauge'] });
    google.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  drawChart() {
    this.data = google.visualization.arrayToDataTable([['Label', 'Value'], [this.label, 0]]);
    this.chart = new google.visualization.Gauge(this.shadowRoot.getElementById('chartContainer'));
    this.chart.draw(this.data, this.options);
  }

  performUpdate() {
    this.data.setValue(0, 1, this.val);
    this.chart.draw(this.data, this.options);
    super.performUpdate();
  }

  render() {
    return html`
      <css-ele></css-ele>
      <div class="row">
        <div class="col">
          <div style="width: 10vw; height: 10vh;" id="chartContainer"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-chart-gauge', GaugeChart);
