import { LitElement, html } from "lit-element";
import utilService from "../../../../services/utilService";
class BarChart extends LitElement {
  static get properties() {
    return {
      xLabel: { type: String },
      yLabel: { type: String },
      data: { type: Object },
      options: { type: Object }
    };
  }

  constructor() {
    super();
    this.data = this.data || [];
    this.xLabel = this.xLabel || "x-axis";
    this.yLabel = this.yLabel || "y-axis";
    this.options = this.options || {
      title: "Live Chart",
      chartArea: { width: "100%" }
    };
  }
  firstUpdated(changedProperties) {
    google.charts.load("current", { packages: ["corechart", "bar"] });
    google.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  performUpdate() {
    this.drawChart();
    super.performUpdate();
  }

  drawChart() {
    if (this.data.length != 0) {
      const data = google.visualization.arrayToDataTable([
        [this.yLabel, this.xLabel, { role: "style" }, { role: "annotation" }],
        ...this.data
      ]);
      if (!this.chart) {
        this.chart = new google.visualization.BarChart(
          this.shadowRoot.getElementById("chart_div")
        );
      }
      this.chart.draw(data, this.options);
    }
  }

  render() {
    return html`
      <css-ele></css-ele>
      <div class="row">
        <div class="col">
          <div id="chart_div"></div>
        </div>
      </div>
    `;
  }
}

customElements.define("app-chart-bar", BarChart);
