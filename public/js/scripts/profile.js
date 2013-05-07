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

	var width = window.innerWidth;
	var drawing_pic_size = (width - 100) * 0.8;
	$(".img-wrapper").width(width/3.33);
	$(".img-wrapper").height(width / 3.33);
	$(".drawing_pic").width(drawing_pic_size);
	$(".drawing_pic").height(drawing_pic_size);
	$(".draw_icon").css("top",drawing_pic_size / 2);
	//$(".realimg").width(size);
	//$(".realimg").height(size);

	$('.action-item').click(function(){
		if(!$(this).hasClass('phone-style-btn')){
			$('.action-item').each(function(){
				$(this).removeClass('actived-action');
			});

			$(this).addClass('actived-action');
		}
	});
	$('#follow').click(function(){
            var _followId =  $('#follower_id').val();
            $.post('/follow', {followId:_followId},function(response){
                    alert(reponse);
                Location.reload();
            });
	});
        $('#follower-count').click(function(){
            var userid = $('#follower_id').val();
            window.location.href = '/followers/'+userid;
        });
        $('#following-count').click(function(){
            var userid = $('#follower_id').val();
            window.location.href = '/followings/'+userid;
        });
        
	$('#show-grid-action').click(function() {
		$('#image-grid').show();	
		$('#image-list').hide();	
	});

	$('#show-list-action').click(function(){
		$('#image-grid').hide();
		$('#image-list').show();
	});
    
        
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


	var app = function(){
		window.location.href = '/app';
	};
	var browse = function(){
		window.location.href = '/browse';
	};

	//actions
	var like = function(){
            var imgid = $(this).data("imgid");
            var posturl = "/image/"+imgid;
            if ($("#like").hasClass("liked")) {
                    //update display
                    $("#likescount").html( parseInt($("#likescount").html(),10) - 1 );
                    //update button
                    $("#like").removeClass("liked");
                    //post
                    $.post(posturl,{
                            type: "unlike"
                    },function(response){

                    });
            } else {
                    //update display
                    $("#likescount").html( parseInt($("#likescount").html(),10) + 1 );
                    //update button
                    $("#like").addClass("liked");
                    $.post(posturl,{
                            type: "like"
                    },function(response){

                    });
            }
	};

	var comment = function(){
            var imgid = $(this).data("imgid");
            window.location.href = '/comments/' + imgid;
	};	

	var share = function(){
            var imgid = $(this).data("imgid");
            $.post('/fb/image/'+imgid,{},function(response){
            });
	};

	var del = function(){
            var imgid = $(this).data("imgid");
            var sure = confirm("Are you sure you want to delete this image?");
            if (sure) {
                    post_to_url("/image/"+imgid, {type: "delete"});
            }
	};

	// login event
	if (is_touch_device()){
		$("#browse").tap(browse);
		$("#home").tap(app);
		$("#like").tap(like);
		$("#delete").tap(del);
		$("#comment").tap(comment);
		$("#share").tap(share);

	} else {
		$("#browse").on('click', browse);
		$("#home").on('click', app);
		$("#like").on('click', like);
		$("#share").on('click', share);
		$("#comment").on('click',comment);
		$("#delete").on('click',del);
	}
});
