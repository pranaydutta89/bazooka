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

      @media (max-width: 575.98px) {
        .mobile-format {
          font-size: medium;
          padding-left: 0 !important;
          padding-right: 0 !important;
          min-width: 10vw !important;
          text-align: center;
        }
      }
    </style>
    <fieldset .disabled=${!_this.isGameStarted}>
      <div class="col">
        ${_this.gridVal.map(r => {
          return html`
            <div class="row wrapper justify-content-center">
              ${r.map(j => {
                return html`
                  <div
                    .disabled=${!_this.isGameStarted}
                    @click=${() => {
                      if (_this.isGameStarted) {
                        !j.selected && _this.numberClicked(j.value);
                        j.selected = true;
                      }
                    }}
                    style="cursor:pointer"
                    class="col-1 boxes mobile-format ${j.selected ? 'selected' : 'empty'}"
                  >
                    ${j.value && j.value <= 9 ? '0' + j.value : j.value}
                  </div>
                `;
              })}
            </div>
          `;
        })}
      </div>
    </fieldset>
  `;
};
