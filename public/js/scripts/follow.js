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

function post_to_url(path, params, method) {
            // Set method to post by default, if not specified.
            method = method || "post";

            var form = document.createElement("form");
            form.setAttribute("method", method);
            form.setAttribute("action", path);

            for(var key in params) {
                    if(params.hasOwnProperty(key)) {
                            var hiddenField = document.createElement("input");
                            hiddenField.setAttribute("type", "hidden");
                            hiddenField.setAttribute("name", key);
                            hiddenField.setAttribute("value", params[key]);

                            form.appendChild(hiddenField);
                    }
            }

            document.body.appendChild(form);
            form.submit();
    }

    overlay.flash = function(html){
            $("#overlay").html(html).animate({opacity: 1}, 100, "ease").show();
            overlay.hide();
    };


    var back = function(){
        var profileid = $("#profile_id").val();
        window.location.href = '/profile/'+profileid;
    };
    var follow = function(){
        var _followId =  $(this).data("uid");
        $.post('/follow', {followId:_followId},function(response){
            location.reload();
        });
    };
    var unfollow = function(){
        var _followId =  $(this).data("uid");
        $.post('/follow', {followId:_followId},function(response){
            location.reload();
        });
    };
    
    var viewProfile = function(){
        var profileid =  $(this).data("uid");
        window.location.href = '/profile/'+profileid;
    };
    
    
    $('#follow').click(function(){
            
	});
        $('#unfollow').click(function(){
            var _followId =  $('#follower_id').val();
            $.post('/unfollow', {followId:_followId},function(response){
                    alert(reponse);
                location.reload();
            });
	});
    
    
    if (is_touch_device()){
		$("#back").tap(back);
		$(".follow-btn").tap(follow);
                $(".unfollow-btn").tap(unfollow);
                $(".uline, .uline img, .uline .username").tap(viewProfile);

	} else {
		$("#back").on('click', back);
                $(".unfollow-btn").on('click', follow);
                $(".unfollow-btn").on('click', unfollow);
                $(".uline, .uline img, .uline .username").tap(viewProfile);
	}
});
