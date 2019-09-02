import { html } from 'lit-html';

export default _this => {
  return html`
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button type="button" @click=${() => _this.claimPrize('fullHouse')} class="btn btn-block btn-primary">
          Tap to Claim Full House
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button type="button" @click=${() => _this.claimPrize('topRow')} class="btn btn-block btn-secondary">
          Tap to Claim Top Row
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button type="button" @click=${() => _this.claimPrize('middleRow')} class="btn btn-block btn-success">
          Tap to Claim Middle Row
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button type="button" @click=${() => _this.claimPrize('bottomRow')} class="btn btn-block btn-info">
          Tap to Claim Bottom Row
        </button>
      </div>
    </div>
    <div class="row" style="margin-bottom:0.6rem">
      <div class="col">
        <button type="button" @click=${() => _this.claimPrize('firstFive')} class="btn btn-block btn-light">
          Tap to Claim First Five
        </button>
      </div>
    </div>
  `;
};
