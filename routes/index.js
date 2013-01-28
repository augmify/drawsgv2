var fs = require('fs'),
    utils = require('../utils'),
    redis = require('../models/redis'),
    mongo = require('../models/mongo'),
		_ = require("underscore");
    querystring = require('querystring');

/**
* FILTERS
*/
exports.desktopfilter = function(req,res,next){
  if (utils.ismobile(req)){
    return next();
  } else {
    return res.redirect('/welcome');
  }
};
exports.mobilefilter = function(req,res,next){
  if (utils.ismobile(req)){
    res.redirect('/');
  } else {
    return next();
  }
};

/**
* MOBILE ROUTES
*/
/**
* GET requests
*/
exports.landing = function(req, res){
  if (req.loggedIn) return res.redirect('/app');

  var variables = utils.bootstrap(req);
  res.render('landing', variables);
};
exports.app = function(req, res){
  if (!req.loggedIn) return res.redirect('/');

  var variables = utils.bootstrap(req);
  variables.user = req.user;
  res.render('app', variables);
};
exports.likes = function(req, res){
  if (!req.loggedIn) return res.redirect('/');

  mongo.MostLikedImages(function(err, images){
    var variables = utils.bootstrap(req);
    variables.user = req.user;
    variables.imghost = utils.imagehost;
    variables.images = images;
    res.render('likes', variables);
  });

};
exports.browse = function(req, res){
  if (!req.loggedIn) return res.redirect('/');

  mongo.popularImages(28, function(err, images){
    var variables = utils.bootstrap(req);
    variables.user = req.user;
    variables.imghost = utils.imagehost;
    variables.images = images;
    res.render('browse', variables);
  });
};
exports.draw = function(req, res){
  if (!req.loggedIn) return res.redirect('/');

  var variables = utils.bootstrap(req);
  variables.user = req.user;
  res.render('draw', variables);
};
exports.image = function(req,res){
  var imgid = req.params.imgid;
	var shared = req.params.shared;

  mongo.getImage(imgid, function(err, img){
    if (err || !img){
      //smth went wrong handle error
      res.send("error");
      return;
    }
    
    var variables = utils.bootstrap(req);
    if (req.user){
      variables.user = req.user;
      variables.newimg = req.session.imgid ? true : false;
      variables.liked = req.user.imagesliked && req.user.imagesliked.indexOf(imgid) > -1;
      variables.owner = req.user.id === img.uid;
      delete req.session.imgid;
    } else {
      variables.user = "guest";
    }
    
    variables.imghost = utils.imagehost;
    variables.img = img;
		variables.shared = shared;
    res.render('image', variables);
  });
};
exports.register = function(req,res){
  if (req.loggedIn) return res.redirect('/app');
  var variables = utils.bootstrap(req);
  res.render('register',variables);
};
exports.doRegister = function(req,res){
  if (req.loggedIn) return res.redirect('/app');
  var username = req.body.username;
  var password = req.body.password;
  var confirmpassword = req.body.confirmpassword;
  res.writeHead(200,{'Content-Type':'text/plain'});
  res.write(username);
  res.write(password);
  res.write(confirmpassword);
  res.end();
    
}
exports.doLogin = function(req,res){
  if (req.loggedIn) return res.redirect('/app');
  var username = req.body.username;
  var password = req.body.password;
  console.log(username,password);
  res.writeHead(200,{'Content-Type':'application/json'});
  if(username == 'chenwei' && password == 'test'){
    console.log("login succeed");
    //res.json({"result":0});
    res.write('{"result":0}');
  }else{
    console.log("login fail");
    //res.json({"result":1});
    res.write('{"result":1}');
  }
  res.end();
};
exports.fbimage = function(req,res){
	console.log("fbimage");
	// check user permissions first
	var graph = require("fbgraph");
	graph.setAccessToken(req.user.accessToken);
	console.log(req.user);
	graph.get("/me/permissions", function (e, r) {
		if (e==null) {
			var perms = r.data[0];
			if (_.has(perms, "publish_stream") && perms.publish_stream == 1) {
				console.log("can publish stream");

				var imgid = req.params.imgid;
				mongo.getImage(imgid, function(err, img){
					if (err || !img){
						//smth went wrong handle error
						res.send("error");
						return;
					}
					var redirecturl = utils.host + "image/" + imgid + "/shared";
					var imageUrl = utils.imagehost + encodeURIComponent(img.name);
					var successCB = function () {
						res.redirect(redirecturl);
					};

					utils.postImage(req.user.accessToken, imageUrl, img.caption+' \nBy:'+img.uname, successCB);
				});
			} else {
				console.log("cannot publish stream");
				res.redirect("/auth/facebook");
			}
		}
	});
};

/**
* POST requests
*/
exports.browseimages = function(req, res){
  if (!req.loggedIn) {
    return res.send(401);
  }

  var type = req.body.type;

  if (type === "yours"){
    return mongo.ImagesByUser(req.user.id, function(err, imgs){
      if (err){
        console.log(err);
        return res.json({status: "error"});
      }
      return res.json({
        status: "success",
        response: imgs
      });
    });
  } else if (type === "latest"){
    return mongo.latestImages(function(err, imgs){
      if (err){
        console.log(err);
        return res.json({status: "error"});
      }
      return res.json({
        status: "success",
        response: imgs
      });
    });
  } else if (type === "popular"){
    return mongo.popularImages(28, function(err, imgs){
      if (err){
        console.log(err);
        return res.json({status: "error"});
      }
      return res.json({
        status: "success",
        response: imgs
      });
    });
  } else if (type === "likes"){
    return mongo.MostLikedImages(function(err, imgs){
      if (err){
        console.log(err);
        return res.json({status: "error"});
      }
      return res.json({
        status: "success",
        response: imgs
      });
    });
  }
  res.json([]);
};
exports.updatecaption = function(req,res){
  if (!req.loggedIn) {
    return res.send(401);
  }

  var caption = req.body.caption;
  var imgid = req.body.imgid;

  if (!imgid || imgid !== req.session.imgid) {
    return res.send(401);
  }

  //update image in mongodb.
  mongo.updateImage(imgid, caption, function(err, status){
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    res.redirect("/image/" + imgid);
  });
};
exports.imageupload = function(req, res){
  var errormsg = {
    status: "error",
    message: "There was an error saving you drawing. Please try again :)"
  };

  if (!req.loggedIn) {
    return res.send(401);
  }

  var img = req.body.image;
  var imageregexp = /^data:image\/\w+;base64,/;

  if (!imageregexp.test(img)) {
    //error
    console.log("img regexp failed");
    return res.json(errormsg);
  }
	
  var data = img.replace(imageregexp,"");
	
  if (!data) {
		//error
    console.log("image data invalid");
    return res.json(errormsg);
	}

  redis.imagecount(function(err, count){
    var userid = parseInt(req.user.id, 10);
    
    //generate unique image name.
    // hex fb id + g (seperator) + unique count (maintained by redis);
    var imgname = userid.toString(16) + "g" + String(count) + ".png";
    
    var path = __dirname + "/../public/uploads/" + imgname;

    var buffer = new Buffer(data, 'base64');
    fs.writeFile(path, buffer, function(err){
      if (err){
        console.log(err);
        return res.json(errormsg);
      }
      
      var age = Date.now();

      //store in mongodb.
      var imageobj = {
        name : imgname,
        uid : req.user.id,
        uname : req.user.name,
        likes: [],
        likecount: 0,
        score: 0,
        age: age,
        comments: [],
        status: 0
      };

      mongo.newImage(imageobj, function(err, img){
        if (err) {
          console.log(err);
          return res.json(errormsg);
        }

        //store in user session
        req.session.imgid = img._id;

        return res.json({
          status: "success",
          imgid: img._id
        });
      });
    });
  });
};
exports.updateimage = function(req, res){
  if (!req.loggedIn) {
    return res.redirect("/");
  }
  var imgid = req.params.imgid;
  var type = req.body.type;
  var val = req.body.val;

  if (type === "like") {
    mongo.likeImage(imgid, req.user.id, function(err, status){
      if (err){
        console.log(err);
        return res.send('error');
      }
      res.send('success');
    });
  } else if (type === 'unlike'){
    mongo.unlikeImage(imgid, req.user.id, function(err, status){
      if (err){
        console.log(err);
        return res.send('error');
      }
      res.send('success');
    });
  } else if (type === 'delete'){
    mongo.deleteImage(imgid, req.user.id, function(err, status){
      if (err) {
        console.log(err);
      }
      res.redirect('/browse');
    });
  }
};

/**
* DESKTOP ROUTES
*/
exports.welcome = function(req, res){
    mongo.popularImages(8, function(err, images){
    var variables = utils.bootstrap(req);
    variables.user = req.user;
    variables.imghost = utils.imagehost;
    variables.images = images;
    res.render('desktop_main', variables);
  });
};
