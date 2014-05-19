'use strict';

var passport = require('passport'),
	mongoose = require('mongoose'),
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

		// Token creation route
		.post('/tokens', passport.authenticate('basic', { session: false }),
			function (req, res, next) {
				var user = req.user;

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
