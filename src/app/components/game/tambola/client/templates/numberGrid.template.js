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
    ${_this.gridVal.map(r => {
      return html`
        <div class="row wrapper">
          ${r.map(j => {
            return html`
              <div class="col boxes">
                ${j}
              </div>
            `;
          })}
        </div>
      `;
    })}
  `;
};
