$(function(){
	//hides address bar in iOS
	window.addEventListener('load', function(e){
		setTimeout(function(){ window.scrollTo(0,1); },1);
		overlay.hide();
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
	var back = function(){
                 var imgId = $("#hidden_imgid").val();
		window.location.href = '/image/'+ imgId;
	};

	var comment = function() {
            var val = $("#cinput").val().trim().substring(0,255);
            if(val.length >0){
                var imgId = $("#hidden_imgid").val();
                var postPath = "/image/" + imgId;
                $.post(postPath, {
			type: "comment",
			comment: val
		}, function(response){
			location.reload();
		});
            }
        }

	// login event
	if (is_touch_device()){
		$("#back").tap(back);
		$("#home").tap(app);
		$("#sendbtn").tap(comment);

	} else {
		$("#back").on('click', back);
		$("#home").on('click', app);
		$("#sendbtn").on('click',comment);
	}
});
