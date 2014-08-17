$(function () {
    $('#googlePlus').mouseenter(function () {
        $(this).attr("src", "gpInv.png");
    });
    $('#googlePlus').mouseleave(function () {
        $(this).attr("src", "gp.png");
    });
});