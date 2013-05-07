function imgClick(url){
    window.location = url;
}

$(function(){
    //hides address bar in iOS
    window.addEventListener('load', function(e){
            setTimeout(function(){ window.scrollTo(0,1); },1);
            overlay.hide();
            if (window.location.pathname.search('shared') != -1) {
                    alert("You have shared it!");
            }
    });

    // touch device test
    var is_touch_device = function() {
            return !!('ontouchstart' in window) ? 1 : 0;
    };

    // overlay
    var overlay = {};
    overlay.show = function(html){
            $("#overlay").html(html).animate({opacity: 1}, 200, "ease").show();
    };
    overlay.hide = function(){
            //hide overlay
            setTimeout(function(){
                    $("#overlay").animate({opacity: 0}, 300, "ease");
                    setTimeout(function(){
                            $("#overlay").hide();
                    }, 300);
            }, 300);
    };
});
