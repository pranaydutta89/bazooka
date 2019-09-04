import { html } from 'lit-html';
import constants from '../../../../../services/constants';

export default _this => {
  return html`
    <style>
      .teamRed {
        height: 20vh;
        position: relative;
      }
      .teamBlue {
        position: relative;
        height: 20vh;
      }
      .teamBlue .colorDiv {
        height: 20vh;
        position: absolute;
        background-color: blue;
        top: 0;
        left: 0;
      }

      .teamRed .colorDiv {
        height: 20vh;
        position: absolute;
        background-color: red;
        top: 0;
        right: 0;
      }

      h4 {
        position: absolute;

        height: 20vh;
        line-height: 20vh;
      }
    </style>
    <div>
      <div class="row">
        <div class="col teamRed">
          ${_this.currentDifference < 0
            ? html`
                <div style="position:relative;">
                  <div class="colorDiv" .style=${`width:${_this.currentWidth}%`}></div>
                </div>
              `
            : ''}
          <h4 style="right: 0;">${constants.dualTeam.teamRed}</h4>
        </div>
        <div class="col teamBlue">
          ${_this.currentDifference > 0
            ? html`
                <div style="position:relative;">
                  <div class="colorDiv" .style=${`width:${_this.currentWidth}%`}></div>
                </div>
              `
            : ''}
          <h4 style="left: 0;">${constants.dualTeam.teamBlue}</h4>
        </div>
      </div>
    </div>
  `;
};
