import { html } from 'lit-html';

export default _this => {
  return html`
    <style>
      .winnerWrapper {
        max-height: 20vh;
        overflow-y: scroll;
      }
    </style>
    ${_this.winnerDetails.length > 0
      ? html`
          <div class="winnerWrapper">
            ${_this.winnerDetails.map(r => {
              return html`
                <app-alert keepOpen="true" type="success" .message=${r}></app-alert>
              `;
            })}
          </div>
        `
      : html`
          <app-alert keepOpen="true" type="warning" message="No winners yet"></app-alert>
        `}
  `;
};
