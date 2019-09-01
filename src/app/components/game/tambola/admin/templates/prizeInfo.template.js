import { html } from 'lit-html';

export default _this => {
  return html`
    <div>
      <div class="row">
        <div class="col-sm-10">
          <app-alert
            keepOpen="true"
            type="success"
            .message=${`Full house winners left : ${_this.fullHousePrizeLeft}`}
          ></app-alert>
        </div>
        <div class="col-sm-2">
          <input
            class="form-control"
            type="number"
            .value=${_this.fullHousePrizeLeft}
            @change=${evt => (_this.fullHousePrizeLeft = evt.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
      </div>
      <div class="row">
        <div class="col-sm-10">
          <app-alert
            keepOpen="true"
            type="warning"
            .message=${`Top row winners left : ${_this.topRowPrizeLeft}`}
          ></app-alert>
        </div>
        <div class="col-sm-2">
          <input
            class="form-control"
            type="number"
            .value=${_this.topRowPrizeLeft}
            @change=${evt => (_this.topRowPrizeLeft = evt.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col-sm-10">
          <app-alert
            keepOpen="true"
            type="info"
            .message=${`Middle row winners left : ${_this.middlePrizeLeft}`}
          ></app-alert>
        </div>
        <div class="col-sm-2">
          <input
            class="form-control"
            type="number"
            .value=${_this.middlePrizeLeft}
            @change=${evt => (_this.middlePrizeLeft = evt.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col-sm-10">
          <app-alert
            keepOpen="true"
            type="danger"
            .message=${`Bottom row winners left : ${_this.bottomPrizeLeft}`}
          ></app-alert>
        </div>
        <div class="col-sm-2">
          <input
            class="form-control"
            type="number"
            .value=${_this.bottomPrizeLeft}
            @change=${evt => (_this.bottomPrizeLeft = evt.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
      </div>

      <div class="row">
        <div class="col-sm-10">
          <app-alert
            keepOpen="true"
            type="dark"
            .message=${`First five winners left : ${_this.firstFivePrizeLeft}`}
          ></app-alert>
              </div>
        <div class="col-sm-2">
          <input
            class="form-control"
            type="number"
            .value=${_this.firstFivePrizeLeft}
            @change=${evt => (_this.firstFivePrizeLeft = evt.target.value)}
            min="1"
            max="5"
            required
          />
        </div>
      </div>
        </div>
      </div>
    </div>
  `;
};
