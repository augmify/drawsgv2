function imgClick(url){
    window.location = url;
}

$(function(){
	var width = window.innerWidth - 3;
	var drawing_pic_size = (width - 100) * 0.8;
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
	$('#show-grid-action').click(function() {
		$('#image-grid').show();	
		$('#image-list').hide();	
	});

	$('#show-list-action').click(function(){
		$('#image-grid').hide();
		$('#image-list').show();
	});
});
