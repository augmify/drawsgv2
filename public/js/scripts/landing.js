$(function(){
	//hides address bar in iOS
	window.addEventListener('load', function(e){
		setTimeout(function(){ window.scrollTo(0,1); },1);
	});

	// touch device test
	var is_touch_device = function() {
		return !!('ontouchstart' in window) ? 1 : 0;
	};

	// login event
	if (is_touch_device()){
		$("#fb").tap(function(){
			window.location.href = "/auth/facebook";
		});
	} else {
		$("#fb").on("click", function(){
			window.location.href = "/auth/facebook";
		});
	}

    $("#loginForm").submit(function(){
        var username = $("#username").val();
        var password = $("#password").val();
        if(username.length <=2){
            alert("length of username must be more than 2.");
            return false;
        }
        if(password.length <= 2){
            alert("password is too short.");
            return false;
        }
        $.post("/doLogin",$("#loginForm").serialize(),function(data){
            if(data.result == 0){
                alert("login success");
			    window.location.href = "/app";
            }else{
                alert("username or password not correct.");
            }
        });
        return false;
    });

	var tileimages = function(){
		var width = window.innerWidth - 30;
		var size = width/4 - 2 - 4;
		$(".image").width(size);
		$(".image").height(size);
	};
	tileimages();
});
