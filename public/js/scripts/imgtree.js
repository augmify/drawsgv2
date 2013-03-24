$(document).ready(function(){
	var circle_template = '<svg id="svg" class="svg-circle">\
							<defs>\
								{{#image}}\
									<pattern id="img{{id}}" patternUnits="userSpaceOnUse" width="{{pw}}" height="{{ph}}">\
										<image xlink:href="{{url}}" x="{{ix}}" y="{{iy}}" width="{{iw}}" height="{{ih}}" />\
									</pattern>\
								{{/image}}\
							</defs>\
								{{#image}}\
									<circle cx="{{cx}}" cy="{{cy}}" r="{{cr}}" fill="url(#img{{id}})" stroke="white" stroke-width="1" onclick="alert();"/>\
								{{/image}}\
						</svg>';
	var images =$('#imgtree img[data-type=img-circle]');
	var tree = $('#tree');
	var treetop = $('#treetop');
	var data = {image: []};
	var scale = 4961/600;
	var deviation_y = 200;
	var posis = [
		{r:100, x: 1500, y: 653},
		{r:50, x: 1685, y: 680},
		{r:150, x: 3277, y: 932},
		{r:120, x: 2645, y: 2018},
		{r:180, x: 1554, y: 1549},
		{r:100, x: 2943, y: 1616},
		{r:120, x: 1063, y: 1263},

	];
	images.each(function(index, item){
		if(index >= posis.length){
		return;
		}
		$("<img/>") .attr("src", $(item).attr("src")) .load(function() {
			// pic_real_width = this.width; 
			// pic_real_height = this.height;
			var image = $('#img'+$(item).data('id')+' image');
			var width = Number(image.attr('width'));
			var height = Number(image.attr('height'));
			var px = Number(image.attr('x'));
			var py = Number(image.attr('y'));
			if(this.width > this.height){
				var nw =  width * this.width/this.height;
				image.attr('width',nw);
				image.attr('x', px - (nw-width)/2);
			}else if(this.height > this.width){
				var nh =  height * this.height/this.width;
				image.attr('height',nh);
				image.attr('y', py - (nh - height)/2);
			}
		});
		$(item).removeAttr("width"); 
		$(item).removeAttr("height");
		var w = $(item).width(), h = $(item).height();
		var cr =  posis[index].r/ scale;
		var cx = posis[index].x / scale, cy = (posis[index].y+deviation_y) / scale; 
		var svgdata = {
			id: $(item).data('id'),
			url : $(item).attr('src'),
			// url : "http://images.google.com/intl/en_ALL/images/logos/images_logo_lg.gif",
			pw : cx + cr,
			ph : cy + cr,
			ix : cx -cr,
			iy : cy -cr,
			iw : 2* cr, 
			ih : 2 * cr, 
			cx : cx,
			cy : cy,
			cr : cr,
		};

		data.image.push(svgdata);
				
	})
	var cs = $(Mustache.render(circle_template, data));

	tree.append(cs);
	cs.find('circle').hover(function(){
		$(this).attr('stroke', "green");
	}, function(){
		$(this).attr('stroke', "#efefef");
	});
});
