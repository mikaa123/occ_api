'use strict';

var	BasicStrategy = require('passport-http').BasicStrategy,
	BearerStrategy = require('passport-http-bearer').Strategy,
	mongoose = require('mongoose'),
	jwt = require('jwt-simple'),
	User = mongoose.model('User');

module.exports = function (app, passport) {
	/*
	 * Strategy definitions
	 */

	 passport.use(new BasicStrategy(
	 	function (username, password, done) {
	 		User.findOne({ username: username }, function (err, user) {
	 			if (err) {
	 				return done(err);
	 			}

	 			if (!user) {
	 				return done(null, false, { message: 'User not found'});
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
	 		var decoded;

	 		try {
	 			decoded = jwt.decode(token, process.env.TOKEN_SECRET);
	 		} catch (err) {
	 			return done(null, false, { message: 'Bad token' });
	 		}

	 		if (decoded.exp < Date.now()) {
	 			return done(null, false, { message: 'Token is expired'});
	 		}

	 		User.findOne({ _id: decoded.userId }, function (err, user) {
	 			if (err) { return done(err, false, { message: 'Bad token' }); }
	 			if (!user) { return done(null, false, { message: 'User not found' }); }
	 			return done(null, user);
	 		});
	 	}
	 ));
};
