var mongo = require('mongodb'),
    Server = mongo.Server,
    Db = mongo.Db,
    ObjectID = mongo.ObjectID;

//sets up a configuration for the connection & auto_reconnect tells the driver to retry sending a command to the server if there is a failure
var server = new Server('localhost', 27017, {auto_reconnect: true});
var db = new Db('drawsg', server);

//private functions
var m = {};
//
db.open(function(err, db) {
    //ensure that we have mongodb up and running before app can be launched
        if(err) throw new Error('Unable to connect to MongoDB, Please Check Connection');
	else console.log("Connected to mongoDB");

	db.collection('images', function(err, images){
		var stream = images.find().stream();

		stream.on("data", function(image){
			var age = image._id.getTimestamp();
			images.update({_id: image._id},{$set: {age: age}});
		});
	});
});
