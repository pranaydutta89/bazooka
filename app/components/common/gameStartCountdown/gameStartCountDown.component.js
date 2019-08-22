import { LitElement, html } from "lit-element";

class GameStartCountDown extends LitElement {


  static get properties() {
    return {
      countDownText: { type: String }
    }
  }

  constructor() {
    super();
    this.countDownText = 'READY';

  }

  firstUpdated() {
    let counter = 5;
    const countdown = setInterval(() => {
      this.countDownText = counter;
      counter--
      if (counter === 0) {
        this.countDownText = 'GO'
        clearInterval(countdown);
        this.started();
      }
    }, 1000);
  }

  started() {
    const event = new CustomEvent('started', {
      detail: {
        teamName: this.teamName,
        team: this.team
      }
    });
    this.dispatchEvent(event);
  }

  render() {
    return html` 
    <css-ele></css-ele>
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
    
      <div class='loading'>
        <div class="countDown">
          <div class="d-flex justify-content-center">
            <h1>${this.countDownText}</h1>
          </div>
        </div>
      </div>

    `
  }
}

customElements.define('app-countdown', GameStartCountDown);