import { html } from 'lit-html';

export default _this => {
  return html`
    <style>
      .teamA {
        height: 10vh;
      }
      .teamB {
        height: 10vh;
      }
    </style>
    <div>
      <div class="row">
        <div class="col teamA"></div>
        <div class="col teamB"></div>
      </div>
    </div>
  `;
};
