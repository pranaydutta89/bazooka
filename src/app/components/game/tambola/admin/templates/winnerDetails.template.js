import { html } from 'lit-html';

export default _this => {
  return html`
    ${_this.winnerDetails.length > 0
      ? _this.winnerDetails.map(r => {
          return html`
            <app-alert keepOpen="true" type="success" .message=${r}></app-alert>
          `;
        })
      : html`
          <app-alert keepOpen="true" type="warning" message="No winners yet"></app-alert>
        `}
  `;
};
