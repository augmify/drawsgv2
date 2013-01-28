var redis = require("redis"),
	client = redis.createClient();
  
client.on("error", function(err){
  console.log("Error: " + err);
});

// image counter
exports.imagecount = function(callback){
	client.incr("image:count", callback);
};