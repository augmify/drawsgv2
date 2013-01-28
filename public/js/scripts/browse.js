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
			_.bindAll(this, "fetch", "fetchyours");
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
		fetchyours: function(callback){
			this.fetch('yours', callback);
		},
		fetchlatest: function(callback){
			this.fetch('latest', callback);
		},
		fetchpopular: function(callback){
			this.fetch('popular', callback);
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
		showyours: function(){
			overlay.show();

			this.collection.fetchyours(function(){
				overlay.hide();
			});
		},
		showpopular: function(){
			overlay.show();

			this.collection.fetchpopular(function(){
				overlay.hide();
			});
		},
		showlatest: function(){
			overlay.show();

			this.collection.fetchlatest(function(){
				overlay.hide();
			});
		},
		tileimages: function(){
			var width = window.innerWidth - 3;
			var size = width/4 - 2 - 3;
			$(".image").width(size);
			$(".image").height(size);
		}
	});

	app.browseview = Backbone.View.extend({
		el: "#container",
		initialize: function(){
			this.imagesview = new app.imagesview();
			this.imagesview.tileimages();
			overlay.hide();
		},
		events: function(){
			if (is_touch_device()){
				return {
					"tap #logo" : "home",
					"tap #home" : "home",
					
					"tap #yours" : "showyours",
					"tap #latest" : "showlatest",
					"tap #popular" : "showpopular"
				};
			} else {
				return {
					"click #logo" : "home",
					"click #home" : "home",

					"click #yours" : "showyours",
					"click #latest" : "showlatest",
					"click #popular" : "showpopular"
				};
			}
		},
		showyours: function(){
			if (this.$("#yours").hasClass("active")) return;
			this.active($("#yours"));

			this.imagesview.showyours();
		},
		showlatest: function(){
			if (this.$("#latest").hasClass("active")) return;
			this.active($("#latest"));
			this.imagesview.showlatest();
		},
		showpopular: function(){
			if (this.$("#popular").hasClass("active")) return;
			this.active($("#popular"));
			this.imagesview.showpopular();
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