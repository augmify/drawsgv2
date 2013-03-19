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


	var app = function(){
		window.location.href = '/app';
	};
	var browse = function(){
		window.location.href = '/browse';
	};

	//actions
	var like = function(){
		if ($("#like").hasClass("liked")) {
			//update display
			$("#likescount").html( parseInt($("#likescount").html(),10) - 1 );
			//update button
			$("#like").html("like").removeClass("liked");
			overlay.flash("<div id='info'><span>unliked.</span><div class='overlayicon' id='heart'></div></div>");
			//post
			$.post(window.location.pathname,{
				type: "unlike"
			},function(response){

			});
		} else {
			//update display
			$("#likescount").html( parseInt($("#likescount").html(),10) + 1 );
			//update button
			$("#like").html("unlike").addClass("liked");
			overlay.flash("<div id='info'><span>liked!</span><div class='overlayicon' id='heart'></div></div>");
			//post
			$.post(window.location.pathname,{
				type: "like"
			},function(response){
				
			});
		}
	};
	var postcomment = function(msg){
		$.post(window.location.pathname, {
			type: "comment",
			comment: msg
		}, function(response){
			location.reload();
		});
	};

	var comment = function(){
		var caption = _.template("<div id='caption'><div id='close'></div><a id='title'>Add a Comment!</a><textarea id='captiontext' autofocus name='caption'></textarea><a id='submit'>Submit</a></div>");
		$("#overlay").html(caption()).animate({opacity: 1}, 100, "ease").show();
		$("#captiontext").focus();
			
		$("#submit").on('click', function(){
				postcomment($("#captiontext").val());
				setTimeout(function(){
					$("#overlay").hide();
				}, 300);
			});
		$("#close").on('click', function(){
			setTimeout(function(){
			$("#overlay").hide();
		}, 300);
		});
	};	

	var share = function(){
		window.location.href = '/fb' + window.location.pathname;
	};

	var del = function(){
		var sure = confirm("Are you sure you want to delete this image?");
		if (sure) {
			post_to_url(window.location.pathname, {type: "delete"});
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
