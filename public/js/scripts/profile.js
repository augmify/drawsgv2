$(function(){
	var width = window.innerWidth - 3;
	var size = width/4 - 2 - 3;
	$(".image").width(size);
	$(".image").height(size);
	$(".realimg").width(size);
	$(".realimg").height(size);

	$('.action-item').click(function(){
		if(!$(this).hasClass('phone-style-btn')){
			$('.action-item').each(function(){
				$(this).removeClass('actived-action');
			});

			$(this).addClass('actived-action');
		}
	});
	$('#follow').click(function(){
		alert("wanna to follow...");
	});
	$('#show-grid-action').click(function() {
		$('#image-grid').show();	
		$('#image-list').hide();	
	});

	$('#show-list-action').click(function(){
		$('#image-grid').hide();
		$('#image-list').show();
	});
});
