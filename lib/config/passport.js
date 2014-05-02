'use strict';

var TwitterStrategy = require('passport-twitter').Strategy;

module.exports = function (app, passport) {
	passport.serializeUser(function(user, done) {
		console.log('serializing');
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		console.log('deserializing');
		done(null, obj);
	});


	passport.use(new TwitterStrategy(
		app.config.auth.twitter,
		function(req, accessToken, tokenSecret, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function () {

				console.log('in twitter strategy');
				return done(null, profile);
			});
		}
	));
};
