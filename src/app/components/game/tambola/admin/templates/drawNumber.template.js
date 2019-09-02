import { html } from 'lit-html';

export default _this => {
  return html`
    <style>
      .numberWrapper {
        width: 100%;
        height: 20vh;
        text-align: center;
        background-color: aliceblue;
        background-clip: content-box;
      }

      .numberWrapper h1 {
        font-size: 16vh;
      }
    </style>
    <div class="row">
      <div class="col numberWrapper">
        ${typeof _this.currentDrawnNumber === 'number'
          ? html`
              <h1>${_this.currentDrawnNumber}</h1>
            `
          : html`
              <h5>${_this.currentDrawnNumber}</h5>
            `}
      </div>
    </div>
  `;
};
