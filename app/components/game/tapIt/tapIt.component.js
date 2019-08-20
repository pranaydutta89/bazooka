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
      ['City', '2010 Population',],
      ['New York City, NY', 8175000],
      ['Los Angeles, CA', 3792000],
      ['Chicago, IL', 2695000],
      ['Houston, TX', 2099000],
      ['Philadelphia, PA', 1526000]
    ]);

    var options = {
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

    var chart = new google.visualization.BarChart(document.getElementById('chart_div'));

    chart.draw(data, options);
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