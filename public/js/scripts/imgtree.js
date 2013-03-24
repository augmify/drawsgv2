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
									<circle cx="{{cx}}" cy="{{cy}}" r="{{cr}}" fill="url(#img{{id}})" stroke="white" stroke-width="1" \
									data-id="{{id}}" data-url="{{url}}"/>\
								{{/image}}\
						</svg>';
	var images =$('#imgtree div[data-type=img-circle]');
	var tree = $('#tree');
	var treetop = $('#treetop');
	var data = {image: []};
	var scale = 4961/tree.width();
	var deviation_y = 200;
	var posis = [
		{r:100, x: 1500, y: 653},
		{r:50, x: 1685, y: 680},
		{r:150, x: 3277, y: 932},
		{r:120, x: 2645, y: 2018},
		{r:140, x: 2643, y: 2227},
		{r:100, x: 2357, y: 2173},
		{r:180, x: 1554, y: 1549},
		{r:100, x: 2943, y: 1616},
		{r:120, x: 1063, y: 1263},
		{r:80, x: 2622, y: 1009},
		{r:120, x: 1882, y: 1376},
		{r:140, x: 1850, y: 1846},
		{r:60, x: 789, y: 1719},
		{r:60, x: 2588, y: 1234},
		{r:130, x: 2677, y: 502},
		{r:90, x: 2353, y: 628},
		{r:60, x: 647, y: 1839},
		{r:80, x: 1247, y: 1121},
		{r:100, x: 1010, y: 1815},
		{r:80, x: 1127, y: 1699},
		{r:90, x: 1309, y: 880},
		{r:90, x: 1512, y: 946},
		{r:120, x: 1939, y: 753},
		{r:100, x: 2037, y: 1549},
		{r:60, x: 2237, y: 1996},
		{r:80, x: 2264, y: 1000},
		{r:80, x: 2274, y: 1740},
		{r:100, x: 2358, y: 1571},
		{r:70, x: 2510, y: 411},
		{r:70, x: 2952, y: 865},
		{r:60, x: 2825, y: 1099},
		{r:80, x: 2846, y: 2046},
		{r:60, x: 2971, y: 1165},
		{r:60, x: 3228, y: 1163},
		{r:100, x: 3268, y: 1396},
		{r:90, x: 3482, y: 1180},
		{r:90, x: 3482, y: 1645},
		{r:130, x: 3491, y: 1656},
		{r:90, x: 3858, y: 1270},
		{r:90, x: 3611, y: 1327},
		{r:100, x: 3614, y: 1329},
		{r:40, x: 3687, y: 1126},
		{r:100, x: 3852, y: 1244},
		{r:90, x: 4096, y: 1395},
		{r:30, x: 4183, y: 1655},

	];
	images.each(function(index, item){
		if(index >= posis.length){
		return;
		}
		$("<img/>") .attr("src", $(item).data("src")) .load(function() {
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
		var w = $(item).width(), h = $(item).height();
		var cr =  posis[index].r/ scale;
		var cx = posis[index].x / scale, cy = (posis[index].y+deviation_y) / scale; 
		var svgdata = {
			id: $(item).data('id'),
			url : $(item).data('src'),
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
		$(this).attr('stroke', "#eee");
	}, function(){
		$(this).attr('stroke', "#efefef");
	}).click(function(){
	    var url = $(this).data('url');	
		var imgnode = $('#imgtree').empty();
		var mask = $('#img-preview-mask');
		if(mask.length==0){
			mask = $('<div id="img-preview-mask"></div>').appendTo($('body'));
		}
		mask.show();
		var closefunc = "$('.img-preview').hide(200); $('#img-preview-mask').hide();";
		var preview = '<div class="img-preview">'+
							'<img class="img-preview-close" src="/img/close.png" onclick="'+ closefunc +'"/>'+
							'<img class="img-preview-pic" src="'+url+'"  style="max-width: 600px; max-height: 600px;"/>'+
						'</div>'
		var pnode = $(preview);
		var img = pnode.find('.img-preview-pic').load(function(){
			pnode.show(500);
		});
		pnode.appendTo(imgnode);
	});
});
