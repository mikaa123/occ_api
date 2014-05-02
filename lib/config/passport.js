'use strict';

var TwitterStrategy = require('passport-twitter').Strategy,
	mongoose = require('mongoose'),
	User = mongoose.model('User');

module.exports = function (app, passport) {
	/*
	 * Strategy verifications
	 */

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
