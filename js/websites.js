getWebsites();
getPhotos();
// getProjects();

function getWebsites(){
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
}

function getPhotos(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (this.readyState !== 4) return;
		if (this.status !== 200){
			console.error("Could not load photos");
		}
	  loadPhotos(JSON.parse(this.responseText));
	};
	xhr.open("GET", "/data/photos.json");
	xhr.send();
}

function getProjects(){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (this.readyState !== 4) return;
		if (this.status !== 200){
			console.error("Could not load projects");
		}
	  loadProjects(JSON.parse(this.responseText));
	};
	xhr.open("GET", "/data/github.json");
	xhr.send();
}

function loadPhotos(photos){
	var photoGallery = id("photo-gallery");

	photoGallery.innerHTML = "<h1 class=\"center\" style=\"width: 100%;\">Photos</h1>" + 	photos.photos.map(function(photo){
		return `
		<div class="gallery-image">
			<img src="${photo}">
		</div>
		`
	}).join('')

}

function loadProjects(projects){
	var projectGallery = id("project-gallery");

	projectGallery.innerHTML = "<h1 class=\"center\">Projects</h1>" + 	projects.projects.map(function(project){
		return `
			<div class="project">
				<h2>${project.name}</h2>
				<h4>Type: ${project.type}</h4>
				<p>${project.description}</p>
				<p><a href="${project.url}" class="book-download">View on GitHub</a></p>
			</div>
		`
	}).join('')

}


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
