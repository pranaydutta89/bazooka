import { html } from 'lit-html';

export default _this => {
  return html`
    <div class="row" style="margin-top:0.6rem">
      <div class="col">
        ${_this.userDetails.length === 0
          ? html`
              <app-alert keepOpen="true" type="warning" message="No user joined yet"></app-alert>
            `
          : html`
              <table class="table table-sm table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">First Five</th>
                    <th scope="col">Top Line</th>
                    <th scope="col">Middle Line</th>
                    <th scope="col">Bottom Line</th>
                    <th scope="col">Full House</th>
                  </tr>
                </thead>
                <tbody>
                  ${_this.userDetails
                    .sort((a, b) => b.tapCount - a.tapCount)
                    .map((r, idx) => {
                      return html`
                        <tr>
                          <th scope="row">${idx + 1}</th>
                          <td>${r.userName}</td>
                          <td>${5 - r.firstFiveCount}</td>
                          <td>
                            ${5 - r.topLineCount}
                          </td>
                          <td>
                            ${5 - r.middleLineCount}
                          </td>
                          <td>
                            ${5 - r.bottomLineCount}
                          </td>
                          <td>
                            ${15 - r.fullHouseCount}
                          </td>
                        </tr>
                      `;
                    })}
                </tbody>
              </table>
            `}
      </div>
    </div>
  `;
};
