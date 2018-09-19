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
