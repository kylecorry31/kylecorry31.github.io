var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function(){
	if (this.readyState !== 4) return;
	if (this.status !== 200){
		console.error("Could not load websites");
	}
  loadWebsites(JSON.parse(this.responseText));
};
xhr.open("GET", "/data/websites.json");
xhr.send();


function loadWebsites(websites){
  var websiteGallery = id("website-gallery");
  websiteGallery.innerHTML = "";

  websites['websites'].forEach(function(website){
    var title = elt("div", website.title);
    title.classList.add('title');

    var link = elt('a', title);
    link.href = website.url;

    var image = elt('img');
    image.src = "websites/" + website.image;

    var galleryImage = elt('div', image, link);
    galleryImage.classList.add('gallery-image');

    websiteGallery.appendChild(galleryImage);
  });

}


// DOM
function elt(type, ...children) {
   let node = document.createElement(type);
   for (let child of children) {
     if (typeof child !== "string") node.appendChild(child);
     else node.appendChild(document.createTextNode(child));
   }
   return node;
 }

function id(id){
  return document.getElementById(id);
}
