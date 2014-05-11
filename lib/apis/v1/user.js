'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
	users = require('express').Router(),
	jwt = require('jwt-simple'),
	User = mongoose.model('User');

// This is the place where the token gets generated.
function createToken(user) {
	var expireIn = function (seconds) {
		return new Date(Date.now() + ( seconds * 1000)).getTime();
	};
	return jwt.encode({
		userId: user.id,
		exp: expireIn(3600)
	}, process.env.TOKEN_SECRET);
}

/**
 * Creates an error to send down the middleware stack.
 *
 * Usage:
 * next(422, 'Validation failed', [{ field: 'username', message: 'Username too short'}]));
 *
 * @param  {Number} status  HTTP status code of the error
 * @param  {String} msg     A textual description of the error
 * @param  {Array} reasons  An array of Objects that describe the different reasons for the error
 * @return {Error}          an Error object
 */
function error(status, msg, reasons) {
	var err = new Error(msg);
	err.status = status;
	err.reasons = reasons;
	return err;
}

module.exports = function (router) {

	router

		// User creation route
		.post('/users', function (req, res, next) {
			var reqBody = req.body,
				user,
				err;

			// No parameters passed in the body
			if (JSON.stringify(reqBody) === '{}') {
				return next(error(400, "Body should be a JSON hash"));
			}

			user = new User(reqBody);

			user.save(function (err, newUser) {
				var constructError = function () {
					console.log(Object.keys(err.errors));
					return Object.keys(err.errors).map(function (k) {
						return {
							field: k.match('password') ? 'password' : k,
							message: err.errors[k].message
						};
					});
				};

				if (err) {
					return next(error(422, 'Validation failed', constructError()));
				}

				res.answer({
					token: createToken(newUser)
				});
			});
		})

		// Token creation route
		.post('/tokens', passport.authenticate('local', { session: false }),
			function (req, res, next) {
				var user = req.user,
					token;

				if (!user) {
					return;
				}

				res.answer({
					token: createToken(user)
				});
			}
		)

		// Protected call example
		.get('/protectedCall', passport.authenticate('bearer', { session: false }),
			function (req, res, next) {
				res.answer({
					welcome: "protected call done"
				});
			}
		);

};
