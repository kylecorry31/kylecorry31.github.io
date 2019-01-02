class GalleryImage extends HTMLElement {
  constructor(){
    super();

    this._shadow = this.attachShadow({mode: 'open'});
  }


  connectedCallback(){
    this._shadow.innerHTML = `
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
  }

}


class FeaturedGallery extends HTMLElement {
  constructor(){
    super();
    this._shadow = this.attachShadow({mode: 'open'});
  }


  connectedCallback(){

    fetch(this.getAttribute('data-url'))
  		.then((res) => res.json())
  		.then((data) => {
  			this._shadow.innerHTML = `<style>
          :host {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: flex-start;
            justify-content: flex-start;
            width: 100%;
          }

        </style>`
        + data.items.map(function(item){
      		return `
      		<gallery-image img="${item.image}" url="${item.url}" title="${item.title}"></gallery-image>
      		`
      	}).join('');
  		});
  }

}


class NavigationBar extends HTMLElement {

  constructor(){
    super();
    this._shadow = this.attachShadow({mode: 'open'});
  }

  connectedCallback(){

    fetch(this.getAttribute('sitemap'))
  		.then((res) => res.json())
  		.then((data) => {
  			this._shadow.innerHTML = `<style>
          :host {
            display: flex;
            flex: auto;
            flex-direction: row;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
          }

          :host a {
            margin: 16px 24px 16px 24px;
            text-align: center;
            text-decoration: none;
            text-transform: uppercase;
            font-size: 13px;
            font-style: normal;
            font-weight: 400;
            line-height: 1em;
            letter-spacing: .14em;
            color: rgba(130, 130, 130, .57);
            transition: color 140ms cubic-bezier(.33,0,.2,1);
          }

          :host a.active, :host a:hover {
              color: rgb(130, 130, 130);
          }

        </style>`
        + data.pages.map(page => `
          <a href="${(this.getAttribute('prefix') || '') + page.url}" class="${this.getAttribute('current') === page.url ? 'active': ''}">${page.title}</a>
          `).join('');;
  		});
  }

}

class DownloadableContent extends HTMLElement {
  constructor(){
    super();
    this._shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback(){
    this._shadow.innerHTML = `

      <style>
      @import "style.css";

      #download-btn {
          display: inline-block;
          margin-bottom: 32px;
          padding: 8px 16px;
          min-width: 80px;
          border: 2px solid black !important;
          text-align: center;
          text-transform: uppercase;
          color: black !important;
          background-color: white;
          transition: 0.1s ease all;
          text-decoration: none;
      }

      #download-btn:hover, #download-btn:focus {
          text-decoration: none !important;
          color: white !important;
          background-color: black;
      }


      </style>

      <h1>${this.getAttribute('header') || ''}</h1>
      <p><slot></slot></p>
      <a href="${this.getAttribute('src') || '#'}" id="download-btn" role="button">${this.getAttribute('download-label') || 'Download'}</a>
    `;
  }
}


window.customElements.define('gallery-image', GalleryImage);
window.customElements.define('featured-gallery', FeaturedGallery);
window.customElements.define('navigation-bar', NavigationBar);
window.customElements.define('downloadable-content', DownloadableContent);
