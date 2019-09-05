import { html } from 'lit-html';

export default _this => {
  return html`
    ${_this.userDetails.length === 0
      ? html`
          <app-alert keepOpen="true" message="No user joined yet"></app-alert>
        `
      : html`
          <div>
            <div class="row">
              <div class="col">
                <h5>Players Speedometer</h5>
              </div>
            </div>
            <div class="row">
              ${_this.userDetails.map(r => {
                return html`
                  <div class="col">
                    <div class="row">
                      <div class="col" style="text-align:center">
                        <h6>${r.userName} Total {${r.tapCount}}</h6>
                      </div>
                    </div>
                    <app-chart-gauge
                      .options=${_this.gaugeOption}
                      label="Taps/sec"
                      .val=${r.tapSpeed}
                    ></app-chart-gauge>
                  </div>
                `;
              })}
            </div>
          </div>
        `}
  `;
};
