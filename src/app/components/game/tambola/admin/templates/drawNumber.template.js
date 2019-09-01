import { html } from 'lit-html';

export default _this => {
  return html`
    <div class="row">
      <div class="col">
        ${_this.currentDrawnNumber}
      </div>
    </div>
  `;
};
