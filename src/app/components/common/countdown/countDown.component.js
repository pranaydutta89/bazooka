import { LitElement, html } from 'lit-element';

class CountDown extends LitElement {
  static get properties() {
    return {
      countDownText: { type: String },
      seconds: { type: Number },
      startText: { type: String },
      endText: { type: String }
    };
  }

  constructor() {
    super();
    this.seconds = 6;
    this.startText = 'READY';
    this.endText = 'GO!!!';
  }

  firstUpdated() {
    this.countDownText = this.startText;
    this.countdown();
  }

  countdown() {
    let counter = this.seconds;
    const countdown = setInterval(() => {
      this.countDownText = --counter;
      if (counter === 0) {
        clearInterval(countdown);
        this.countDownText = this.endText;
        setTimeout(() => {
          this.ended();
        }, 1000);
      }
    }, 1000);
  }

  ended() {
    const event = new CustomEvent('ended', {
      detail: {
        teamName: this.teamName,
        team: this.team
      }
    });
    this.dispatchEvent(event);
  }

  render() {
    return html`
      <style>
        .loading {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: grey;
          opacity: 0.9;
          z-index: 1;
        }

        .countDown {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-top: -20px;
          margin-left: -25px;
          width: 50px;
          height: 40px;
          text-align: center;
          font-size: 10px;
        }
      </style>

      <div class="loading">
        <div class="countDown">
          <div class="d-flex justify-content-center">
            <h1>${this.countDownText}</h1>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-countdown', CountDown);
