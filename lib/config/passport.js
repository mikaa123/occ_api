'use strict';

var TwitterStrategy = require('passport-twitter').Strategy,
	LocalStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function (app, passport) {
	/*
	 * Strategy verifications
	 */

	 passport.use(new LocalStrategy({
		 	usernameField: 'username',
		 	passwordField: 'password'
	 	},
	 	function (username, password, done) {
	 		console.log('in localstrategy');
	 		User.findOne({ username: username }, function (err, user) {
	 			if (err) {
	 				console.log('in LocalStrategy: error', err);
	 				return done(err);
	 			}

	 			if (!user) {
	 				console.log('in LocalStrategy: cant find user.');
	 				return done(null, false, { message: 'User not found.'});
	 			}

	 			if (!user.isPasswordValid(password)) {
					return done(null, false, { message: 'invalid login or password' });
				}

	 			return done(null, user);
	 		});
	 	}));

	// Called right after the user is logged with twitter. It gives us its
	// profile and we can match it with one of our users.
	passport.use(new TwitterStrategy(
		app.config.auth.twitter,
		function(req, accessToken, tokenSecret, profile, done) {

			User.findOne({ 'twitter.id_str': String(profile.id) }, function (err, existingUser) {
				var user;

				if (err) { return done(err); }
				if (existingUser) { return done(err, existingUser); }

				// The user does not exist in out db.
				// So let's create her.

				user = new User();

				user.twitter = profile._json;
				user.profile_picture = profile._json.profile_image_url;
				user.username = profile.username;
				user.tokens.push({
					kind: 'twitter',
					accessToken: accessToken,
					tokenSecret: tokenSecret
				});

				user.save(function(err) {
					done(err, user);
				});
			});
		}
	));


	/*
	 * Session handling
	 */

	// These methods are used to serialize and deserialize a user
	// from the sessions.
	passport.serializeUser(function(user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done) {
	    User.findOne({ _id: id }, function (err, user) {
	      done(err, user);
	    });
	});
};
