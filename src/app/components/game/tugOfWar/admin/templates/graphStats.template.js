import { html } from 'lit-html';
import constants from '../../../../../services/constants';

export default _this => {
  return html`
    <style>
      .teamRed {
        height: 10vh;
        position: relative;
        padding-right: 0 !important;
      }
      .teamBlue {
        position: relative;
        height: 10vh;
        padding-left: 0 !important;
      }
      .teamBlue .colorDiv {
        height: 10vh;
        border-radius: 0 5px 5px 0;
        position: absolute;
        background-color: #aec6cf;
        top: 0;
        left: 0;
      }

      .teamRed .colorDiv {
        height: 10vh;
        position: absolute;
        border-radius: 5px 0 0 5px;
        background-color: #ff6961;
        top: 0;
        right: 0;
      }

      h6 {
        position: absolute;
        text-align: center;
        width: 100%;
        height: 10vh;
        line-height: 10vh !important;
        color: #404346;
      }
    </style>
    <div>
      <div class="row">
        <div class="col teamRed">
          <div style="position:relative;">
            <div class="colorDiv" .style=${`width:${_this.currentDifference < 0 ? _this.currentWidth : 100}%`}></div>
          </div>

          <h6>${constants.dualTeam.teamRed} (+${Math.abs(_this.currentDifference)})</h6>
        </div>
        <div class="headerDivider"></div>
        <div class="col teamBlue">
          <div style="position:relative;">
            <div class="colorDiv" .style=${`width:${_this.currentDifference > 0 ? _this.currentWidth : 100}%`}></div>
          </div>
          <div style="position:relative;">
            <div class="colorDiv" .style=${`width:${_this.currentWidth}%`}></div>
          </div>
          <h6>${constants.dualTeam.teamBlue} (+${Math.abs(_this.currentDifference)})</h6>
        </div>
      </div>
    </div>
  `;
};
