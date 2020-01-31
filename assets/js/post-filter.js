(function() {

    function showPostsInCategory(tag){
        var posts = document.getElementsByClassName('post');

        for (var i = 0; i < posts.length; i++){
            var post = posts[i];
            if (!tag){
                post.classList.remove('hidden');
            } else if (post.classList.contains('post-' + tag)) {
                post.classList.remove('hidden');
            } else {
                post.classList.add('hidden');
            }
        }
    }


    var filter = document.getElementById("filter");
    filter.addEventListener('change', function(){
        var tag = filter.value;

        if (tag === 'all'){
            tag = undefined;
        }

        showPostsInCategory(tag);
    });

    try {
        var query = new URLSearchParams(location.search).get('category');
        if (query && query !== 'all'){
            filter.value = query;
            if (!filter.value){
                filter.value = 'all'
            } else {
                showPostsInCategory(filter.value);
            }
        }
    } catch(e) {
        console.error(e);
    }

})();