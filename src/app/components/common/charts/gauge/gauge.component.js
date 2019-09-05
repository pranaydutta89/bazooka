/* eslint-disable no-undef */
import { LitElement, html } from 'lit-element';

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

  configureChart() {
    return new Promise(res => {
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
      google.charts.setOnLoadCallback(() => {
        this.data = google.visualization.arrayToDataTable([['Label', 'Value'], [this.label, 0]]);
        res();
      });
    });
  }

  firstUpdated() {
    this.chart = new google.visualization.Gauge(this.shadowRoot.getElementById('chartContainer'));
  }

  async performUpdate() {
    await this.configureChart();
    if (this.chart) {
      this.data.setValue(0, 1, this.val);
      this.chart.draw(this.data, this.options);
    }
    super.performUpdate();
  }

  render() {
    return html`
      <css-ele></css-ele>
      <div class="row">
        <div class="col" style="text-align:center">
          <div style="width: 20vw; height: 20vh;margin:0 auto" id="chartContainer"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-chart-gauge', GaugeChart);
