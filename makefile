all:
	mkdir -p tmp
	#css
	#parse and minify less files
	./node_modules/less/bin/lessc public/css/app.less > build/css/app.css --yui-compress
	./node_modules/less/bin/lessc public/css/landing.less > build/css/landing.css --yui-compress
	./node_modules/less/bin/lessc public/css/draw.less > build/css/draw.css --yui-compress
	./node_modules/less/bin/lessc public/css/image.less > build/css/image.css --yui-compress
	./node_modules/less/bin/lessc public/css/browse.less > build/css/browse.css --yui-compress

	./node_modules/less/bin/lessc public/css/desktop_main.less > build/css/desktop_main.css --yui-compress

	# #images
	# cp -R public/img build/

	#js
	mkdir -p build/js/scripts
	mkdir -p build/js/libs

	./node_modules/uglify-js/bin/uglifyjs -o build/js/libs/zepto.js public/js/libs/zepto.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/scripts/app.js public/js/scripts/app.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/scripts/landing.js public/js/scripts/landing.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/scripts/image.js public/js/scripts/image.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/scripts/draw.js public/js/scripts/draw.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/scripts/browse.js public/js/scripts/browse.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/scripts/likes.js public/js/scripts/likes.js
	

	cat public/js/libs/zepto.js public/js/libs/underscore.js public/js/libs/backbone.js > tmp/zub.js
	./node_modules/uglify-js/bin/uglifyjs -o build/js/libs/zub.js tmp/zub.js

images:
	cp -R public/img build/

	optipng build/img/*.png --strip all
