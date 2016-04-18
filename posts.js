var blogApp = angular.module('blogApp', []);

blogApp.controller('blogCtrl', function($scope) {
    $scope.posts = [{
        "title": "Gongolierium! - Neural Network Edition",
        "subtitle": "Training a neural network to play Gongolierium!",
        "image": "https://raw.githubusercontent.com/kylecorry31/LANN/master/Gongolierium.png",
        "backgroundPosition": "top center",
        "content": "Neural networks are very adaptive systems, and can be used to do a wide variety of tasks. They are ideal for sensor processing, classification, regression, and even learning how to play games.",
        "link": "#",
        "date": 1460865600000
    },
    {
        "title": "LANN",
        "subtitle": "Lightweight Artificial Neural Network for Java",
        "image": "https://raw.githubusercontent.com/kylecorry31/LANN/master/LANN.jpg",
        "backgroundPosition": "center center",
        "content": "LANN is an Java library for neural networks and matrices.",
        "link": "https://github.com/kylecorry31/LANN",
        "date": 1460865600000
    }];
    $scope.shortenDescription = function(desc){
      if(desc.length < 200){
        return desc;
      } else {
        var short = desc.substring(0, 200);
        return short + "..."
      }
    }
});
