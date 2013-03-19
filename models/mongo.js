var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;

//sets up a configuration for the connection & auto_reconnect tells the driver to retry sending a command to the server if there is a failure
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('drawsg', server);

//private functions
var m = {};

db.open(function(err, db) {
    //ensure that we have mongodb up and running before app can be launched
    if(err) throw new Error('Unable to connect to MongoDB, Please Check Connection');
    else console.log("Connected to mongoDB");

    /**
    * index
    */
    //users by id.
    db.ensureIndex("users", {id : 1}, {unique: true});
    //images by likes.
    db.ensureIndex("images", {score : -1});
    //images by user.
    db.ensureIndex("images", {uid : 1});

    /**
    * Login
    */
    exports.findUserById = function(userId, callback){
        db.collection('users', function(err, users){
			if (err){
				console.log(err);
				return callback(err, null);
			}
            users.findOne({id: userId}, function(err, result){
                if (err){
                    console.log(err);
                    return callback(err, null);
                }
                return callback(null,result);
            });
        });
    };
    m.createUser = function(user, callback){
        db.collection('users', function(err, users){
            if (err){
                console.log(err);
                return callback(err, {});
            }
            users.insert(user, {safe: true}, function(err, result){
                if (err){
                    console.log(err);
                    return callback(err, {});
                }
                return callback(null, result[0]);
            });
        });
    };
    exports.findOrCreateUser = function(user, accessToken, callback){
        db.collection('users', function(err, users){
            if (err){
                console.log(err);
                return callback(err, {});
            }
            users.findOne({id: user.id}, function(err, result){
                if (err){
                    console.log(err);
                    return callback(err, {});
                } else if (!result) {
										user.accessToken = accessToken;
                    return m.createUser(user, callback);
                } else {
										// update accessToken
										result.accessToken = accessToken;
										users.update({id: result.id}, result, {safe: true}, function (err, numberOfUpdatedObjects) {
											return callback(null, result);
										});
                }
            });
        });
    };
    exports.follow = function(uid, fuid, callback){
        db.collection('users', function(err, users){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            users.update({
                id : uid
            }, {
                $addToSet :{followings: fuid}
            }, {safe: true}, function(err, result){
                callback(err, result);
            });
            users.update({
                id : fuid
            }, {
                $addToSet :{followers: uid}
            }, {safe: true}, function(err, result){
                callback(err, result);
            });
        });
    }
    /**
    * Image
    */
    exports.newImage = function(imageobj, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.insert(imageobj, {safe: true}, function(err, result){
                if (err){
                    console.log(err);
                    return callback(err, {});
                }
                return callback(null, result[0]);
            });
        });
    };
    
    exports.commentImage = function(imgid, uid, comment,callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.update({
                _id : ObjectID(imgid)
            }, {
                $addToSet :{comments: {uid:uid,comment:comment}}
            }, {safe: true}, function(err, result){
                callback(err, result);
            });
        });
    }

    exports.updateImage = function(imgid, caption, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.update({
                _id : ObjectID(imgid)
            }, {
                $set : {
                    caption : caption,
                    status: 1
                }
            }, {safe: true}, function(err, result){
                callback(err, result);
            });
        });
    };
    exports.getImage = function(imgid, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.findOne({_id: ObjectID(imgid)}, function(err, result){
                if (err) {
                    console.log(err);
                    return callback(err, {});
                }
                return callback(err, result);
            });
        });
    };
    exports.deleteImage = function(imgid, uid, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.update({_id : ObjectID(imgid), uid: uid}, {$set: {status: 0}}, {safe: true}, callback);
        });
    };

    /**
    * Likes
    */
    var incrlikes = function(imgid, uid, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.update({_id : ObjectID(imgid)}, {$addToSet : {likes: uid}}, {safe: true}, function(err, res){
                if (err) {
                    console.log(err);
                    return callback(err, {});
                }
                images.findOne({_id : ObjectID(imgid)}, function(err, result){
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    var len = result.likes.length;
                    if (len !== result.likecount){
                        images.update({_id : ObjectID(imgid)}, {$set : {likecount: len}});
                        // run cron
                        exports.popularcron();
                    }

                });
                return callback(err, res);
            });
        });
    };
    var decrlikes = function(imgid, uid, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            images.update({_id : ObjectID(imgid)}, {$pull : {likes: uid}}, {safe: true}, function(err, res){
                if (err) {
                    console.log(err);
                    return callback(err, {});
                }
                images.findOne({_id : ObjectID(imgid)}, function(err, result){
                    if (err) {
                        console.log(err);
                        return;
                    }
                    
                    var len = result.likes.length;
                    if (len !== result.likecount){
                        images.update({_id : ObjectID(imgid)}, {$set : {likecount: len}});
                        // run cron
                        exports.popularcron();
                    }

                });
                return callback(err, res);
            });
        });
    };
    exports.likeImage = function(imgid, uid, callback){
        //check if user already likes image.
        db.collection('users', function(err, users){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            users.update({id: uid}, {$addToSet : {imagesliked : imgid}}, {safe: true}, function(err, status){
                if (err) {
                    console.log(err);
                    return callback(err, {});
                }
                //incr image like
                return incrlikes(imgid, uid, callback);
            });
        });
    };
    exports.unlikeImage = function(imgid, uid, callback){
        //check if user already likes image.
        db.collection('users', function(err, users){
            if (err) {
                console.log(err);
                return callback(err, {});
            }
            users.update({id: uid}, {$pull : {imagesliked : imgid}}, {safe: true}, function(err, status){
                if (err) {
                    console.log(err);
                    return callback(err, {});
                }
                //incr image like
                return decrlikes(imgid, uid, callback);
            });
        });
    };

    /**
    * Browse
    */
    exports.latestImages = function(callback){
        var number = 28;
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            images.find({
                status: 1
            },{
                sort: {_id : -1},
                limit: number
            }).toArray(callback);
        });
    };
    exports.MostLikedImages = function(callback){
        var number = 28;
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            images.find({
                status: 1
            },{
                sort: {likecount : -1},
                limit: number
            }).toArray(callback);
        });
    };
    /**
    * Returns images based on a score.
    * likes / (age + 2)^gravity
    *   gravity = 1.8 (as per HN)
    *   age in 15 minute freshness.
    */
    exports.popularcron = function(){
        db.collection('images', function(err, images){
            if (err) {
                return console.log(err);
            }
            var stream = images.find().stream();

            var now = Date.now();
            var gravity = 1.8;

            stream.on("data", function(image){
                var age = now - image.age;

                //15 minutes freshness
                age = age/(1000*60*15);

                var score = image.likecount / Math.pow(age, gravity);

                images.update({_id : image._id}, {$set : {score: score}});
            });
        });
    };
    // run once on server restart.
    exports.popularcron();
    exports.popularImages = function(number, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            images.find({
                status: 1
            },{
                sort: {
                    score : -1,
                    _id: -1
                },
                limit: number
            }).toArray(callback);
        });
    };
    exports.ImagesByUser = function(uid, callback){
        db.collection('images', function(err, images){
            if (err) {
                console.log(err);
                return callback(err, null);
            }
            images.find({
                status: 1,
                uid: uid
            },{sort: {_id : -1}}).toArray(callback);
        });
    };
});
