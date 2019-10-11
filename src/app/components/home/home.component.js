import { LitElement, html } from 'lit-element';
import staticData from '../../staticData/pages/home';
import '../common/fabButton/fab.component';
import router from '../../services/routerService';
import image from './images/Group_1.jpg';
class Home extends LitElement {
  constructor() {
    super();
    document.title = 'Real-time,online,simple,collaborative,team mini gaming platform';
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="home">
        <div class="imageDiv">
          <img .src=${image} class="img-fluid" alt="Responsive image" />
        </div>
        <div class="pageText">
          <div class="mainText">
            <h1>A new gaming <span>experience</span></h1>
          </div>
          <div class="secondaryText">
            <h2>
              Play on the go !! Bazooka is a real-time, simple, collaborative, online, mini gaming platform with
              multiple mini gaming options. Play with your friends, family or any stranger. You sure will have a
              competitive surge in you playing this. Its simple gaming concept makes it easy for use in any age group,
              be it children or elders, it doesn’t let anyone miss the fun. Have an inhouse party with friends, family
              function or searching for games in birthday parties ? Your search ends here, join a large group of people
              and let the complete group enjoy the game together.
            </h2>
          </div>
          <div class="buttonsDiv">
            <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-primary"
              >Explore Games</a
            >
            <a href="#/game/tapIt" @click="${evt => this.linkClick(evt, `/game/tapIt`)}" class="btn btn-secondary"
              >Read More</a
            >
          </div>
        </div>

        <div class="intro">
          <h3>How Bazooka Works?</h3>
          <div class="setUp">
            <div class="steps">
              <div class="row">
                <div class="col-12 col-md-4">
                  <div class="card-vertical card">
                    <div class="card-header">1</div>
                    <div class="card-body">
                      <h5 class="card-title">Setup Game Room</h5>
                      <p class="card-text">
                        It takes less than 20 seconds to setup a game room on different game modes.
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="card-vertical card">
                    <div class="card-header">2</div>
                    <div class="card-body">
                      <h5 class="card-title">Host</h5>
                      <p class="card-text">
                        Host the admin screen on any platform to engage colleagues,your friends or family members
                      </p>
                    </div>
                  </div>
                </div>

                <div class="col-12 col-md-4">
                  <div class="card-vertical card">
                    <div class="card-header">3</div>
                    <div class="card-body">
                      <h5 class="card-title">Play</h5>
                      <p class="card-text">
                        All set! Join bazooka game with shared PIN by host and play from your mobile.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="specs">
              <div class="card-horizontal card">
                <div class="row no-gutters">
                  <div class="col-md-2">
                    <div class="card-header">
                      <i class="fas fa-user-circle"></i>
                    </div>
                  </div>
                  <div class="col-md-10">
                    <div class="card-body">
                      <h5 class="card-title"><span>No</span> Login Required</h5>
                      <p class="card-text">
                        Worried about privacy and login detail of all players ? Just don’t, as this does not require any
                        login details and you can rather choose a special gaming name for yourself. As bazooka is
                        designed for players of all age groups we just expect everyone to have a hassle free gaming
                        experience. We cant expect your grandma/grandpa to have an email id. We just want them to play
                        this with you together, as its too easy to get them engaged in it.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="card-horizontal card">
                <div class="row no-gutters">
                  <div class="col-md-2">
                    <div class="card-header">
                      <i class="fas fa-database"></i>
                    </div>
                  </div>
                  <div class="col-md-10">
                    <div class="card-body">
                      <h5 class="card-title"><span>No</span> Database Involved</h5>
                      <p class="card-text">
                        Bazooka is a play in the go gaming application. We do not store any data of your previous games
                        or players involved
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('app-home', Home);
