import { html } from 'lit-html';

export default _this => {
  return html`
    <style>
      .wrapper {
        border-color: grey;
      }
      .boxes {
        border-style: groove;
        border-radius: 5px;
      }
      .selected {
        background-color: grey;
      }
    </style>
    <div class="col">
      <div class="row wrapper">
        ${_this.gridNumbers &&
          _this.gridNumbers.map(r => {
            return html`
              <div class="col boxes ${r.selected ? 'selected' : 'empty'}">
                ${r.label}
              </div>
            `;
          })}
      </div>
    </div>
  `;
};
