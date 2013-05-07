var express = require('express'),
    connect = require('connect'),
    routes = require('./routes'),
    http = require('http'),
    utils = require('./utils'),
    everyauth = require('everyauth'),
    auth = require('./models/auth'),
    MemStore = require('express/node_modules/connect/lib/middleware/session/memory'),
    store = new MemStore({reapInterval: 50000});
//    sessionstore = new require('connect-redis')(express),
//    redisstore = new sessionstore();

var app = express();
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon(__dirname + '/public/img/favicon.png'));
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser("$%^&%^&*asdfasdf"));
  app.use(express.session({secret: 'your secret here', store: store, cookie: {maxAge: 300000}}));
//  app.use(express.session({store: redisstore,cookie: {maxAge: 1000*60*60*24*7}}));
  app.use(everyauth.middleware());
  app.use(app.router);
});

app.configure('local', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  app.use(express['static'](__dirname + '/public'));
});

app.configure('development', 'production', function(){
  app.use(express.errorHandler());
  var oneday = 86400000;
  app.use(express['static'](__dirname + '/build', { maxAge: oneday*7 }));
});


/**
* ROUTES
*/
// Filters
var dfilter = [routes.desktopfilter];
var mfilter = [routes.mobilefilter];

/**
* Mobile Routes
*/
//GET
app.get('/', dfilter, routes.landing);
app.get('/app', dfilter, routes.app);
app.get('/draw', routes.draw);

app.get('/browse', routes.browse);
app.get('/likes', routes.likes);
app.get('/image/:imgid/:shared?', routes.image);
app.get('/comments/:imgid', routes.comment);
app.get('/fb/image/:imgid', routes.fbimage);

app.get('/profile/:userid',routes.profile);
app.get('/followers/:userid', routes.followers);
app.get('/followings/:userid', routes.followings);
app.get('/register',routes.register);
//POST
app.post('/image', routes.imageupload);
app.post('/browse', routes.browseimages);
app.post('/draw', routes.updatecaption);
app.post('/image/:imgid', routes.updateimage);
app.post('/follow',routes.follow);
app.post('/unfollow', routes.unfollow);
app.post('/doLogin',routes.doLogin);
app.post('/doRegister',routes.doRegister);

/**
* Desktop Routes
*/
app.get('/welcome', mfilter, routes.welcome);



var server = http.createServer(app);
var port = 80;
server.listen(port);
console.log("Express server listening on port %d in %s mode", port, process.env.NODE_ENV); // when boot using forever, try `sudo NODE_ENV=xxx forever start app` 
