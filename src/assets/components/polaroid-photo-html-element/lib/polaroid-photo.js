class PolaroidPhoto extends HTMLElement {
    constructor(){
      super();
      this._shadow = this.attachShadow({"mode": "open"});
    }
  
  
    connectedCallback(){

      const rotation = +(this.getAttribute('rotation') || 0);
      const position = +(this.getAttribute('position') || 0);
      const zoomScale = +(this.getAttribute('scale') || 1);

      this._shadow.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');

        .polaroid {
            padding: 16px 16px 16px 16px;
            background-color: white;
            width: 200px;
            box-shadow: 0 1px 1.5px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
            margin: 8px;
            display: inline-block;
            transition: 0.5s ease all;
            transform: rotate(${Math.random() * rotation * 2 - rotation}deg);
            top: ${Math.random() * position * 2 - position}px;
            left: ${Math.random() * position * 2 - position}px;
        }
        
        .polaroid .polaroid-image {
            width: 200px;
            height: 200px;
            display: block;
            margin: 0;
            background-position: center;
            background-repeat: no-repeat;
            background-size: cover;
        }
        
        .polaroid p {
            display: block;
            padding-top: 16px;
            text-align: center;
            text-overflow: ellipsis;
            width: 200px;
            margin: 0;
            font-family: 'Indie Flower', cursive !important;
            line-height: 1rem !important;
            height: 2.5rem !important;
            max-height: 2.5rem !important;
            min-height: 2.5rem !important;
            font-size: 16px !important;
            vertical-align: middle !important;
        }
        
        .polaroid:hover {
            filter: none;
            box-shadow: 0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12);
            transform: scale(${zoomScale});
            z-index: 100;
          	position: relative;
        }
      </style>
  
      <div class="polaroid" style="filter: ${this.getAttribute('filter') || 'sepia(20%)'};">
        <div class="polaroid-image" style="background-image: url(${this.getAttribute('src') || ''});"></div>
        <p>${this.getAttribute('title') || ''}</p>
      </div>
      `;
    }
  
  }
  
  customElements.define('polaroid-photo', PolaroidPhoto);