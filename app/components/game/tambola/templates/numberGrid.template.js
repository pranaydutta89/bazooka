import { html } from "lit-html";

export default (_this) => {

    const generateGridHtml = () => {
        const arr = []
        for (let i = 1; i <= _this.endNumber; i++) {
            arr.push(i);
        }
    }

    return html`
    <style>
       .wrapper{
         border-color:grey;
       }
       .boxes{
          border-right:solid;
       }
    </style>
        <div class="row wrapper">
            ${generateGridHtml().map(r => {
        return html`
        <div class='col boxes' @click=${()=>_this.numberClicked(r)}>
                      ${r}  
                  </div>`
    })}          
        </div>
    `
}