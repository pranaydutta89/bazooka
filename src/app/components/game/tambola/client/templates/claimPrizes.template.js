import { html } from 'lit-html';

export default _this => {
  return html`
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button
          type="button"
          .disabled=${!_this.isEligibleForFullHouse}
          @click=${() => _this.claimPrize('fullHouse')}
          class="btn btn-block btn-primary"
        >
          Tap to Claim Full House
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button
          type="button"
          .disabled=${!_this.isEligibleForTopRow}
          @click=${() => _this.claimPrize('topRow')}
          class="btn btn-block btn-secondary"
        >
          Tap to Claim Top Row
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button
          type="button"
          .disabled=${!_this.isEligibleForMiddleRow}
          @click=${() => _this.claimPrize('middleRow')}
          class="btn btn-block btn-success"
        >
          Tap to Claim Middle Row
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button
          type="button"
          .disabled=${!_this.isEligibleForBottomRow}
          @click=${() => _this.claimPrize('bottomRow')}
          class="btn btn-block btn-info"
        >
          Tap to Claim Bottom Row
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button
          type="button"
          .disabled=${!_this.isEligibleForFirstFive}
          @click=${() => _this.claimPrize('firstFive')}
          class="btn btn-block btn-dark"
        >
          Tap to Claim First Five
        </button>
      </div>
    </div>
  `;
};
