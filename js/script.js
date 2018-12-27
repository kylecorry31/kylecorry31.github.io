function loadNavigationBar(current, prefix){
  if (typeof prefix === "undefined"){
    prefix = "";
  }
  var xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.onload = function(){
    var navigation = document.getElementById('navigation');
    var data = this.response;

    var navigationItems = data.pages.map(page => `
      <a href="${prefix + page.url}" class="${current === page.url ? 'active': ''}">${page.title}</a>
      `).join('');

    navigation.innerHTML = navigationItems;
  };
  xhr.open("GET", "data/sitemap.json");
  xhr.send();
}


class GalleryImage extends HTMLElement {
  constructor(){
    super();

    let tmpl = document.createElement('template');
    tmpl.innerHTML = `
    <style>
    :host {
      position: relative;
      width: 25%;
      height: 25vw;
      margin: 0;
      padding: 0;
      overflow: hidden;
    }

    @media(max-width:800px) {
        :host {
            width: 50%;
            height: 50vw;
        }
    }

    @media(max-width:500px) {
        :host {
            width: 100%;
            height: 100vw;
        }
    }

    :host img {
        width: 100%;
        height: 100%;
    }

    :host .title {
        display: flex;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        text-align: center;
        text-transform: uppercase;
        font-size: 24px;
        font-style: normal;
        font-weight: lighter;
        line-height: 2em;
        letter-spacing: .06em;
        color: black;
        opacity: 0;
        background: white;
        transition: opacity 300ms cubic-bezier(.33,0,.2,1);
        text-rendering: optimizeLegibility;
    }

    :host .title:hover, :host a:focus .title {
        opacity: 0.95;
    }

    </style>
      <a href="${this.getAttribute('url')}">
        <div class="title">${this.getAttribute('title')}</div>
      </a>
      <img src="${this.getAttribute('img')}">
    `;

    let shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(tmpl.content.cloneNode(true));

    this.setAttribute('here', '')
  }
}

window.customElements.define('gallery-image', GalleryImage);
