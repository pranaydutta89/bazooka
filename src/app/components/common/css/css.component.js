import { html, LitElement } from "lit-element";

export default class Css extends LitElement {
  createRenderRoot() {
    return this;
  }

  static get colors() {
    return {
      primaryColor: "#488aff",
      primaryFontColor: "black",
      secondaryColor: "#32db64",
      dangerColor: "#f53d3d"
    };
  }

  render() {
    return html`
      <link
        rel="stylesheet"
        href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
        crossorigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Ubuntu&display=swap"
        rel="stylesheet"
      />
      <style>
        * {
          font-family: "Ubuntu", sans-serif;
        }
      </style>
    `;
  }
}

customElements.define("css-ele", Css);
