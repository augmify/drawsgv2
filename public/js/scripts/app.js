$(function(){
	//hides address bar in iOS
	window.addEventListener('load', function(e){
		setTimeout(function(){ window.scrollTo(0,1); },1);
	});

	// touch device test
	var is_touch_device = function() {
		return !!('ontouchstart' in window) ? 1 : 0;
	};

	var draw = function(){
		window.location.href = '/draw';
	};
	var logout = function(){
		window.location.href = '/logout';
	};

	var browse = function(){
		window.location.href = '/browse';
	};

	// login event
	if (is_touch_device()){
		$("#logout").tap(logout);
		$("#draw").tap(draw);
		$("#browse").tap(browse);
	} else {
		$("#logout").on("click", logout);
		$("#draw").on("click", draw);
		$("#browse").on("click", browse);
	}
});