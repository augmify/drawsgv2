$(function(){
	//hides address bar in iOS
	window.addEventListener('load', function(e){
		setTimeout(function(){ window.scrollTo(0,1); },1);
	});
	// touch device test
	var is_touch_device = function() {
		return !!('ontouchstart' in window) ? 1 : 0;
	};


	var overlay = {};
	overlay.show = function(){
		$("#overlay").animate({opacity: 1}, 200, "ease").show();
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

	var app = {};
	
	app.images = Backbone.Collection.extend({
		initialize: function(){
			_.bindAll(this, "fetch", "fetchlikes");
		},
		fetch: function(type, callback){
			var that = this;
			$.post('/browse', {
				"type" : type
			}, function(response){
				if (response.status === "error"){
					//handle error
					return;
				}
				that.reset(response.response);
				callback();
			}, "json");
		},
		fetchlikes: function(callback){
			this.fetch('likes', callback);
		}
	});

	app.imageview = Backbone.View.extend({
		tagName: "a",
		className: "image",
		render: function(){
			var img = _.template("<img src='" + imghost +"<%= name %>'/>");
			this.$el.attr("href", "/image/" + this.model.get("_id"));
			this.$el.html(img(this.model.toJSON()));
			return this;
		}
	});

	app.imagesview = Backbone.View.extend({
		el: "#images",
		initialize: function(){
			this.collection = new app.images();
			this.collection.on("reset", this.render, this);
			_.bindAll(this, "refresh");
		},
		render: function(){
			if (this.collection.models.length > 0){
				var fragment = document.createDocumentFragment();
				_.each(this.collection.models, function(image){
					var x = new app.imageview({model: image});
					fragment.appendChild(x.render().el);
				});

				this.$el.html(fragment);
				this.tileimages();
			} else {
				this.$el.html("<a>no images :( draw one!</a>");
			}
			return this;
		},
		tileimages: function(){
			var width = window.innerWidth - 3;
			var size = width/4 - 2 - 3;
			$(".image").width(size);
			$(".image").height(size);
		},
		refresh: function(){
			this.collection.fetchlikes(function(){
				//
			});
		}
	});

	app.browseview = Backbone.View.extend({
		el: "#container",
		initialize: function(){
			this.imagesview = new app.imagesview();
			this.imagesview.tileimages();
			overlay.hide();
			var that = this;
			setTimeout(function(){
				that.imagesview.refresh();
			}, 2000);
		},
		events: function(){
			if (is_touch_device()){
				return {
					"tap #logo" : "home",
					"tap #home" : "home"
				};
			} else {
				return {
					"click #logo" : "home",
					"click #home" : "home"
				};
			}
		},
		active: function($el){
			$(".active").removeClass("active");
			$el.addClass("active");
		},
		home: function(){
			window.location.href = '/';
		}
	});

	var page = new app.browseview();
});