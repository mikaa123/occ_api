'use strict';

var	LocalStrategy = require('passport-local').Strategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
	mongoose = require('mongoose'),
	jwt = require('jwt-simple'),
	User = mongoose.model('User');

module.exports = function (app, passport) {
	/*
	 * Strategy definitions
	 */

	 passport.use(new LocalStrategy({
		 	usernameField: 'username',
		 	passwordField: 'password'
	 	},
	 	function (username, password, done) {
	 		User.findOne({ username: username }, function (err, user) {
	 			if (err) {
	 				return done(err);
	 			}

	 			if (!user) {
	 				return done(null, false, { message: 'User not found.'});
	 			}

	 			if (!user.isPasswordValid(password)) {
					return done(null, false, { message: 'invalid login or password' });
				}

	 			return done(null, user);
	 		});
	 	}
	 ));

	 passport.use(new BearerStrategy(
	 	function (token, done) {
	 		var decoded = jwt.decode(token, process.env.TOKEN_SECRET),
	 			userId = decoded.userId;

	 		User.findOne({ _id: userId }, function (err, user) {
	 			if (err) { return done(err); }
	 			if (!user) { return done(null, false, { message: 'User not found.' }); }
	 			return done(null, user);
	 		});
	 	}
	 ));
};
