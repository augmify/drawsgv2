var _ = require("underscore");
//auth variables
var auth = function(){
	if (process.env.NODE_ENV === "production") {
		return {
			fb: {
				appId: '288870107870689',
				appSecret: 'bcac09b947d5c772c280be2e4b0b3b51'
			}
		};
	} else {
		return {
			fb: {
                //appId: '431884766836774',
				//appSecret: 'd02601ec29069dd11e9b41cc83f71cc9'
                appId: '465339993513205',
				appSecret: 'e329bd836281626bc9ffddaaf8eba16e'
			}
		};
	}
};

//Mobile detection
var ismobile = function(req){
  var ua = req.header('user-agent');
  var mobile = /mobile/i.test(ua);
  return mobile;
};

//Basic Views Variables
var bootstrap = function(req){
	var x = {};
	x.env = process.env.NODE_ENV; 
	x.useragent = ismobile(req);
	x.title = "DrawSg";
	return x;
};

//image server
var imagehost = function(){
	if (process.env.NODE_ENV === "production") {
		return "http://img.drawsg.sg/";
	} else {
		return "http://drawsgv2.augmify.com/uploads/";
	}
};
var host = function(){
	if (process.env.NODE_ENV === "production") {
		return "http://drawsg.sg/";
	} else {
		return "http://drawsgv2.augmify.com/";
	}
};

var postImage = function (accessToken, imagePath, caption, successCB) {
	var graph = require('fbgraph'); graph.setAccessToken(accessToken);
	var data = {
		url: imagePath,
		// url: "http://img.drawsg.sg/5af3640dba6bg5.png",
		message: caption,
		method: "POST"
	};
	graph
	.get("/me/photos", data, function (e, r) {
		console.log(r);
		console.log(e);
		if (e==null) {
			successCB();
		}
	});
}


//exports
exports.ismobile = ismobile;
exports.bootstrap = bootstrap;
exports.auth = auth();
exports.imagehost = imagehost();
exports.host = host();
exports.postImage = postImage;
