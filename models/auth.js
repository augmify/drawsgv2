var everyauth = require('everyauth'),
	mongo = require('./mongo'),
  utils = require('../utils'),
  conf = utils.auth,
  tls = require('tls'),
  querystring = require('querystring');

//from everyauth util
var extractHostname = function (req) {
  var headers = req.headers,
      protocol = (req.connection.server instanceof tls.Server || req.headers['x-forwarded-proto'] == 'https') ? 'https://' : 'http://',
      host = headers.host;
  return protocol + host;
};

//global
everyauth.everymodule.findUserById( function (userId, callback) {
  mongo.findUserById(userId, callback);
});
everyauth.debug = true;

//fb
everyauth.facebook
  .appId(conf.fb.appId)
  .appSecret(conf.fb.appSecret)
  .moduleTimeout(999999999)
  .handleAuthCallbackError( function (req, res) {
    res.send("you need to authenticate the application to proceed. :(");
  })
  .findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
		console.log(accessToken);
    var user = fbUserMetadata;
    user.type = 'fb';
    //expects promise
    var promise = new this.Promise();
    mongo.findOrCreateUser(user, accessToken, function(err, result){
      if (err) {
        console.log(err);
        return promise.fail(err);
      } else {
        return promise.fulfill(user);
      }
    });
    return promise;
  })
  .getAuthUri( function (req, res, next) {

    // Automatic hostname detection + assignment
    if (!this._myHostname || this._alwaysDetectHostname) {
      this.myHostname(extractHostname(req));
    }

    //console.log(this._myHostname + this._callbackPath);

    var params = {
            client_id: this._appId,
            redirect_uri: this._myHostname + this._callbackPath
        };

        //mobile detection
        var authpath;
        if (utils.ismobile(req)){
          authPath = "https://m.facebook.com/dialog/oauth";
        } else {
          authPath = "https://www.facebook.com/dialog/oauth";
        }

        
        var url = (/^http/.test(authPath)) ? authPath : (this._oauthHost + authPath);
        var additionalParams = this.moreAuthQueryParams;

    if (additionalParams) for (var k in additionalParams) {
      param = additionalParams[k];
      if ('function' === typeof param) {
        // e.g., for facebook module, param could be
        // function () {
        //   return this._scope && this.scope();
        // }
        additionalParams[k] = // cache the function call
          param = param.call(this);
      }
      if ('function' === typeof param) {
        // this.scope() itself could be a function
        // to allow for dynamic scope determination - e.g.,
        // function (req, res) {
        //   return req.session.onboardingPhase; // => "email"
        // }
        param = param.call(this, req, res);
      }
      params[k] = param;
    }
    return url + '?' + querystring.stringify(params);
  })
  .scope('email, publish_stream')
  .entryPath('/auth/facebook')
  .callbackPath('/auth/facebook/callback')
  .redirectPath('/');
