import { html } from 'lit-html';

export default _this => {
  return html`
    <div class="row">
      ${_this.userDetails.map(r => {
        return html`
          <div class="col">
            <div class="row">
              <div class="col">
                <h5>${r.userName} ${r.tapCount}</h5>
              </div>
            </div>
            <app-chart-gauge label="Taps/sec" .val=${r.tapSpeed}></app-chart-gauge>
          </div>
        `;
      })}
    </div>
  `;
};
