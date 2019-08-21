import { LitElement, html } from "lit-element";

class BarChart extends LitElement {

  static get properties() {
    return {
      xLabel: { type: String },
      yLabel: { type: String },
      data: { type: Object },
      options: { type: Object }
    }
  }

  constructor() {
    super();
    this.data = this.data || []
    this.options = this.options || {
      title: 'Population of Largest U.S. Cities',
      chartArea: { width: '50%' },
      hAxis: {
        title: 'Total Population',
        minValue: 0
      },
      vAxis: {
        title: 'City'
      }
    };

  }
  firstUpdated(changedProperties) {
    google.charts.load('current', { packages: ['corechart', 'bar'] });
    google.charts.setOnLoadCallback(this.drawChart.bind(this));
  }

  drawChart() {

    const data = google.visualization.arrayToDataTable([
      ['City', '2010 Population',],
      ['New York City, NY', 8175000],
      ['Los Angeles, CA', 3792000],
      ['Chicago, IL', 2695000],
      ['Houston, TX', 2099000],
      ['Philadelphia, PA', 1526000]
    ]);

    const chart = new google.visualization.BarChart(this.shadowRoot.getElementById('chart_div'));
    chart.draw(data, this.options);
  }

  render() {
    return html`
    <css-ele></css-ele>
    <div class='row'>
      <div class="col">
         <div id="chart_div"></div>
      </div>
    </div>
    `
  }
}

customElements.define('app-chart-bar', BarChart);