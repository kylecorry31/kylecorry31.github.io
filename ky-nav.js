var link;
var kyTitle = document.getElementsByTagName('ky-title');
if (kyTitle.length > 0) {
    requestAnimationFrame(function() {
        var title = kyTitle[0];
        var titleDiv = document.createElement('div');
        titleDiv.id = 'ky-nav-title';
        titleDiv.innerHTML = title.innerHTML;
        title.parentElement.replaceChild(titleDiv, title);
    });
}

var navs = document.getElementsByTagName('ky-nav');

if (navs.length > 0) {
    requestAnimationFrame(function() {

        var nav = navs[0];
        var navLinks = nav.children;
        var title = navLinks[0];
        var links = [];
        for (var i = 1; i < navLinks.length; i++) {
            if (navLinks[i].getAttribute('ky-current') !== null) {
                navLinks[i].classList.add('ky-current');
            }
            links.push(navLinks[i]);
        }
        var newNav = document.createElement("div");
        newNav.id = "ky-nav-container";
        nav.parentElement.replaceChild(newNav, nav);

        createNavbar(newNav, title, links);
        document.getElementById("ky-menu-btn").addEventListener("click", showDrawer);
        document.getElementById("ky-close").addEventListener("click", hideDrawer);

    });
}

function showDrawer() {
    document.getElementById("ky-drawer").classList.add('visible');
    document.getElementsByTagName("body")[0].classList.add('noscroll');
}

function hideDrawer() {
    document.getElementById("ky-drawer").classList.remove('visible');
    document.getElementsByTagName("body")[0].classList.remove('noscroll');
}

function createNavbar(nav, title, links) {
    var navbar = document.createElement("div");
    navbar.id = "ky-nav";
    navbar.appendChild(title);
    var linkDiv = document.createElement("div");
    linkDiv.id = "ky-nav-links";
    var drawer = document.createElement("div");
    drawer.id = "ky-drawer";
    var close = document.createElement("div");
    close.id = "ky-close";
    close.innerHTML = "X";
    drawer.appendChild(close);
    links.forEach(function(link) {
        var l = link.cloneNode();
        l.innerHTML = link.innerHTML;
        linkDiv.appendChild(l);
        l = link.cloneNode();
        l.addEventListener("click", hideDrawer);
        l.innerHTML = link.innerHTML;
        drawer.appendChild(l);
    });
    navbar.appendChild(linkDiv);
    nav.appendChild(drawer);
    var menu = document.createElement("i");
    menu.classList.add("material-icons");
    menu.id = "ky-menu-btn";
    menu.innerHTML = "menu";
    navbar.appendChild(menu);
    nav.appendChild(navbar);
}

String.prototype.replaceAll = function(replace, replaceWith) {
    return this.replace(new RegExp(replace, "g"), replaceWith);
};
